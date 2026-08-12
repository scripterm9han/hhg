import { useCallback, useEffect, useRef, useState } from 'react';
import type { LoadedPhoto } from '@/types/builder';
import { loadPhoto } from '@/lib/imageProcessing';

export function useImageUpload() {
  const [photo, setPhoto] = useState<LoadedPhoto | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUrl = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    },
    [],
  );

  const apply = useCallback((photo: LoadedPhoto) => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    currentUrl.current = photo.url;
    setPhoto(photo);
    setError('');
  }, []);

  const load = useCallback(
    async (file: File): Promise<boolean> => {
      setLoading(true);
      setError('');
      try {
        const loaded = await loadPhoto(file);
        apply(loaded);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'That photo could not be processed. Try another one.',
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [apply],
  );

  const clear = useCallback(() => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    currentUrl.current = null;
    setPhoto(null);
    setError('');
  }, []);

  return { photo, error, loading, load, clear, apply };
}
