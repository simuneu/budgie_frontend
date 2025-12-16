export function formatNumber(value: unknown): string {
  const num = typeof value === "number"
    ? value
    : typeof value === "string"
    ? Number(value)
    : 0;

    
  // if (!Number.isFinite(num)) {
  //   console.trace("[formatNumber] invalid value", {
  //     rawValue: value,
  //     parsed: num,
  //     type: typeof value,
  //   });
  // }

  return Number.isFinite(num) ? num.toLocaleString() : "0";
}
