import type { Builder, CropState } from '@/types/builder';
import { FRAME, LAYOUT } from '@/lib/frame';
import { builderTitle } from '@/lib/titleGenerator';

const FONT_GROTESK = '"Space Grotesk", system-ui, sans-serif';
const FONT_SERIF = '"Instrument Serif", Georgia, serif';
const FONT_MONO = '"DM Mono", ui-monospace, monospace';

export async function preloadFrameFonts(): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    /* fonts are non-critical */
  }
  await Promise.allSettled([
    document.fonts.load(`700 120px ${FONT_GROTESK}`),
    document.fonts.load(`500 26px ${FONT_MONO}`),
    document.fonts.load(`500 20px ${FONT_MONO}`),
    document.fonts.load(`400 110px ${FONT_SERIF}`),
    document.fonts.load(`italic 90px ${FONT_SERIF}`),
  ]);
}

function archPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const top = w / 2;
  const rise = top * 0.62;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + top);
  ctx.ellipse(x + top, y + top, top, rise, 0, Math.PI, 0);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  base: number,
  min: number,
  maxWidth: number,
): number {
  let size = base;
  while (size > min && ctx.measureText(text).width > maxWidth) size -= 2;
  return size;
}

function setLetterSpacing(ctx: CanvasRenderingContext2D, px: string): void {
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = px;
  } catch {
    /* older engines render with default spacing */
  }
}

