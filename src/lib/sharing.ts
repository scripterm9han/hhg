export type ShareResult = 'native' | 'x' | 'cancelled' | 'failed';

export function xIntentUrl(text: string): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}

export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard || typeof ClipboardItem === 'undefined') {
    return false;
  }
  try {
    const item = new ClipboardItem({ [blob.type || 'image/png']: blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch {
    return false;
  }
}

export async function shareToXDirect(
  blob: Blob,
  fileName: string,
  caption: string,
): Promise<{ success: boolean; copied: boolean }> {
  // 1. Trigger image download
  const link = document.createElement('a');
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 4000);

  // 2. Try copying image blob to clipboard for instant pasting on X
  const copied = await copyImageToClipboard(blob);

  // 3. Open X post intent in new tab
  window.open(xIntentUrl(caption), '_blank', 'noopener,noreferrer');

  return { success: true, copied };
}

export async function shareNativeFile(
  blob: Blob,
  fileName: string,
  caption: string,
): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && navigator.share) {
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

  await shareToXDirect(blob, fileName, caption);
  return 'x';
}

export async function shareFrame(
  blob: Blob,
  fileName: string,
  caption: string,
): Promise<ShareResult> {
  return shareNativeFile(blob, fileName, caption);
}
