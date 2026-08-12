export function sanitizeSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function frameFileName(name: string): string {
  const slug = sanitizeSlug(name) || 'builder';
  return `hh-goa-2026-${slug}-frame.png`;
}

export function shareCaption(title: string, name: string, frameUrl?: string): string {
  const who = name.trim() ? ` @${sanitizeSlug(name)}` : '';
  const link = frameUrl ? `\n\nCheck my builder frame: ${frameUrl}` : '';
  return `Framed${who} for HH Goa 2026 ⚡ ${title}. See you in Goa. #FrameInGoa${link}`;
}

