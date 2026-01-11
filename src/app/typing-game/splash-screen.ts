let splashImg: HTMLImageElement | null = null;
let splashImgReady = false;
let splashImgError: unknown = null;

function getSplashImg(): HTMLImageElement {
  if (splashImg) return splashImg;

  const img = new Image();
  img.src = 'assets/kbw/kbw-splash-v2.png';

  img.onload = () => { splashImgReady = true; };
  img.onerror = (e) => { splashImgError = e; };

  splashImg = img;
  return img;
}

export function renderSplashScreen(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  cssWidth: number,
  cssHeight: number
) {
  ctx.save();

  // (Optional) Clear once per frame, not inside onload
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.fillStyle = 'CornflowerBlue';

  const img = getSplashImg();

  if (splashImgReady) {
    const scale = Math.min(
      cssWidth / img.naturalWidth,
      cssHeight / img.naturalHeight
    );

    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (cssWidth - w) / 2;
    const y = (cssHeight - h) / 2;

    ctx.drawImage(img, x, y, w, h);
  } else {
    // Fallback while loading (and if it errors)
    ctx.fillStyle = 'black';
    ctx.font = '700 48px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(
      splashImgError ? 'Failed to load splash image' : 'Loading…',
      centerX,
      centerY
    );
  }

  ctx.restore();
}
