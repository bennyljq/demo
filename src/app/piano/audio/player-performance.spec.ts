import { PlayerPerformance, PlayerNoteSink, wrongPitchOffset } from './player-performance';
import type { CoupledTarget } from '../gameplay/twinkle-coupling';
import { TypingRound } from '../gameplay/piano-judgement';

const targets = [
  { targetId: 'tap', targetIndex: 0, occurrence: 1, start: 1, hold: false,
    notes: [{ id: 'tap-note', pitch: 72, velocity: 81, start: 1, duration: 0.5 }] },
  { targetId: 'hold', targetIndex: 1, occurrence: 1, start: 2, hold: true,
    notes: [{ id: 'hold-note', pitch: 76, velocity: 72, start: 2, duration: 0.5 }] },
] as unknown as CoupledTarget[];

function setup() {
  let clock = 10, nextChannel = 16;
  const events: { type: 'on' | 'off'; channel: number; pitch: number; at: number }[] = [];
  const sink: PlayerNoteSink = { now: () => clock, newChannel: () => nextChannel++,
    noteOn: (channel, pitch, _velocity, at) => events.push({ type: 'on', channel, pitch, at }),
    noteOff: (channel, pitch, at) => events.push({ type: 'off', channel, pitch, at }) };
  return { player: new PlayerPerformance(targets, sink), events, setClock: (value: number) => { clock = value; } };
}

describe('player melody voices', () => {
  it('sounds taps at the physical attack but schedules their original endpoint at different rates', () => {
    const early = setup();
    expect(early.player.perform(0, 'perfect', 'KeyA', 0.9, 2)).toBeTrue();
    expect(early.events).toEqual([
      { type: 'on', channel: 16, pitch: 72, at: 10 },
      { type: 'off', channel: 16, pitch: 72, at: 10.3 },
    ]);
    expect(early.player.snapshot(1.2)[0]).toEqual(jasmine.objectContaining({ start: 0.9, pitch: 72, end: 1.2 }));
    early.setClock(10.31);
    expect(early.player.snapshot(1.6)[0].end).toBe(1.5);
    const late = setup();
    late.player.perform(0, 'good', 'KeyA', 1.1, 0.5);
    expect(late.events[0].at).toBe(10);
    expect(late.events[1].at).toBeCloseTo(10.8, 8);
    const expired = setup();
    expect(expired.player.perform(0, 'good', 'KeyA', 1.51, 1)).toBeFalse();
    expect(expired.events).toEqual([]);
  });

  it('never uses the intended pitch for wrong attacks and replaces one target voice safely', () => {
    expect([0, 1, 2, 3, 4, 5].map(attempt => Math.abs(wrongPitchOffset(0, attempt)))).toEqual([2, 1, 1, 2, 2, 1]);
    const { player, events } = setup();
    player.perform(1, 'wrong', 'KeyB', 2, 1);
    expect(Math.abs(events[0].pitch - 76)).toBeGreaterThanOrEqual(1);
    expect(Math.abs(events[0].pitch - 76)).toBeLessThanOrEqual(2);
    expect(player.snapshot(2.2)[0]).toEqual(jasmine.objectContaining({ start: 2, pitch: events[0].pitch, end: 2.2, kind: 'wrong' }));
    player.perform(1, 'perfect', 'KeyA', 2.2, 1);
    expect(events.filter(event => event.type === 'off').length).toBe(1);
    player.releasePhysical('KeyB', 2.3);
    expect(events.filter(event => event.type === 'off').length).toBe(1); // stale old keyup cannot release replacement
    player.releasePhysical('KeyA', 2.6);
    expect(events.filter(event => event.type === 'off').length).toBe(2);
    expect(player.snapshot(2.6).map(bar => bar.end)).toEqual([2.2, 2.6]);
  });

  it('keeps a correct hold sounding until physical release while scoring remains capped; wrong earns no hold credit', () => {
    const { player, events } = setup();
    const round = new TypingRound([{ index: 0, id: 'hold', word: 'A', letter: 'A', time: 2, holdEnd: 2.5, wordIndex: 0 }]);
    round.key('b', 2);
    player.perform(1, 'wrong', 'KeyB', 2, 1);
    round.keyUp('b', 2.05);
    player.releasePhysical('KeyB', 2.05);
    expect(round.earnedSustainPoints).toBe(0);
    round.key('a', 2.1);
    player.perform(1, 'good', 'KeyA', 2.1, 1);
    round.advance(2.6);
    expect(round.earnedSustainPoints).toBe(100);
    expect(events.filter(event => event.type === 'off').length).toBe(1);
    round.keyUp('a', 2.8);
    player.releasePhysical('KeyA', 2.8);
    expect(round.earnedSustainPoints).toBe(100);
    expect(player.snapshot(2.8).at(-1)?.end).toBe(2.8);
    expect(events.filter(event => event.type === 'off').length).toBe(2);
  });

  it('releases active voices and clears bars on reset without reusing a channel before a scheduled off', () => {
    const { player, events } = setup();
    player.perform(0, 'wrong', 'KeyB', 1, 1);
    player.releaseAll(1.1, true);
    expect(player.snapshot(1.1)).toEqual([]);
    player.perform(0, 'perfect', 'KeyA', 1.2, 1);
    expect(events.filter(event => event.type === 'on').map(event => event.channel)).toEqual([16, 17]);
  });

  it('keeps a missed target silent and declines a voice when all reserved channels are busy', () => {
    const { player, events } = setup();
    // A Miss is never dispatched by the judgement-to-audio bridge.
    expect(events).toEqual([]);
    const noChannel: PlayerNoteSink = { now: () => 10, newChannel: () => -1,
      noteOn: () => fail('must remain silent'), noteOff: () => fail('must remain silent') };
    expect(new PlayerPerformance(targets, noChannel).perform(0, 'perfect', 'KeyA', 1, 1)).toBeFalse();
    expect(player.snapshot(1)).toEqual([]);
  });

  it('schedules a demo tap and authored hold release ahead of the current audio clock', () => {
    const { player, events } = setup();
    player.perform(0, 'perfect', 'demo:A', 1, 1, 12);
    player.perform(1, 'perfect', 'demo:B', 2, 1, 13);
    player.releasePhysical('demo:B', 2.5, 13.5);
    expect(events).toEqual([
      { type: 'on', channel: 16, pitch: 72, at: 12 },
      { type: 'off', channel: 16, pitch: 72, at: 12.5 },
      { type: 'on', channel: 16, pitch: 76, at: 13 },
      { type: 'off', channel: 16, pitch: 76, at: 13.5 },
    ]);
    expect(player.snapshot(0.9)).toEqual([]);
  });

  it('does not reuse a retired demo channel just because the next queued attack is far ahead', () => {
    let clock = 10, nextChannel = 3;
    const events: number[] = [];
    const retired = new Set<number>();
    const sink: PlayerNoteSink = {
      now: () => clock, newChannel: () => nextChannel++, canUseChannel: channel => !retired.has(channel),
      noteOn: channel => { events.push(channel); }, noteOff: () => {},
    };
    const player = new PlayerPerformance(targets, sink);
    player.perform(0, 'perfect', 'demo:A', 1, 1, 12);
    for (const channel of player.retireUntil(20)) retired.add(channel);
    player.perform(1, 'perfect', 'demo:B', 2, 1, 22);
    expect(events).toEqual([3, 4]);
    clock = 21;
    retired.clear();
    expect(player.retireUntil(21)).toContain(3);
  });
});
