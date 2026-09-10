// ─────────────────────────────────────────────────────────────────────────────
// barnes-hut.ts  —  O(n log n) gravitational force calculation via quad-tree
//
// When the body count exceeds BH_N the physics engine calls bhAccels() here
// instead of the O(n²) direct summation, keeping the simulation fast even
// with hundreds of debris fragments in play.
// ─────────────────────────────────────────────────────────────────────────────

import { Body, G, EPS2, BH_TH } from './gravity-slop.objects';

// ── Internal quad-tree node ───────────────────────────────────────────────────

interface QN {
  x: number; y: number; // region top-left
  w: number; h: number; // region size
  m: number;            // total mass
  cx: number; cy: number; // centre of mass
  body: Body | null;    // non-null only for leaf nodes
  c: [QN | null, QN | null, QN | null, QN | null]; // NW, NE, SW, SE
}

function mk(x: number, y: number, w: number, h: number): QN {
  return { x, y, w, h, m: 0, cx: 0, cy: 0, body: null, c: [null, null, null, null] };
}

/** Returns 0=NW 1=NE 2=SW 3=SE quadrant index for position (bx, by). */
function qi(n: QN, bx: number, by: number): 0 | 1 | 2 | 3 {
  return ((bx >= n.x + n.w / 2 ? 1 : 0) | (by >= n.y + n.h / 2 ? 2 : 0)) as 0 | 1 | 2 | 3;
}

/** Allocate a child sub-node for quadrant q of node n. */
function sub(n: QN, q: 0 | 1 | 2 | 3): QN {
  const hw = n.w / 2, hh = n.h / 2;
  const mx = n.x + hw, my = n.y + hh;
  switch (q) {
    case 0: return mk(n.x, n.y, hw, hh);
    case 1: return mk(mx, n.y, hw, hh);
    case 2: return mk(n.x, my, hw, hh);
    default: return mk(mx, my, hw, hh);
  }
}

/** Insert body b into (sub-)tree rooted at n. Depth-capped for safety. */
function ins(n: QN, b: Body, depth = 0): void {
  if (depth > 52) return; // pathological case safety valve

  if (n.m === 0) {
    // Empty leaf — store here directly.
    n.m = b.mass; n.cx = b.x; n.cy = b.y; n.body = b;
    return;
  }

  if (n.body !== null) {
    // Occupied leaf — promote existing body into a child, then re-insert.
    const e = n.body;
    n.body = null;
    const q = qi(n, e.x, e.y);
    if (!n.c[q]) n.c[q] = sub(n, q);
    ins(n.c[q]!, e, depth + 1);
  }

  // Update aggregate centre-of-mass.
  const tm = n.m + b.mass;
  n.cx = (n.cx * n.m + b.x * b.mass) / tm;
  n.cy = (n.cy * n.m + b.y * b.mass) / tm;
  n.m = tm;

  const q = qi(n, b.x, b.y);
  if (!n.c[q]) n.c[q] = sub(n, q);
  ins(n.c[q]!, b, depth + 1);
}

/**
 * Accumulate gravitational acceleration from tree node n onto body b.
 * Uses the Barnes-Hut criterion: if the node's angular size < BH_TH,
 * treat the whole node as a single point mass.
 */
function accumulate(n: QN, b: Body, out: Float64Array): void {
  if (n.m === 0) return;

  const dx = n.cx - b.x;
  const dy = n.cy - b.y;
  const d2 = dx * dx + dy * dy;

  if (d2 < 0.5) return; // same point — skip (handles self-interaction)

  if (n.body !== null) {
    // Leaf node.
    if (n.body.id === b.id) return; // self
    const sd = d2 + EPS2;
    const dm = Math.sqrt(sd);
    const f = G * n.m / sd;
    out[0] += f * dx / dm;
    out[1] += f * dy / dm;
    return;
  }

  // Barnes-Hut criterion: (node width)² / dist² < θ²
  if (n.w * n.w < BH_TH * BH_TH * d2) {
    // Node is "far enough" — use aggregate.
    const sd = d2 + EPS2;
    const dm = Math.sqrt(sd);
    const f = G * n.m / sd;
    out[0] += f * dx / dm;
    out[1] += f * dy / dm;
  } else {
    // Recurse into children.
    for (const child of n.c) {
      if (child) accumulate(child, b, out);
    }
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Compute gravitational accelerations for all bodies using the Barnes-Hut
 * O(n log n) approximation.
 *
 * Returns a packed Float32Array of length n*2:
 *   result[i*2]   = ax for bodies[i]
 *   result[i*2+1] = ay for bodies[i]
 */
export function bhAccels(bodies: Body[]): Float32Array {
  const out = new Float32Array(bodies.length * 2);
  if (!bodies.length) return out;

  // Compute bounding box of all bodies.
  let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
  for (const b of bodies) {
    if (b.x < mnx) mnx = b.x; if (b.y < mny) mny = b.y;
    if (b.x > mxx) mxx = b.x; if (b.y > mxy) mxy = b.y;
  }

  // Build the root node with a generous padding.
  const pad = 300;
  const sz  = Math.max(mxx - mnx, mxy - mny, 100) + pad * 2;
  const root = mk(mnx - pad, mny - pad, sz, sz);

  for (const b of bodies) ins(root, b);

  // Compute accelerations.
  const tmp = new Float64Array(2);
  bodies.forEach((b, i) => {
    tmp[0] = 0; tmp[1] = 0;
    accumulate(root, b, tmp);
    out[i * 2]     = tmp[0];
    out[i * 2 + 1] = tmp[1];
  });

  return out;
}

