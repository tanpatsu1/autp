export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function toNumber(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCentimeters(value: number | null) {
  return value == null ? "未取得" : `${value.toFixed(1)} cm`;
}