function drawGrain(ctx: CanvasRenderingContext2D): void {
  const tile = 180;
  const noise = document.createElement('canvas');
  noise.width = tile;
  noise.height = tile;
  const nctx = noise.getContext('2d');
  if (!nctx) return;
  const data = nctx.createImageData(tile, tile);
  for (let i = 0; i < data.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    data.data[i] = v;
    data.data[i + 1] = v;
    data.data[i + 2] = v;
    data.data[i + 3] = 26;
  }
  nctx.putImageData(data, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.globalCompositeOperation = 'overlay';
  ctx.imageSmoothingEnabled = false;
  for (let y = 0; y < FRAME.height; y += tile) {
    for (let x = 0; x < FRAME.width; x += tile) {
      ctx.drawImage(noise, x, y);
    }
  }
  ctx.restore();
}

function drawBackdrop(ctx: CanvasRenderingContext2D): void {
  // coral wedge rising from the bottom-left
  ctx.fillStyle = FRAME.coral;
  ctx.beginPath();
  ctx.moveTo(0, FRAME.height);
  ctx.lineTo(0, 1006);
  ctx.lineTo(788, FRAME.height);
  ctx.closePath();
  ctx.fill();

  // lime disc "sticker" behind the photo, with an ink ring
  ctx.fillStyle = FRAME.lime;
  ctx.beginPath();
  ctx.arc(942, 200, 148, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = FRAME.ink;
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.arc(942, 200, 178, 0, Math.PI * 2);
  ctx.stroke();

  // ghost numeral
  ctx.font = `400 430px ${FONT_SERIF}`;
  ctx.fillStyle = 'rgba(242, 236, 223, 0.05)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('01', 1014, 640);

  // hairline ring, upper right
  ctx.strokeStyle = FRAME.creamFaint;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(912, 232, 206, 0, Math.PI * 2);
  ctx.stroke();

  // crosshair marks
  ctx.strokeStyle = FRAME.coral;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(108, 316);
  ctx.lineTo(168, 316);
  ctx.moveTo(138, 286);
  ctx.lineTo(138, 346);
  ctx.stroke();
  ctx.strokeStyle = FRAME.lime;
  ctx.beginPath();
  ctx.moveTo(952, 486);
  ctx.lineTo(1012, 486);
  ctx.moveTo(982, 456);
  ctx.lineTo(982, 516);
  ctx.stroke();
}

function drawHeader(ctx: CanvasRenderingContext2D): void {
  // cream band
  ctx.fillStyle = FRAME.cream;
  ctx.fillRect(0, 0, FRAME.width, LAYOUT.headerBand);

  // left wordmark
  setLetterSpacing(ctx, '4px');
  ctx.font = `500 27px ${FONT_MONO}`;
  ctx.fillStyle = FRAME.ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('HH GOA 2026', 86, 96);

  setLetterSpacing(ctx, '3px');
  ctx.font = `400 15px ${FONT_MONO}`;
  ctx.fillStyle = 'rgba(17, 26, 21, 0.62)';
  ctx.fillText('BUILDER IDENTITY / 001', 86, 128);

  ctx.fillStyle = FRAME.coral;
  ctx.fillRect(86, 144, 44, 5);

  // right monogram
  ctx.fillStyle = FRAME.lime;
  ctx.beginPath();
  ctx.arc(954, 70, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = FRAME.ink;
  ctx.font = `700 22px ${FONT_GROTESK}`;
  ctx.textAlign = 'center';
  ctx.fillText('HH', 954, 78);

  ctx.textAlign = 'right';
  ctx.font = `500 13px ${FONT_MONO}`;
  ctx.fillStyle = 'rgba(17, 26, 21, 0.85)';
  setLetterSpacing(ctx, '2px');
  ctx.fillText('HACKER', 902, 62);
  ctx.fillText('HOUSE', 902, 82);
  setLetterSpacing(ctx, '0px');
}

async function drawPortrait(
  ctx: CanvasRenderingContext2D,
  imageUrl: string | null,
  crop: CropState,
): Promise<void> {
  const { x, y, w, h } = LAYOUT.arch;

  // offset "misprint" layers
  ctx.fillStyle = FRAME.lime;
  archPath(ctx, x - 12, y - 9, w, h);
  ctx.fill();
  ctx.fillStyle = FRAME.coral;
  archPath(ctx, x + 17, y + 21, w, h);
  ctx.fill();

  const drawCover = (img: HTMLImageElement) => {
    const scale = Math.max(w / img.width, h / img.height) * crop.zoom;
    const dw = img.width * scale;
    const dh = img.height * scale;
    const cx = x + w / 2;
    const cy = y + h / 2;
    ctx.save();
    archPath(ctx, x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, cx - dw / 2 + crop.x, cy - dh / 2 + crop.y, dw, dh);
    ctx.restore();
  };

  if (imageUrl) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        drawCover(img);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = imageUrl;
    });
  } else {
    const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
    gradient.addColorStop(0, FRAME.lime);
    gradient.addColorStop(1, FRAME.coral);
    ctx.save();
    archPath(ctx, x, y, w, h);
    ctx.clip();
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = FRAME.ink;
    ctx.font = `400 220px ${FONT_SERIF}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HH', x + w / 2, y + h / 2 - 12);
    ctx.font = `500 26px ${FONT_MONO}`;
    ctx.fillText('BUILDER', x + w / 2, y + h / 2 + 96);
    ctx.restore();
  }

  // lime outline on the arch
  ctx.strokeStyle = FRAME.lime;
  ctx.lineWidth = 12;
  archPath(ctx, x, y, w, h);
  ctx.stroke();

  // faint inner cream frame
  ctx.strokeStyle = 'rgba(242, 236, 223, 0.35)';
  ctx.lineWidth = 3;
  archPath(ctx, x + 14, y + 14, w - 28, h - 28);
  ctx.stroke();
}

function drawTextBlock(
  ctx: CanvasRenderingContext2D,
  builder: Builder,
  title: string,
): void {
  const name = (builder.name.trim() || 'YOUR NAME').toUpperCase();
  const role = builder.role.trim();
  const stack = builder.stack.trim();

  // name
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `400 120px ${FONT_SERIF}`;
  const nameSize = fitFont(ctx, name, 120, 52, LAYOUT.textMaxWidth);
  ctx.font = `400 ${nameSize}px ${FONT_SERIF}`;
  ctx.fillStyle = FRAME.cream;
  ctx.fillText(name, FRAME.width / 2, LAYOUT.nameY);

  // divider
  ctx.fillStyle = FRAME.lime;
  ctx.fillRect(FRAME.width / 2 - 46, LAYOUT.dividerY, 92, 6);

  // title
  ctx.font = `500 27px ${FONT_MONO}`;
  ctx.fillStyle = FRAME.lime;
  setLetterSpacing(ctx, '6px');
  const titleSize = fitFont(ctx, title, 27, 17, LAYOUT.textMaxWidth);
  if (titleSize < 27) ctx.font = `500 ${titleSize}px ${FONT_MONO}`;
  ctx.fillText(title, FRAME.width / 2, LAYOUT.titleY);
  setLetterSpacing(ctx, '0px');

  // role / stack
  ctx.font = `500 21px ${FONT_MONO}`;
  ctx.fillStyle = FRAME.creamDim;
  const roleLine = role ? role.toUpperCase() : 'YOUR ROLE';
  const stackLine = stack ? stack.toUpperCase() : 'YOUR STACK';
  if (roleLine === stackLine) {
    ctx.fillText(roleLine, FRAME.width / 2, LAYOUT.metaY + 26);
  } else {
    ctx.fillText(roleLine, FRAME.width / 2, LAYOUT.metaY);
    ctx.fillText(stackLine, FRAME.width / 2, LAYOUT.metaY + 32);
  }
}

function roundedPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, h / 2);
  } else {
    ctx.rect(x, y, w, h);
  }
}

function drawPillAndFooter(ctx: CanvasRenderingContext2D): void {
  const tag = '#FrameInGoa';
  ctx.font = `500 30px ${FONT_MONO}`;
  const tagWidth = ctx.measureText(tag).width;
  const pillW = tagWidth + 68;
  const pillH = 62;
  const pillX = FRAME.width / 2 - pillW / 2;
  ctx.fillStyle = FRAME.lime;
  ctx.beginPath();
  roundedPill(ctx, pillX, LAYOUT.pillY, pillW, pillH);
  ctx.fill();
  ctx.fillStyle = FRAME.ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(tag, FRAME.width / 2, LAYOUT.pillY + 40);

  // footer rule + text
  ctx.strokeStyle = FRAME.creamFaint;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(86, LAYOUT.footerLineY);
  ctx.lineTo(994, LAYOUT.footerLineY);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.font = `500 16px ${FONT_MONO}`;
  ctx.fillStyle = FRAME.creamDim;
  setLetterSpacing(ctx, '2px');
  ctx.fillText('GOA · 2026', 86, LAYOUT.footerY);

  ctx.textAlign = 'right';
  ctx.fillStyle = FRAME.lime;
  ctx.fillText('BUILD WITH INTENT', 994, LAYOUT.footerY);
  setLetterSpacing(ctx, '0px');
}

export async function renderFrame(
  builder: Builder,
  imageUrl: string | null,
  crop: CropState,
): Promise<Blob> {
  await preloadFrameFonts();

  const canvas = document.createElement('canvas');
  canvas.width = FRAME.width;
  canvas.height = FRAME.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported in this browser.');

  ctx.fillStyle = FRAME.ink;
  ctx.fillRect(0, 0, FRAME.width, FRAME.height);

  drawBackdrop(ctx);
  drawHeader(ctx);
  await drawPortrait(ctx, imageUrl, crop);
  drawTextBlock(ctx, builder, builderTitle(builder));
  drawPillAndFooter(ctx);
  drawGrain(ctx);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  );
  if (!blob) throw new Error('Could not export your frame. Please try again.');
  return blob;
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(blob);
  });
}
