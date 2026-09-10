// ─────────────────────────────────────────────────────────────────────────────
// planet-renderer.ts
//
// Pre-renders photorealistic celestial body textures using pure Canvas 2D:
//   • Planets  — pixel-by-pixel Phong shading on a unit sphere + FBM noise
//                terrain (terrain / gas-giant / lava variants), atmosphere rim
//   • Suns     — drawn live each frame: layered corona, animated granulation,
//                chromosphere, sporadic flare arcs
//   • Debris   — irregular polygon "rocky chunks" with flat-face shading
//
// No external library required.
// ─────────────────────────────────────────────────────────────────────────────

// ── Noise primitives ─────────────────────────────────────────────────────────

/** Deterministic pseudo-random float in [0,1) from integer grid coords. */
function hash2(ix: number, iy: number): number {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

/** Bilinearly-interpolated value noise. */
function vnoise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix,        fy = y - iy;
  // Smoothstep
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix,     iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix,     iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + ((d - b) - (c - a)) * ux * uy;
}

/** Fractal Brownian Motion — layered octaves of vnoise. */
function fbm(x: number, y: number, octaves = 5): number {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v    += vnoise(x * freq, y * freq) * amp;
    amp  *= 0.5;
    freq *= 2.0;
  }
  return v;
}

// ── Colour helpers ───────────────────────────────────────────────────────────

/** Parse '#RRGGBB' → [r, g, b] as 0-255 integers. */
function hexToRgb(hex: string): [number, number, number] {
  if (!hex || hex[0] !== '#') return [128, 128, 128];
  return [
    parseInt(hex.slice(1, 3), 16) || 0,
    parseInt(hex.slice(3, 5), 16) || 0,
    parseInt(hex.slice(5, 7), 16) || 0,
  ];
}

/** Linear interpolation between two RGB triples. */
function lerpRgb(
  [r0, g0, b0]: [number, number, number],
  [r1, g1, b1]: [number, number, number],
  t: number,
): [number, number, number] {
  const s = Math.max(0, Math.min(1, t));
  return [
    Math.round(r0 + (r1 - r0) * s),
    Math.round(g0 + (g1 - g0) * s),
    Math.round(b0 + (b1 - b0) * s),
  ];
}

// ── Planet terrain palette builder ───────────────────────────────────────────

interface TerrainStop {
  t: number;
  rgb: [number, number, number];
}

/** Return a terrain colour ramp anchored to the body's base colour. */
function buildTerrainRamp(
  baseHex: string,
  glowHex: string,
  variant: 'terra' | 'gas' | 'lava' | 'ice',
): TerrainStop[] {
  const base = hexToRgb(baseHex);
  const glow = hexToRgb(glowHex);

  switch (variant) {
    case 'gas':
      // Horizontal banding: alternate between base and a lightened tone.
      return [
        { t: 0.00, rgb: glow },
        { t: 0.30, rgb: base },
        { t: 0.55, rgb: lerpRgb(base, [255, 255, 255], 0.35) },
        { t: 0.75, rgb: base },
        { t: 1.00, rgb: glow },
      ];
    case 'lava':
      // Orange-red crust with bright magma veins.
      return [
        { t: 0.00, rgb: [20, 5, 5] },
        { t: 0.35, rgb: [80, 20, 10] },
        { t: 0.55, rgb: [200, 60, 10] },
        { t: 0.70, rgb: [255, 140, 20] },
        { t: 0.85, rgb: [255, 220, 60] },
        { t: 1.00, rgb: [255, 255, 200] },
      ];
    case 'ice':
      // White / pale-blue icy world.
      return [
        { t: 0.00, rgb: [180, 220, 255] },
        { t: 0.40, rgb: [220, 240, 255] },
        { t: 0.65, rgb: [255, 255, 255] },
        { t: 0.85, rgb: [200, 230, 255] },
        { t: 1.00, rgb: base },
      ];
    default: // 'terra'
      // Ocean / land / mountain / snow.
      return [
        { t: 0.00, rgb: [10, 30, 80] },
        { t: 0.28, rgb: [15, 60, 140] },
        { t: 0.40, rgb: base },
        { t: 0.60, rgb: lerpRgb(base, [180, 160, 100], 0.5) },
        { t: 0.80, rgb: [160, 140, 120] },
        { t: 0.92, rgb: [230, 230, 230] },
        { t: 1.00, rgb: [255, 255, 255] },
      ];
  }
}

