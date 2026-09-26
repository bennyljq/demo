import type { XmlPhrase } from '../gameplay/piano-chart';

// Familiar words only. Keep enough choices to avoid repeats in one chart.
const WORDS: Readonly<Record<1 | 3 | 4 | 5 | 7 | 8, readonly string[]>> = {
  1: ['A', 'I'],
  3: ['ANT', 'BAG', 'BAT', 'BED', 'BEE', 'BOX', 'BUS', 'CAR', 'CAT', 'COW',
    'CUP', 'DAY', 'DOG', 'EGG', 'FAN', 'FOX', 'FUN', 'HAT', 'HEN', 'HIT',
    'HOT', 'ICE', 'JAM', 'JET', 'KEY', 'LEG', 'LIP', 'MAP', 'MOM', 'MUD',
    'NET', 'NEW', 'OAK', 'OWL', 'PAN', 'PEN', 'PET', 'PIG', 'POT', 'RAT',
    'RED', 'RUN', 'SAD', 'SEA', 'SIT', 'SKY', 'SUN', 'TEN', 'TOP', 'TOY',
    'VAN', 'WAX', 'WEB', 'WET', 'WIN', 'YES', 'ZIP'],
  4: [
    'BEAR', 'BIRD', 'BLUE', 'BOAT', 'BOOK', 'CAKE', 'CAMP', 'CATS', 'COLD', 'CORN',
    'COWS', 'DOGS', 'DOOR', 'DUCK', 'FARM', 'FISH', 'FOOD', 'FROG', 'GAME', 'GIFT',
    'GIRL', 'GOAT', 'HAND', 'HOME', 'JUMP', 'KITE', 'LAMP', 'LEAF', 'LION', 'MILK',
    'MOON', 'NEST', 'NOSE', 'PARK', 'PINK', 'RAIN', 'RICE', 'RING', 'ROAD', 'ROCK',
    'SAND', 'SHIP', 'SHOE', 'SNOW', 'SOAP', 'SONG', 'STAR', 'SWIM', 'TREE', 'WARM',
    'WIND', 'WOLF',
  ],
  5: [
    'APPLE', 'BEACH', 'BREAD', 'CHAIR', 'CLOUD', 'DANCE', 'FRUIT', 'GRAPE', 'GREEN',
    'HAPPY', 'HOUSE', 'LIGHT', 'MOUSE', 'MUSIC', 'PAPER', 'PLANT', 'RIVER', 'SMILE',
    'STONE', 'TABLE', 'TIGER', 'TRAIN', 'WATER',
  ],
  7: [
    'BALLOON', 'BEDROOM', 'BICYCLE', 'BLANKET', 'BROTHER', 'CHICKEN', 'COOKIES',
    'DOLPHIN', 'EVENING', 'FLOWERS', 'GARDENS', 'HOLIDAY', 'KITCHEN', 'LIBRARY',
    'MORNING', 'MONSTER', 'PICTURE', 'RAINBOW', 'READING', 'RUNNING', 'SUNRISE', 'TEACHER',
  ],
  8: [
    'AIRPLANE', 'BACKPACK', 'BASEBALL', 'BIRTHDAY', 'BLUEBIRD', 'CAMPFIRE', 'CHILDREN',
    'CUPBOARD', 'DINOSAUR', 'DOORBELL', 'ELEPHANT', 'FOOTBALL', 'HOMEWORK', 'HOSPITAL',
    'KEYBOARD', 'LEMONADE', 'LUNCHBOX', 'MOUNTAIN', 'NOTEBOOK', 'PANCAKES', 'PLAYTIME',
    'RAINCOAT', 'SANDWICH', 'SNOWBALL', 'SUNSHINE', 'TREASURE', 'UMBRELLA',
  ],
};

/** A reproducible source for chart tests; runtime callers supply a fresh seed. */
export function seededWordRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ state >>> 15, 1 | state);
    value ^= value + Math.imul(value ^ value >>> 7, 61 | value);
    return ((value ^ value >>> 14) >>> 0) / 0x100000000;
  };
}

/** Changes words only; source locations, holds, IDs and repeat expansion stay authored. */
export function randomizeTwinkleWords(phrases: readonly XmlPhrase[], random = Math.random): XmlPhrase[] {
  const unused = new Map<number, string[]>(Object.entries(WORDS).map(([length, words]) => [Number(length), [...words]]));
  return phrases.map(phrase => {
    const length = phrase.letters.length;
    if (phrase.word.length !== length) throw new Error(`Twinkle phrase ${phrase.id} has a word/letter-count mismatch.`);
    const pool = unused.get(length);
    if (!pool) throw new Error(`Twinkle phrase ${phrase.id} needs a ${length}-letter word bank.`);
    const choices = pool.filter(word => word !== phrase.word.toUpperCase());
    if (!choices.length) throw new Error(`Twinkle has too many ${length}-letter phrases for its word bank.`);
    const word = choices[Math.floor(random() * choices.length)];
    if (!word) throw new Error('Twinkle word random source must return a value from 0 through 1 (exclusive).');
    if (length > 1) pool.splice(pool.indexOf(word), 1);
    return { ...phrase, word };
  });
}
