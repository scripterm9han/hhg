export type ShareResult = 'native' | 'x' | 'cancelled' | 'failed';

export function xIntentUrl(text: string, url?: string): string {
  const fullText = url ? `${text}\n\n${url}` : text;
  return `https://x.com/intent/post?text=${encodeURIComponent(fullText)}`;
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
  url?: string,
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

  // 3. Open X post intent in new tab with full text including URL
  window.open(xIntentUrl(caption, url), '_blank', 'noopener,noreferrer');

  return { success: true, copied };
}

export async function shareNativeFile(
  blob: Blob,
  fileName: string,
  caption: string,
  url?: string,
): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const file = new File([blob], fileName, { type: 'image/png' });
      const canShareFiles =
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] });

      await navigator.share({
        title: 'My HH Goa 2026 Builder Frame',
        text: url ? `${caption}\n\n${url}` : caption,
        ...(canShareFiles ? { files: [file] } : {}),
      });
      return 'native';
    } catch (error) {
      const err = error as { name?: string };
      if (err?.name === 'AbortError') return 'cancelled';
      return 'failed';
    }
  }

  await shareToXDirect(blob, fileName, caption, url);
  return 'x';
}

export async function shareFrame(
  blob: Blob,
  fileName: string,
  caption: string,
  url?: string,
): Promise<ShareResult> {
  return shareNativeFile(blob, fileName, caption, url);
}
