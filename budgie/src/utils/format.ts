export function formatNumber(value: unknown): string {
  const num = typeof value === "number"
    ? value
    : typeof value === "string"
    ? Number(value)
    : 0;


  return Number.isFinite(num) ? num.toLocaleString() : "0";
}
