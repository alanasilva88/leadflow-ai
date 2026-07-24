export function normalizeText(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text || null;
}
export function comparisonText(value: unknown): string {
  return (normalizeText(value) ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
export function normalizeHeader(value: unknown): string {
  return comparisonText(value)
    .replace(/[_\-\W]+/g, " ")
    .trim();
}
export function escapeSpreadsheetFormula(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}
