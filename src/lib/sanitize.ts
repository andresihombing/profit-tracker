const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const HTML_TAGS = /<\/?[^>]+>/g;

export function sanitizeText(value: string): string {
  return value.replace(HTML_TAGS, "").replace(CONTROL_CHARS, "").trim();
}

export function sanitizeOptionalText(value?: string | null): string | null {
  if (value == null) return null;
  const cleaned = sanitizeText(value);
  return cleaned.length === 0 ? null : cleaned;
}
