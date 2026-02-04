export function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  const fixed = value.toFixed(2).replace(/\.?0+$/, "");
  return fixed.replace(".", ",");
}

export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

export function toRatioPercent(a: number, b: number): number {
  return (a / (a + b)) * 100;
}

export function roundTo(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
