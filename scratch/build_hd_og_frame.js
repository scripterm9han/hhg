import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple Bitmap Font for Crisp OG Text Rendering
const CHARS = {
  'A': [
    [0,1,1,0],
    [1,0,0,1],
    [1,1,1,1],
    [1,0,0,1],
    [1,0,0,1]
  ],
  'B': [
    [1,1,1,0],
    [1,0,0,1],
    [1,1,1,0],
    [1,0,0,1],
    [1,1,1,0]
  ],
  'C': [
    [0,1,1,1],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [0,1,1,1]
  ],
  'D': [
    [1,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,1,1,0]
  ],
  'E': [
    [1,1,1,1],
    [1,0,0,0],
    [1,1,1,0],
    [1,0,0,0],
    [1,1,1,1]
  ],
  'F': [
    [1,1,1,1],
    [1,0,0,0],
    [1,1,1,0],
    [1,0,0,0],
    [1,0,0,0]
  ],
  'G': [
    [0,1,1,1],
    [1,0,0,0],
    [1,0,1,1],
    [1,0,0,1],
    [0,1,1,1]
  ],
  'H': [
    [1,0,0,1],
    [1,0,0,1],
    [1,1,1,1],
    [1,0,0,1],
    [1,0,0,1]
  ],
  'I': [
    [1,1,1],
    [0,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1]
  ],
  'K': [
    [1,0,0,1],
    [1,0,1,0],
    [1,1,0,0],
    [1,0,1,0],
    [1,0,0,1]
  ],
  'L': [
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,1,1,1]
  ],
  'M': [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'N': [
    [1,0,0,1],
    [1,1,0,1],
    [1,0,1,1],
    [1,0,0,1],
    [1,0,0,1]
  ],
  'O': [
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0]
  ],
  'P': [
    [1,1,1,0],
    [1,0,0,1],
    [1,1,1,0],
    [1,0,0,0],
    [1,0,0,0]
  ],
  'R': [
    [1,1,1,0],
    [1,0,0,1],
    [1,1,1,0],
    [1,0,1,0],
    [1,0,0,1]
  ],
  'S': [
    [0,1,1,1],
    [1,0,0,0],
    [0,1,1,0],
    [0,0,0,1],
    [1,1,1,0]
  ],
  'T': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0]
  ],
  'U': [
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0]
  ],
  'W': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,1,0,1,1],
    [1,0,0,0,1]
  ],
  'Y': [
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0],
    [0,1,0,0],
    [0,1,0,0]
  ],
  '0': [
    [0,1,1,0],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0]
  ],
  '1': [
    [0,1,0],
    [1,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1]
  ],
  '2': [
    [0,1,1,0],
    [1,0,0,1],
    [0,0,1,0],
    [0,1,0,0],
    [1,1,1,1]
  ],
  '6': [
    [0,1,1,0],
    [1,0,0,0],
    [1,1,1,0],
    [1,0,0,1],
    [0,1,1,0]
  ],
  '#': [
    [0,1,0,1,0],
    [1,1,1,1,1],
    [0,1,0,1,0],
    [1,1,1,1,1],
    [0,1,0,1,0]
  ],
  '/': [
    [0,0,0,1],
    [0,0,1,0],
    [0,1,0,0],
    [1,0,0,0],
    [1,0,0,0]
  ],
  '·': [
    [0],
    [0],
    [1],
    [0],
    [0]
  ],
  ' ': [
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0]
  ]
};

