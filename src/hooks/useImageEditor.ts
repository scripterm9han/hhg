import { useCallback, useState } from 'react';
import type { CropState } from '@/types/builder';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3.4;

export function useImageEditor() {
  const [crop, setCropState] = useState<CropState>({ zoom: 1, x: 0, y: 0 });

  const setCrop = useCallback((next: CropState) => setCropState(next), []);

  const setZoom = useCallback((zoom: number) => {
    setCropState((current) => ({
      ...current,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)),
    }));
  }, []);

  const zoomBy = useCallback((factor: number) => {
    setCropState((current) => ({
      ...current,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.zoom * factor)),
    }));
  }, []);

  const nudge = useCallback((dx: number, dy: number) => {
    setCropState((current) => ({ ...current, x: current.x + dx, y: current.y + dy }));
  }, []);

  const reset = useCallback(() => setCropState({ zoom: 1, x: 0, y: 0 }), []);

  return { crop, setCrop, setZoom, zoomBy, nudge, reset };
}
