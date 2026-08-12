import type { LoadedPhoto } from '@/types/builder';

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_EDGE = 2600;
const EXPORT_QUALITY = 0.94;

export class PhotoLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PhotoLoadError';
  }
}

function isHeic(file: File): boolean {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.hei[cf]$/i.test(file.name)
  );
}

async function heicToJpeg(file: File): Promise<Blob> {
  try {
    const { default: heic2any } = await import('heic2any');
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92,
    });
    return Array.isArray(result) ? result[0] : result;
  } catch {
    throw new PhotoLoadError(
      'That HEIC photo could not be converted. Try choosing the same photo as a JPG from your Photos app.',
    );
  }
}

function loadElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new PhotoLoadError('That image could not be opened. Try another photo.'));
    img.src = url;
  });
}

// Downscale very large photos so canvas work stays fast and memory-light
// without losing the detail the 1080 × 1350 export needs.
function downscale(url: string, width: number, height: number): Promise<Blob> {
  const ratio = Math.min(1, MAX_EDGE / Math.max(width, height));
  if (ratio >= 1) return Promise.reject(new Error('no downscale needed'));

  const outW = Math.round(width * ratio);
  const outH = Math.round(height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('no canvas context'));

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, outW, outH);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('downscale failed'))),
        'image/jpeg',
        EXPORT_QUALITY,
      );
    };
    img.onerror = () => reject(new PhotoLoadError('That image could not be opened. Try another photo.'));
    img.src = url;
  });
}

export async function loadPhoto(file: File): Promise<LoadedPhoto> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new PhotoLoadError('That image is over 15MB. A smaller export keeps your frame crisp and quick to share.');
  }

  let source: Blob | File = file;
  if (isHeic(file)) {
    source = await heicToJpeg(file);
  } else if (!file.type.startsWith('image/')) {
    throw new PhotoLoadError('That file is not a photo. Choose a JPG, PNG, or HEIC image.');
  }

  const rawUrl = URL.createObjectURL(source);
  try {
    const img = await loadElement(rawUrl);
    let url = rawUrl;
    let width = img.naturalWidth;
    let height = img.naturalHeight;

    if (width > MAX_EDGE || height > MAX_EDGE) {
      const scaled = await downscale(rawUrl, width, height);
      URL.revokeObjectURL(rawUrl);
      url = URL.createObjectURL(scaled);
      width = Math.round(width * Math.min(1, MAX_EDGE / Math.max(width, height)));
      height = Math.round(height * Math.min(1, MAX_EDGE / Math.max(width, height)));
    }

    if (!width || !height) {
      throw new PhotoLoadError('That image appears to be empty. Try another photo.');
    }

    return { url, width, height, fileName: file.name };
  } catch (error) {
    URL.revokeObjectURL(rawUrl);
    throw error;
  }
}
