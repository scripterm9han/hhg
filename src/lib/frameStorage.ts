import type { Builder, CropState } from '@/types/builder';
import { builderTitle } from '@/lib/titleGenerator';

export type SavedFrame = {
  id: string;
  builder: Builder;
  crop: CropState;
  dataUrl: string;
  createdAt: number;
};

const STORAGE_PREFIX = 'hhg_frame_';

export function generateFrameId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'f_';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function saveFrameToStorage(
  builder: Builder,
  crop: CropState,
  dataUrl: string,
): SavedFrame {
  const id = generateFrameId();
  const saved: SavedFrame = {
    id,
    builder,
    crop,
    dataUrl,
    createdAt: Date.now(),
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(saved));
  } catch {
    // If localStorage quota exceeded, prune older frames
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX));
      if (keys.length > 0) {
        localStorage.removeItem(keys[0]);
        localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(saved));
      }
    } catch {
      /* ignore storage quota issues */
    }
  }

  return saved;
}

export function getFrameFromStorage(id: string): SavedFrame | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (raw) {
      return JSON.parse(raw) as SavedFrame;
    }
  } catch {
    /* ignore parse errors */
  }
  return null;
}

export function buildFrameUrl(id: string, builder: Builder): string {
  let origin = typeof window !== 'undefined' ? window.location.origin : 'https://hhg-delta.vercel.app';
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    origin = 'https://hhg-delta.vercel.app';
  }
  const params = new URLSearchParams();
  params.set('f', id);
  if (builder.name) params.set('n', builder.name);
  if (builder.role) params.set('r', builder.role);
  if (builder.stack) params.set('s', builder.stack);
  params.set('t', builderTitle(builder));

  return `${origin}/api/card?${params.toString()}`;
}

export function buildOgImageUrl(builder: Builder): string {
  let origin = typeof window !== 'undefined' ? window.location.origin : 'https://hhg-delta.vercel.app';
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    origin = 'https://hhg-delta.vercel.app';
  }

  const params = new URLSearchParams();
  if (builder.name) params.set('n', builder.name);
  if (builder.role) params.set('r', builder.role);
  if (builder.stack) params.set('s', builder.stack);
  params.set('t', builderTitle(builder));

  return `${origin}/api/og?${params.toString()}`;
}

export function updateOpenGraphMeta(
  title: string,
  description: string,
  imageUrl?: string,
  url?: string,
): void {
  if (typeof document === 'undefined') return;

  document.title = title;

  const setMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Open Graph
  setMeta('meta[property="og:title"]', 'property', 'og:title', title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', description);
  setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  if (url) setMeta('meta[property="og:url"]', 'property', 'og:url', url);
  if (imageUrl) {
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    setMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', imageUrl);
  }

  // Twitter Cards
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  if (imageUrl) {
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    setMeta('meta[name="twitter:image:src"]', 'name', 'twitter:image:src', imageUrl);
  }
}
