
---

# **SHEF: Artisanal Digital Design Rulebook**

## I. Core Philosophy: The Artisanal Mandate

To eradicate the generative aesthetic—characterized by plastic shading, hyper-detail, and dull neons—the *Shef* environment must enforce strict "Intentionality". Every pixel, animation, padding variable, and word must stem from deliberate human decision-making, subjugating probabilistic generative processes beneath a tactile, human-centric design vernacular.

* **Editorial Restraint:** Generative text models frequently hallucinate unnecessary filler words and forced, "clever" subtitles to fill space. Reject this. Embrace minimalist, highly intentional copy. If a UI element does not require a subtitle, do not add one. Silence and whitespace are indicators of human confidence.

## II. Chromatic Integrity & Subtractive Palette

Eradicate glowing neon gradients. Adopt perceptually uniform Oklch color spaces that simulate physical pigment constraints. All colors must be harmonically linked by shifting along the hue axis toward a persistent global illuminant.

* **Ambient Chroma Cap:** Ensure the maximum chroma in the Oklch space is mathematically restricted to $C_{max}\le0.12$.


* **Interactive Chroma Cap:** Constrain focal interactive elements to $C_{max}\le0.18$.


* **Absolute Black/White:** Default absolute hex black and white are prohibited. Use heavily saturated off-blacks (e.g., charcoal with a blue bias) and unbleached whites (e.g., alabaster) to simulate natural lighting.


* **Asset Pigment Inheritance:** Hand-coded SVG graphics must utilize `currentColor` to perfectly inherit their parent's subtractive Oklch pigment, ensuring vectors feel painted into the UI rather than dropped in arbitrarily.

## III. Structural Coherence & Spatial Realism

Replace default glassmorphism with tactile authenticity and explicit Z-axis physics.

* **Atomic Determinism:** Structural spacing must strictly adhere to the geometric progression $S_n=S_0\times2^n$.


* **Proportional Harmony:** Interface ratios must follow the Golden Ratio $\phi\approx1.618$ or a Perfect Fifth interval of **1.5**.


* **Z-Axis Realism & Floating Dossiers:** Enforce explicitly coded physical elevations.


* **Layer 1 (Floating):** Sticky headers/dossiers must float physically above content with opaque, tight box-shadows, allowing scrolling items to pass beneath them seamlessly.
* **Layer -1 (Recessed):** Inventory trays or "Procured Goods" must use heavy `inset` box shadows to simulate physical, recessed wells carved into the surface.


* **Cumulative Layout Shift (CLS) Eradication:** Empty states (e.g., an empty item tray) must pre-allocate physical space using `min-height` and optically dimmed placeholder text. The UI must never "jump" when a user takes an action.
* **Human Jitter:** Introduce intentional asymmetry (e.g., 1-2px variations in `border-radius`) and Wabi-Sabi noise overlays to simulate physical wear.



## IV. Mobile-First Engineering & Touch Ergonomics

The application must be designed strictly mobile-first, treating the viewport as a rigid, physical glass box.

* **The Viewport Lock:** The root container must enforce a strict `height: 100dvh`. This creates a bounded physical window, forcing child grids to natively scroll via `overflow-y: auto` and entirely eliminating the flexbox "ghost scroll" bug.
* **Non-Sticky Tactility:** Touchscreens do not understand a mouse hover, causing tapped items to remain permanently "stuck" in their hover state. All spatial hover elevations must be wrapped in `@media (hover: hover)`.
* **Touch Screen Polish:** Globally ban default browser touch behaviors. Apply `-webkit-user-select: none` to prevent accidental text highlighting, and `-webkit-tap-highlight-color: transparent` to eradicate the blue flash on tap.
* **Thumb Ergonomics:** Action rows must utilize `flex: 1` to split evenly on mobile for easy thumb reach. Scrolling grids must maintain a heavy `padding-bottom` buffer so bottom-row elements never crash into the screen edge.

## V. Typography, Kinematics, and Multi-Sensory Feedback

* **Typographic Craft & Optical Hierarchies:** Discard unopinionated default system fonts. Use an editorial serif (e.g., Newsreader) for narrative/display text and a geometric sans-serif (e.g., DM Sans) for utilitarian data.


* *Optical Polish:* Non-standard glyphs (like the infinity symbol $\infty$) must be individually targeted, scaled heavily (e.g., `2.5em`), and zeroed on their line-height to optically balance with standard text.
* *Semantic Logic:* Apply strict programmatic pluralization (e.g., checking for "1 Use" vs "5 Uses") rather than relying on lazy fallbacks like "Use(s)".


* **Kinematic Authenticity:** Govern micro-interactions using custom cubic-bezier curves or spring physics modeled on the damped harmonic oscillator formula $F=-kx-cv$. Tap interactions must simulate mass depression (e.g., `scale(0.92)` combined with deep inset shadows).


* **Carnal Audio Pools:** Tactile feedback cannot clip or cut off. When applying mechanical sounds (like a cash register click), instantiate an "Audio Pool" (an array of multiple Audio objects) that dynamically finds open channels. This allows rapid-fire user inputs to physically overlap, mimicking a real mechanical object.
* **HITL Pipeline:** Raw AI generation is strictly forbidden for user-facing game assets. Generative assets must undergo manual vector simplification and strict Oklch color grading. When injecting SVGs dynamically via Angular, `::ng-deep` must be used to enforce artisanal stroke widths (e.g., `1.5px`) overriding browser defaults.