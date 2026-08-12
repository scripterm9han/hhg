import { useEffect, useRef, useState } from 'react';
import { FramePreview } from '@/components/FramePreview';
import type { Builder, CropState, LoadedPhoto } from '@/types/builder';
import { LAYOUT } from '@/lib/frame';
import { ChevronLeft, Move, Plus, RefreshCw, ZoomIn } from 'lucide-react';

const ARCH_W = LAYOUT.arch.w;
const ARCH_H = LAYOUT.arch.h;
const FRAME_WIDTH_FACTOR = 1080;

function clampedCrop(
  crop: CropState,
  srcW: number,
  srcH: number,
): CropState {
  const scale = Math.max(ARCH_W / srcW, ARCH_H / srcH) * crop.zoom;
  const dw = srcW * scale;
  const dh = srcH * scale;
  const maxX = Math.max(0, (dw - ARCH_W) / 2);
  const maxY = Math.max(0, (dh - ARCH_H) / 2);
  return {
    zoom: crop.zoom,
    x: Math.min(maxX, Math.max(-maxX, crop.x)),
    y: Math.min(maxY, Math.max(-maxY, crop.y)),
  };
}

export function ImageEditor({
  builder,
  photo,
  crop,
  setCrop,
  onNext,
  onBack,
  onReset,
}: {
  builder: Builder;
  photo: LoadedPhoto | null;
  crop: CropState;
  setCrop: (crop: CropState) => void;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number; crop: CropState } | null>(null);
  const [dragging, setDragging] = useState(false);

  const hasImage = Boolean(photo);

  const toCropDelta = (clientDelta: number) => {
    const width = containerRef.current?.clientWidth ?? 0;
    return width > 0 ? clientDelta * (FRAME_WIDTH_FACTOR / width) : 0;
  };

  const applyClamped = (next: CropState) => {
    if (!photo) {
      setCrop(next);
      return;
    }
    setCrop(clampedCrop(next, photo.width, photo.height));
  };

  const applyZoom = (zoom: number) => {
    const next = { ...crop, zoom: Math.min(3.4, Math.max(1, zoom)) };
    applyClamped(next);
  };

  // native non-passive wheel listener so we can prevent page scroll
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !hasImage) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      applyZoom(crop.zoom * (event.deltaY < 0 ? 1.08 : 0.92));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasImage, crop.zoom, photo]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasImage) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 1) {
      dragStart.current = { x: event.clientX, y: event.clientY, crop };
      setDragging(true);
    } else if (pointers.current.size === 2) {
      dragStart.current = null;
      setDragging(false);
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        zoom: crop.zoom,
      };
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasImage || !pointers.current.has(event.pointerId)) return;

    if (pointers.current.size === 1 && dragStart.current) {
      const start = dragStart.current;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      applyClamped({
        ...start.crop,
        x: start.crop.x + toCropDelta(dx),
        y: start.crop.y + toCropDelta(dy),
      });
      return;
    }

    if (pointers.current.size === 2 && pinchStart.current) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const ratio = distance / Math.max(1, pinchStart.current.distance);
      applyZoom(pinchStart.current.zoom * ratio);
    }
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    dragStart.current = null;
    pinchStart.current = null;
    setDragging(false);
  };

  const nudge = (dx: number, dy: number) =>
    applyClamped({ ...crop, x: crop.x + dx, y: crop.y + dy });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="eyebrow text-stone">Live preview</span>
        <span className="eyebrow text-coral">{hasImage ? 'Photo loaded' : 'No photo yet'}</span>
      </div>

      <div ref={containerRef} className="relative">
        <FramePreview builder={builder} imageUrl={photo?.url} crop={crop} className="ring-1 ring-ink/10" />
        {hasImage && (
          <div
            ref={wrapRef}
            className="absolute inset-0 z-10"
            style={{ touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
            aria-label="Drag to reposition your photo, scroll or pinch to zoom, double-click to reset"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onDoubleClick={onReset}
          />
        )}
        {hasImage && (
          <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-cream backdrop-blur">
            drag · scroll · pinch
          </div>
        )}
      </div>

      <div className="mt-7 rounded-2xl border border-ink/15 bg-cream-deep/50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow text-ink">Adjust portrait</span>
          <button
            onClick={onReset}
            className="eyebrow flex items-center gap-1.5 text-stone transition-colors hover:text-ink"
          >
            <RefreshCw size={12} /> Reset
          </button>
        </div>

        <label className="mb-5 flex items-center gap-3 text-xs text-stone">
          <ZoomIn size={16} className="shrink-0 text-coral" />
          <span className="sr-only">Zoom portrait</span>
          <input
            type="range"
            min="1"
            max="3.4"
            step="0.01"
            value={crop.zoom}
            onChange={(event) => applyZoom(Number(event.target.value))}
            className="h-1.5 flex-1 accent-coral"
            aria-label="Zoom level"
          />
          <span className="w-10 text-right font-mono text-[11px]">
            {Math.round(crop.zoom * 100)}%
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-stone">
            <Move size={15} className="text-coral" />
          </span>
          <button
            onClick={() => nudge(-16, 0)}
            aria-label="Move photo left"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/20 transition-colors hover:bg-ink hover:text-cream"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => nudge(16, 0)}
            aria-label="Move photo right"
            className="flex h-9 w-9 rotate-180 items-center justify-center rounded-lg border border-ink/20 transition-colors hover:bg-ink hover:text-cream"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => nudge(0, -16)}
            aria-label="Move photo up"
            className="flex h-9 w-9 rotate-90 items-center justify-center rounded-lg border border-ink/20 transition-colors hover:bg-ink hover:text-cream"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => nudge(0, 16)}
            aria-label="Move photo down"
            className="flex h-9 w-9 -rotate-90 items-center justify-center rounded-lg border border-ink/20 transition-colors hover:bg-ink hover:text-cream"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => applyZoom(crop.zoom - 0.25)}
              aria-label="Zoom out"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/20 font-display text-lg transition-colors hover:bg-ink hover:text-cream"
            >
              −
            </button>
            <button
              onClick={() => applyZoom(crop.zoom + 0.25)}
              aria-label="Zoom in"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/20 font-display text-lg transition-colors hover:bg-ink hover:text-cream"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[auto_1fr] gap-3">
        <button
          onClick={onBack}
          className="btn btn-ghost eyebrow px-5 py-3.5"
        >
          ← Photo
        </button>
        <button
          onClick={onNext}
          className="btn btn-ink px-6 py-3.5 text-sm"
        >
          Next: builder details
        </button>
      </div>
    </div>
  );
}