/** Sample a terrain ramp at position t ∈ [0, 1]. */
function sampleRamp(ramp: TerrainStop[], t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < ramp.length - 1; i++) {
    const lo = ramp[i], hi = ramp[i + 1];
    if (clamped >= lo.t && clamped <= hi.t) {
      const frac = (clamped - lo.t) / (hi.t - lo.t);
      return lerpRgb(lo.rgb, hi.rgb, frac);
    }
  }
  return ramp[ramp.length - 1].rgb;
}

// ── Planet texture generator ──────────────────────────────────────────────────

/** Variants cycle through deterministically based on body ID seed. */
type PlanetVariant = 'terra' | 'gas' | 'lava' | 'ice';

function variantFor(seed: number): PlanetVariant {
  const v = ['terra', 'terra', 'terra', 'gas', 'gas', 'lava', 'ice'] as PlanetVariant[];
  return v[Math.abs(seed | 0) % v.length];
}

/**
 * Pre-render a planet sphere to an offscreen HTMLCanvasElement.
 *
 * Technique:
 *   1. For each pixel inside the circle, project to unit sphere normal (nx, ny, nz).
 *   2. Sample FBM noise in spherical UV space for surface texture.
 *   3. Apply diffuse + specular Phong lighting from a fixed sun direction.
 *   4. Blend an atmospheric rim light at glancing angles.
 *
 * @param radius   Visual radius in pixels (canvas)
 * @param colour   Hex fill colour — anchors the terrain palette
 * @param glowHex  Hex glow colour
 * @param seed     Any integer — controls noise phase & terrain variant
 */
export function renderPlanetTexture(
  radius: number,
  colour: string,
  glowHex: string,
  seed: number,
): HTMLCanvasElement {
  const size = Math.max(48, Math.min(Math.ceil(radius * 2), 320));
  const cv   = document.createElement('canvas');
  cv.width   = cv.height = size;
  const ctx  = cv.getContext('2d')!;
  const img  = ctx.createImageData(size, size);
  const d    = img.data;

  const variant = variantFor(seed);
  const ramp    = buildTerrainRamp(colour, glowHex, variant);

  // Fixed sun direction (upper-left), normalised.
  const Lx = 0.45, Ly = -0.65, Lz = 0.62;
  const lLen  = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz);
  const Lnx   = Lx / lLen, Lny = Ly / lLen, Lnz = Lz / lLen;

  // Atmosphere rim colour (bluish).
  const [ar, ag, ab] = [80, 140, 255];

  // Noise offset from seed.
  const ox = (seed * 1.618) % 10;
  const oy = (seed * 2.236) % 10;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      // Normalise pixel to [-1, 1].
      const nx = (px - size / 2) / (size / 2);
      const ny = (py - size / 2) / (size / 2);
      const nzSq = 1 - nx * nx - ny * ny;

      const idx = (py * size + px) * 4;

      if (nzSq <= 0) {
        // Outside sphere — fully transparent.
        d[idx + 3] = 0;
        continue;
      }

      const nz = Math.sqrt(nzSq);

      // ── Spherical UV (seamless wrapping) ─────────────────────────
      const theta = Math.atan2(ny, nx) / (Math.PI * 2) + ox;  // 0-1 longitude
      const phi   = Math.acos(Math.max(-1, Math.min(1, nz))) / Math.PI + oy;  // 0-1 latitude

      // ── Surface noise → terrain ───────────────────────────────────
      let n: number;
      if (variant === 'gas') {
        // Gas giants: latitude-banded with shallow horizontal distortion.
        const distort = fbm(theta * 3, phi * 3, 3) * 0.15;
        n = fbm(theta * 1.5, (phi + distort) * 4, 4);
      } else {
        n = fbm(theta * 4, phi * 4, 5);
      }
      const [tr, tg, tb] = sampleRamp(ramp, n);

      // ── Phong lighting ────────────────────────────────────────────
      const dotNL  = nx * Lnx + ny * Lny + nz * Lnz;
      const diffuse = Math.max(0, dotNL);
      const ambient = 0.14;

      // Specular: V = (0,0,1), R = 2(N·L)N - L.
      const rx    = 2 * dotNL * nx - Lnx;
      const ry    = 2 * dotNL * ny - Lny;
      const rz    = 2 * dotNL * nz - Lnz;
      const specD = Math.max(0, rz); // V·R where V=(0,0,1)
      const spec  = Math.pow(specD, variant === 'ice' ? 48 : 28) * (variant === 'ice' ? 0.8 : 0.5);

      const light = ambient + (1 - ambient) * diffuse;

      // ── Atmosphere rim (additive) ─────────────────────────────────
      // Rim strength peaks at grazing angles (nz ≈ 0) on the lit side.
      const rim = Math.pow(Math.max(0, 1 - nz), 3.5) * Math.max(0, dotNL + 0.4);

      // ── Final colour ──────────────────────────────────────────────
      let fr = Math.min(255, tr * light + 255 * spec + ar * rim * 0.6);
      let fg = Math.min(255, tg * light + 255 * spec + ag * rim * 0.6);
      let fb = Math.min(255, tb * light + 255 * spec + ab * rim * 0.6);

      // Dark terminator shadow on the night side.
      if (dotNL < 0) {
        const shadow = 1 + dotNL * 0.6; // smoothly darken
        fr *= shadow; fg *= shadow; fb *= shadow;
      }

      d[idx]     = Math.round(fr);
      d[idx + 1] = Math.round(fg);
      d[idx + 2] = Math.round(fb);
      d[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return cv;
}

