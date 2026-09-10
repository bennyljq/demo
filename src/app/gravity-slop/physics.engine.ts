// ─────────────────────────────────────────────────────────────────────────────
// physics.engine.ts — Newtonian gravity simulation with adaptive algorithm
//
// - Body count ≤ BH_N  →  exact O(n²) direct summation
// - Body count  > BH_N  →  O(n log n) Barnes-Hut approximation
// - Integration: Symplectic Euler (kick-drift) — energy-conserving for games
// - Collision response: fully inelastic merge → debris shatter
// ─────────────────────────────────────────────────────────────────────────────

import {
  Body, Flash, TrailPt,
  G, EPS2, BH_N, MAX_N,
  TRAIL_MAX, TRAIL_MAX_D, TRAIL_FADE,
  PALETTE, SUN_PALETTE,
} from './gravity-slop.objects';
import { bhAccels } from './barnes-hut';

// ── ID counter ────────────────────────────────────────────────────────────────

let _uid = 0;
export function resetUID(): void { _uid = 0; }

// ── Body factory ─────────────────────────────────────────────────────────────

/** Visual radius from mass and body type. Radius ∝ cbrt(mass). */
export function bodyRadius(mass: number, type: 'sun' | 'planet' | 'debris'): number {
  return Math.cbrt(mass) * (type === 'sun' ? 2.2 : type === 'planet' ? 1.7 : 1.2);
}

/** Create a new Body with sensible defaults. colour/glowColour optional. */
export function newBody(
  x: number, y: number,
  vx: number, vy: number,
  mass: number,
  type: 'sun' | 'planet' | 'debris',
  colour?: string,
  glowColour?: string,
): Body {
  const idx = _uid % (type === 'sun' ? SUN_PALETTE.length : PALETTE.length);
  const pal  = type === 'sun' ? SUN_PALETTE[idx] : PALETTE[idx];
  return {
    id: _uid++,
    x, y, vx, vy, mass,
    radius: bodyRadius(mass, type),
    colour:    colour    ?? pal.fill,
    glowColour: glowColour ?? pal.glow,
    type,
    age: 0,
    trail: [],
  };
}

// ── Acceleration algorithms ───────────────────────────────────────────────────

/** Exact O(n²) direct summation with gravitational softening. */
function directAccels(bodies: Body[]): Float32Array {
  const out = new Float32Array(bodies.length * 2);
  for (let i = 0; i < bodies.length; i++) {
    let ax = 0, ay = 0;
    const bi = bodies[i];
    for (let j = 0; j < bodies.length; j++) {
      if (i === j) continue;
      const bj = bodies[j];
      const dx = bj.x - bi.x, dy = bj.y - bi.y;
      const d2 = dx * dx + dy * dy + EPS2;
      const d  = Math.sqrt(d2);
      const f  = G * bj.mass / d2;
      ax += f * dx / d;
      ay += f * dy / d;
    }
    out[i * 2]     = ax;
    out[i * 2 + 1] = ay;
  }
  return out;
}

// ── Physics step ─────────────────────────────────────────────────────────────

/**
 * Advance the simulation by dt seconds.
 *
 * Algorithm selection is automatic:
 *   bodies.length ≤ BH_N → directAccels  (O(n²), exact)
 *   bodies.length  > BH_N → bhAccels     (O(n log n), approximate)
 *
 * @param bodies     Current body array
 * @param dt         Time step in seconds (should be capped at ~1/30 by caller)
 * @param flashes    Flash effects array (mutated in-place)
 * @param onCollision Callback fires once per collision with (totalMass, cx, cy)
 * @returns          New body array after integration + collision resolution
 */
