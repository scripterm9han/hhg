export type ShareResult = 'native' | 'x' | 'cancelled' | 'failed';

export function xIntentUrl(text: string): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}

export async function shareToXDirect(
  blob: Blob,
  fileName: string,
  caption: string,
): Promise<'x'> {
  // Download frame image so user has it ready to attach on X
  const link = document.createElement('a');
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 4000);

  // Attempt to copy image to clipboard if supported
  if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type || 'image/png']: blob }),
      ]);
    } catch {
      // Ignore clipboard error
    }
  }

  // Directly open x.com post intent
  window.open(xIntentUrl(caption), '_blank', 'noopener,noreferrer');
  return 'x';
}

export async function shareNative(
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

  return shareToXDirect(blob, fileName, caption);
}

export async function shareFrame(
  blob: Blob,
  fileName: string,
  caption: string,
): Promise<ShareResult> {
  return shareToXDirect(blob, fileName, caption);
}

