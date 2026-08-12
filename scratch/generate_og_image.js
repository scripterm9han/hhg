import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPngBuffer(width, height, getPixel) {
  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth (8 bits per channel)
  ihdr[9] = 6; // color type (RGBA)
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT Chunk (Raw Image Data)
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuffer, data]);

  const crc = crc32(typeAndData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeAndData, crcBuffer]);
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Generate 1200x630 OG Banner Image
const W = 1200;
const H = 630;

// Color palette
const INK = [17, 26, 21, 255];       // #111a15
const LIME = [201, 242, 75, 255];    // #c9f24b
const CORAL = [242, 92, 58, 255];    // #f25c3a
const CREAM = [242, 236, 223, 255];  // #f2ecdf

console.log('Generating OG PNG image (1200x630)...');

const pngBuffer = createPngBuffer(W, H, (x, y) => {
  // Top header band (height 90)
  if (y < 90) {
    return CREAM;
  }
  // Bottom left coral triangle
  if (y > 450 && x < (y - 450) * 3) {
    return CORAL;
  }
  // Top right lime circle sticker (cx: 1060, cy: 110, r: 80)
  const dx = x - 1060;
  const dy = y - 110;
  if (dx * dx + dy * dy <= 80 * 80) {
    return LIME;
  }
  // Centered arch (cx: 600, top: 130, width: 280, height: 320)
  const archLeft = 460;
  const archRight = 740;
  const archTop = 130;
  const archBottom = 450;
  const radius = 140;

  if (x >= archLeft && x <= archRight && y >= archTop && y <= archBottom) {
    // Arch top semi-circle
    if (y < archTop + radius) {
      const adx = x - 600;
      const ady = y - (archTop + radius);
      if (adx * adx + ady * ady <= radius * radius) {
        return LIME;
      }
    } else {
      return LIME;
    }
  }

  // Lime accent line at bottom
  if (y >= 540 && y <= 548 && x >= 460 && x <= 740) {
    return LIME;
  }

  // Main background
  return INK;
});

const publicDir = path.resolve(process.cwd(), 'public');
fs.writeFileSync(path.join(publicDir, 'og-frame.png'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'og-image.png'), pngBuffer);

console.log('Successfully generated og-frame.png & og-image.png in public directory!');