function createPngBuffer(width, height, drawFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  const ihdrChunk = createChunk('IHDR', ihdr);
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowSize);

  // Initialize buffer with background color
  const bg = [17, 26, 21, 255]; // #111a15
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = bg[0];
      rawData[pxOffset + 1] = bg[1];
      rawData[pxOffset + 2] = bg[2];
      rawData[pxOffset + 3] = bg[3];
    }
  }

  const setPixel = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const pxOffset = y * rowSize + 1 + x * 4;
    rawData[pxOffset] = r;
    rawData[pxOffset + 1] = g;
    rawData[pxOffset + 2] = b;
    rawData[pxOffset + 3] = a;
  };

  const drawRect = (rx, ry, rw, rh, r, g, b) => {
    for (let y = Math.max(0, ry); y < Math.min(height, ry + rh); y++) {
      for (let x = Math.max(0, rx); x < Math.min(width, rx + rw); x++) {
        setPixel(x, y, r, g, b);
      }
    }
  };

  const drawText = (str, startX, startY, pixelSize, color) => {
    let curX = startX;
    const textUpper = str.toUpperCase();
    for (let i = 0; i < textUpper.length; i++) {
      const ch = textUpper[i];
      const grid = CHARS[ch] || CHARS[' '];
      const chWidth = grid[0].length;
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (grid[r][c] === 1) {
            for (let py = 0; py < pixelSize; py++) {
              for (let px = 0; px < pixelSize; px++) {
                setPixel(curX + c * pixelSize + px, startY + r * pixelSize + py, color[0], color[1], color[2]);
              }
            }
          }
        }
      }
      curX += (chWidth + 1) * pixelSize + Math.floor(pixelSize * 0.8);
    }
  };

  drawFn({ setPixel, drawRect, drawText });

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
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

const W = 1200;
const H = 630;

const LIME = [201, 242, 75];    // #c9f24b
const CORAL = [242, 92, 58];    // #f25c3a
const CREAM = [242, 236, 223];  // #f2ecdf
const INK = [17, 26, 21];       // #111a15

const pngBuffer = createPngBuffer(W, H, ({ setPixel, drawRect, drawText }) => {
  // Top Cream Band
  drawRect(0, 0, W, 100, CREAM[0], CREAM[1], CREAM[2]);
  drawText("HH GOA 2026", 80, 36, 5, INK);
  drawText("BUILDER IDENTITY / 001", 720, 38, 4, INK);

  // Bottom Left Coral Wedge
  for (let y = 420; y < H; y++) {
    const maxX = Math.floor((y - 420) * 1.8);
    for (let x = 0; x < maxX && x < 400; x++) {
      setPixel(x, y, CORAL[0], CORAL[1], CORAL[2]);
    }
  }

  // Right Lime Monogram Circle Sticker
  const cx = 1040;
  const cy = 220;
  const r = 85;
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r) {
        setPixel(x, y, LIME[0], LIME[1], LIME[2]);
      }
    }
  }
  drawText("HH", cx - 25, cy - 25, 6, INK);

  // Center Arch Frame
  const archW = 280;
  const archH = 320;
  const archX = 600 - archW / 2; // 460
  const archY = 140;
  const radius = archW / 2; // 140

  for (let y = archY; y < archY + archH; y++) {
    for (let x = archX; x < archX + archW; x++) {
      let inside = false;
      if (y < archY + radius) {
        const dx = x - 600;
        const dy = y - (archY + radius);
        if (dx * dx + dy * dy <= radius * radius) inside = true;
      } else {
        inside = true;
      }

      if (inside) {
        setPixel(x, y, LIME[0], LIME[1], LIME[2]);
      }
    }
  }

  // Draw HH inside Arch
  drawText("HH", 552, 230, 10, INK);

  // Main Builder Title & Branding Text
  drawText("BUILDER IDENTITY FRAME", 300, 480, 6, CREAM);
  drawRect(520, 530, 160, 6, LIME[0], LIME[1], LIME[2]);

  // #FrameInGoa Pill Tag
  drawRect(470, 555, 260, 48, LIME[0], LIME[1], LIME[2]);
  drawText("#FRAMEINGOA", 495, 568, 4, INK);
});

const publicDir = path.resolve(process.cwd(), 'public');
fs.writeFileSync(path.join(publicDir, 'og-frame.png'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'og-image.png'), pngBuffer);

console.log('Successfully rendered HD OG image with text to public/og-frame.png!');
