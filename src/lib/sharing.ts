export type ShareResult = 'native' | 'x' | 'cancelled' | 'failed';

export function xIntentUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export async function shareFrame(
  blob: Blob,
  fileName: string,
  caption: string,
): Promise<ShareResult> {
  if (navigator.share) {
    try {
      const file = new File([blob], fileName, { type: 'image/png' });
      const canShareFiles =
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] });

      await navigator.share({
        title: 'My HH Goa 2026 Builder Frame',
        text: caption,
        ...(canShareFiles ? { files: [file] } : {}),
      });
      return 'native';
    } catch (error) {
      const err = error as { name?: string };
      if (err?.name === 'AbortError') return 'cancelled';
      return 'failed';
    }
  }

  window.open(xIntentUrl(caption), '_blank', 'noopener,noreferrer');
  return 'x';
}