// ── Sun renderer (drawn live, animated) ───────────────────────────────────────

const TAU = Math.PI * 2;

/**
 * Draw an animated sun at (x, y) with the given radius.
 * Called every frame — no caching needed; all layers are gradient-based.
 *
 * @param c         Canvas 2D context
 * @param x y       Centre position
 * @param r         Body radius
 * @param colour    Base fill hex
 * @param glowHex   Glow hex
 * @param ts        Frame timestamp (ms) — drives rotation / flicker
 * @param seed      Unique per-body integer
 */
export function drawSun(
  c: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  colour: string, glowHex: string,
  ts: number, seed: number,
): void {
  const t  = ts * 0.001; // seconds
  const [cr, cg, cb] = hexToRgb(colour);
  const [gr, gg, gb] = hexToRgb(glowHex);

  // ── 1. Outer corona (very large, soft) ───────────────────────────
  const outerR = r * 2.6;
  const corona2 = c.createRadialGradient(x, y, r * 0.8, x, y, outerR);
  corona2.addColorStop(0, `rgba(${cr},${cg},${cb},0.28)`);
  corona2.addColorStop(0.5, `rgba(${gr},${gg},${gb},0.10)`);
  corona2.addColorStop(1, `rgba(${gr},${gg},${gb},0)`);
  c.beginPath(); c.arc(x, y, outerR, 0, TAU);
  c.fillStyle = corona2; c.fill();

  // ── 2. Chromosphere ring ──────────────────────────────────────────
  const chroma = c.createRadialGradient(x, y, r * 0.88, x, y, r * 1.18);
  chroma.addColorStop(0, `rgba(${cr},${cg},${cb},0.9)`);
  chroma.addColorStop(1, `rgba(${gr},${gg},${gb},0)`);
  c.beginPath(); c.arc(x, y, r * 1.18, 0, TAU);
  c.fillStyle = chroma; c.fill();

  // ── 3. Corona ray spikes ─────────────────────────────────────────
  c.save();
  c.translate(x, y);
  const numRays  = 12 + (seed % 6);
  const rayAngle = (t * (0.08 + (seed % 7) * 0.003)) % TAU;
  c.rotate(rayAngle);
  for (let i = 0; i < numRays; i++) {
    const ang    = (TAU / numRays) * i;
    const rayLen = r * (1.3 + 0.5 * Math.abs(Math.sin(t * 0.7 + i * 1.3)));
    const rayW   = r * 0.06;
    c.save();
    c.rotate(ang);
    const rg = c.createLinearGradient(r, 0, r + rayLen, 0);
    rg.addColorStop(0, `rgba(${cr},${cg},${cb},0.55)`);
    rg.addColorStop(1, `rgba(${gr},${gg},${gb},0)`);
    c.beginPath();
    c.ellipse(r + rayLen / 2, 0, rayLen / 2, rayW * (0.7 + 0.3 * Math.sin(t + i)), 0, 0, TAU);
    c.fillStyle = rg;
    c.fill();
    c.restore();
  }
  c.restore();

  // ── 4. Surface granulation (simulated via offset circles) ─────────
  // Sample a grid of "convection cells" around the surface — low cost.
  c.save();
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.clip();
  const cellSeed = (seed * 137) & 0xFFFF;
  const numCells = 18 + (seed % 8);
  const cellAng  = t * 0.04;
  for (let i = 0; i < numCells; i++) {
    const ca   = (cellSeed + i * 97) % 360;
    const cr2  = r * (0.2 + (((cellSeed + i * 53) % 100) / 100) * 0.65);
    const cx2  = x + Math.cos(ca + cellAng + i) * cr2 * 0.85;
    const cy2  = y + Math.sin(ca + cellAng * 1.3 + i) * cr2 * 0.85;
    const cs   = r * (0.08 + (((cellSeed + i * 37) % 100) / 100) * 0.14);
    const bri  = 0.12 + 0.15 * Math.abs(Math.sin(t * 0.5 + i * 0.8));
    c.beginPath();
    c.arc(cx2, cy2, cs, 0, TAU);
    c.fillStyle = `rgba(255,255,200,${bri})`;
    c.fill();
  }
  c.restore();

  // ── 5. Core sphere (hot → dark limb) ─────────────────────────────
  const core = c.createRadialGradient(
    x - r * 0.22, y - r * 0.22, r * 0.05,
    x, y, r,
  );
  core.addColorStop(0,   '#FFFFFF');
  core.addColorStop(0.15, `rgb(${Math.min(255, cr + 60)},${Math.min(255, cg + 40)},${Math.min(255, cb + 20)})`);
  core.addColorStop(0.55, `rgb(${cr},${cg},${cb})`);
  core.addColorStop(1,   `rgb(${gr},${gg},${gb})`);
  c.shadowBlur  = r * 4;
  c.shadowColor = glowHex;
  c.beginPath(); c.arc(x, y, r, 0, TAU);
  c.fillStyle = core; c.fill();
  c.shadowBlur = 0;

  // ── 6. Sporadic prominence arc (rare, beautiful) ──────────────────
  const flarePhase = Math.sin(t * 0.17 + seed) * 0.5 + 0.5;
  if (flarePhase > 0.78) {
    const fAlpha = (flarePhase - 0.78) / 0.22;
    const fAng   = (seed * 0.618 + t * 0.03) % TAU;
    const fLen   = r * (0.5 + 0.4 * flarePhase);
    const fx1    = x + Math.cos(fAng) * r;
    const fy1    = y + Math.sin(fAng) * r;
    const fx2    = x + Math.cos(fAng + 0.4) * (r + fLen);
    const fy2    = y + Math.sin(fAng + 0.4) * (r + fLen);
    const fx3    = x + Math.cos(fAng + 0.8) * r;
    const fy3    = y + Math.sin(fAng + 0.8) * r;
    c.save();
    c.globalCompositeOperation = 'screen';
    c.strokeStyle = `rgba(${cr},${Math.min(255, cg + 60)},${Math.min(255, cb + 100)},${(fAlpha * 0.7).toFixed(2)})`;
    c.lineWidth   = r * 0.06;
    c.shadowBlur  = r * 1.2;
    c.shadowColor = `rgba(${cr},${cg},${cb},0.8)`;
    c.beginPath();
    c.moveTo(fx1, fy1);
    c.quadraticCurveTo(fx2, fy2, fx3, fy3);
    c.stroke();
    c.restore();
  }
}