export function step(
  bodies: Body[],
  dt: number,
  flashes: Flash[],
  onCollision: (mass: number, x: number, y: number) => void,
): Body[] {
  if (!bodies.length) return [];

  // ── 1. Compute accelerations ──────────────────────────────
  const acc = bodies.length > BH_N ? bhAccels(bodies) : directAccels(bodies);

  // ── 2. Symplectic Euler ("kick then drift") ───────────────
  //   v(t+dt) = v(t) + a(t)·dt
  //   x(t+dt) = x(t) + v(t+dt)·dt      ← uses NEW velocity
  // More energy-conserving than forward Euler.
  const next: Body[] = bodies.map((b, i) => {
    const ax  = acc[i * 2];
    const ay  = acc[i * 2 + 1];
    const nvx = b.vx + ax * dt;
    const nvy = b.vy + ay * dt;

    // Append to trail then fade + prune old points.
    const maxT = b.type === 'debris' ? TRAIL_MAX_D : TRAIL_MAX;
    const trail: TrailPt[] = [
      { x: b.x, y: b.y, a: 1.0 },
      ...b.trail.slice(0, maxT - 1).map(p => ({ ...p, a: p.a - TRAIL_FADE })),
    ].filter(p => p.a > 0.02);

    return {
      ...b,
      vx: nvx, vy: nvy,
      x: b.x + nvx * dt,
      y: b.y + nvy * dt,
      age: b.age + 1,
      trail,
    };
  });

  // ── 3. Collision detection & response ─────────────────────
  return resolveCollisions(next, flashes, onCollision);
}

// ── Collision resolution ─────────────────────────────────────────────────────

function resolveCollisions(
  bodies: Body[],
  flashes: Flash[],
  onCollision: (mass: number, x: number, y: number) => void,
): Body[] {
  const dead = new Set<number>();
  const born: Body[] = [];

  for (let i = 0; i < bodies.length; i++) {
    if (dead.has(bodies[i].id)) continue;
    for (let j = i + 1; j < bodies.length; j++) {
      if (dead.has(bodies[j].id)) continue;

      const a = bodies[i], b = bodies[j];
      const dx   = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= a.radius + b.radius) continue; // no overlap

      // ── Collision! ──────────────────────────────────────────
      dead.add(a.id);
      dead.add(b.id);

      const tm  = a.mass + b.mass;
      // Centre-of-mass position and velocity (perfectly inelastic merge).
      const cx  = (a.x * a.mass + b.x * b.mass) / tm;
      const cy  = (a.y * a.mass + b.y * b.mass) / tm;
      const cvx = (a.vx * a.mass + b.vx * b.mass) / tm;
      const cvy = (a.vy * a.mass + b.vy * b.mass) / tm;

      const sunHit = a.type === 'sun' || b.type === 'sun';

      // ── Flash effect ─────────────────────────────────────────
      flashes.push({
        x: cx, y: cy,
        r: 0,
        maxR: bodyRadius(tm, sunHit ? 'sun' : 'planet') * 4.2,
        alpha: 1,
        t: 0, maxT: 38,
        colour: sunHit ? '#FFF9C4' : (Math.random() < 0.5 ? a.colour : b.colour),
      });

      // ── Score callback ────────────────────────────────────────
      onCollision(tm, cx, cy);

      if (sunHit) {
        // Sun absorbs the other body — stays as sun, grows.
        const winner = a.mass >= b.mass ? a : b;
        born.push(newBody(cx, cy, cvx, cvy, tm, 'sun', winner.colour, winner.glowColour));
      } else {
        // Planet/debris → shatter into N debris fragments.
        const n = (a.type === 'debris' && b.type === 'debris')
          ? 2
          : 3 + Math.floor(Math.random() * 4); // 3-6 fragments

        for (let k = 0; k < n; k++) {
          // Mass fraction per fragment (totals loosely to 60-90% of combined mass).
          const mf  = 0.07 + Math.random() * 0.12;
          // Fan out evenly + small random jitter in angle.
          const ang = (Math.PI * 2 * k) / n + (Math.random() - 0.5) * 0.65;
          // Random scatter speed; larger collisions scatter faster.
          const spd = 18 + Math.random() * 55;
          // Pick colour from one of the colliding parents.
          const src = Math.random() < 0.5 ? a : b;
          // Offset slightly to avoid immediate re-collision.
          const off = (a.radius + b.radius) * 0.38;

          born.push(newBody(
            cx + Math.cos(ang) * off,
            cy + Math.sin(ang) * off,
            cvx + Math.cos(ang) * spd,
            cvy + Math.sin(ang) * spd,
            tm * mf,
            'debris',
            src.colour,
            src.glowColour,
          ));
        }
      }
    }
  }

  let result = [...bodies.filter(b => !dead.has(b.id)), ...born];

  // ── Body cap: prune oldest debris first ──────────────────────
  if (result.length > MAX_N) {
    const debris  = result.filter(b => b.type === 'debris').sort((a, b) => b.age - a.age);
    const nonD    = result.filter(b => b.type !== 'debris');
    result = [...nonD, ...debris.slice(0, Math.max(0, MAX_N - nonD.length))];
  }

  return result;
}

