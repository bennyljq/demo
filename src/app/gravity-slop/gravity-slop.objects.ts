// ─────────────────────────────────────────────────────────────────────────────
// gravity-slop.objects.ts — shared types, constants, and colour palettes
// ─────────────────────────────────────────────────────────────────────────────

export interface Body {
  id: number;
  x: number;   // pixels
  y: number;   // pixels
  vx: number;  // px / second
  vy: number;  // px / second
  mass: number;
  radius: number;
  colour: string;    // hex fill
  glowColour: string; // hex glow / shadow
  type: 'sun' | 'planet' | 'debris';
  age: number;       // frames alive (used for debris culling)
  trail: TrailPt[];
}

export interface TrailPt {
  x: number;
  y: number;
  a: number; // alpha 0-1
}

export interface Flash {
  x: number; y: number;
  r: number; maxR: number;
  alpha: number;
  t: number; maxT: number; // current frame / total frames
  colour: string;
}

export interface ScoreEntry {
  score: number;
  collisions: number;
  date: string;
  duration: number; // seconds
}

// ── Colour palettes ───────────────────────────────────────────────────────────

export const PALETTE: { fill: string; glow: string }[] = [
  { fill: '#FF6B6B', glow: '#FF2222' },
  { fill: '#FFD93D', glow: '#FFC300' },
  { fill: '#6ECBFF', glow: '#1E9FFF' },
  { fill: '#C77DFF', glow: '#9933EE' },
  { fill: '#FF9F43', glow: '#E07700' },
  { fill: '#48CAE4', glow: '#0096C7' },
  { fill: '#F72585', glow: '#CC0077' },
  { fill: '#B5E48C', glow: '#6ABB22' },
  { fill: '#FF8FA3', glow: '#FF3355' },
  { fill: '#A2D2FF', glow: '#4499EE' },
];

export const SUN_PALETTE: { fill: string; glow: string }[] = [
  { fill: '#FFF59D', glow: '#FDD835' }, // golden
  { fill: '#FFD180', glow: '#FF8F00' }, // orange giant
  { fill: '#B3E5FC', glow: '#039BE5' }, // blue-white dwarf
];

// ── Physics constants ─────────────────────────────────────────────────────────

/** Newtonian gravitational constant (game units, px-based) */
export const G = 250;

/** Gravitational softening squared — prevents singularities at r → 0 */
export const EPS2 = 625; // 25²

/** Maximum bodies before debris culling kicks in */
export const MAX_N = 250;

/** Body count threshold: above this, switch from O(n²) → Barnes-Hut O(n log n) */
export const BH_N = 55;

/** Barnes-Hut opening angle (lower = more accurate, slower) */
export const BH_TH = 0.5;

// ── Visual constants ──────────────────────────────────────────────────────────

export const TRAIL_MAX   = 80;  // trail points for planet / sun
export const TRAIL_MAX_D = 40;  // trail points for debris
export const TRAIL_FADE  = 0.015; // alpha lost per trail point per frame

// ── Leaderboard ───────────────────────────────────────────────────────────────

export const LB_KEY = 'gravity_slop_v1';
export const LB_MAX = 10;