// ── Debris renderer ───────────────────────────────────────────────────────────

/**
 * Pre-render a debris chunk as an irregular rocky polygon.
 * Generates a unique shape per seed; baked once to an offscreen canvas.
 *
 * @param radius   Body radius in pixels
 * @param colour   Hex colour
 * @param glowHex  Glow hex
 * @param seed     Integer seed — deterministic shape
 */
export function renderDebrisTexture(
  radius: number,
  colour: string,
  glowHex: string,
  seed: number,
): HTMLCanvasElement {
  const pad  = 4;
  const size = Math.ceil(radius * 2 + pad * 2);
  const cv   = document.createElement('canvas');
  cv.width   = cv.height = size;
  const ctx  = cv.getContext('2d')!;

  const cx = size / 2, cy = size / 2;

  // Build irregular polygon vertices.
  const numV  = 7 + ((seed * 7) % 6); // 7-12 sides
  const verts: [number, number][] = [];
  for (let i = 0; i < numV; i++) {
    const baseAng = (TAU / numV) * i;
    const angJitter = ((seed + i * 17) % 60 - 30) * (Math.PI / 180) * 0.6;
    const ang   = baseAng + angJitter;
    const rFrac = 0.5 + (((seed * 13 + i * 37) % 100) / 100) * 0.5; // 50-100% of radius
    verts.push([
      cx + Math.cos(ang) * radius * rFrac,
      cy + Math.sin(ang) * radius * rFrac,
    ]);
  }

  const [br, bg, bb] = hexToRgb(colour);
  const [gr2, gg2, gb2] = hexToRgb(glowHex);

  // ── Draw the rock polygon ─────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(verts[0][0], verts[0][1]);
  for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i][0], verts[i][1]);
  ctx.closePath();

  // Fill with radial gradient for a rough lit-rock look.
  const rg = ctx.createRadialGradient(
    cx - radius * 0.25, cy - radius * 0.25, radius * 0.05,
    cx, cy, radius,
  );
  rg.addColorStop(0,    `rgb(${Math.min(255, br + 80)},${Math.min(255, bg + 70)},${Math.min(255, bb + 60)})`);
  rg.addColorStop(0.45, `rgb(${br},${bg},${bb})`);
  rg.addColorStop(1,    `rgb(${gr2},${gg2},${gb2})`);
  ctx.fillStyle = rg;
  ctx.fill();

  // Edge outline for definition.
  ctx.strokeStyle = `rgba(${gr2},${gg2},${gb2},0.7)`;
  ctx.lineWidth   = 0.8;
  ctx.stroke();

  // ── Crack / facet lines ───────────────────────────────────────────
  const numCracks = 2 + ((seed * 3) % 3); // 2-4
  for (let c = 0; c < numCracks; c++) {
    const v0idx = (seed + c * 3) % numV;
    const v1idx = (v0idx + 2 + ((seed + c) % (numV - 2))) % numV;
    const [x0, y0] = verts[v0idx];
    const [x1, y1] = verts[v1idx];
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = `rgba(${Math.max(0, gr2 - 30)},${Math.max(0, gg2 - 30)},${Math.max(0, gb2 - 30)},0.55)`;
    ctx.lineWidth   = 0.6;
    ctx.stroke();
  }

  // ── Tiny craters (circles) ────────────────────────────────────────
  if (radius > 5) {
    const numC = 1 + ((seed * 11) % 3); // 1-3
    for (let c = 0; c < numC; c++) {
      const cAngC = ((seed * 7 + c * 53) % 360) * (Math.PI / 180);
      const cDist = radius * (0.1 + ((seed + c * 19) % 40) / 100);
      const cR    = Math.max(0.8, radius * (0.06 + ((seed + c * 29) % 20) / 200));
      const cxC   = cx + Math.cos(cAngC) * cDist;
      const cyC   = cy + Math.sin(cAngC) * cDist;
      ctx.beginPath();
      ctx.arc(cxC, cyC, cR, 0, TAU);
      ctx.strokeStyle = `rgba(${Math.max(0, gr2 - 20)},${Math.max(0, gg2 - 20)},${Math.max(0, gb2 - 20)},0.5)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  return cv;
}

