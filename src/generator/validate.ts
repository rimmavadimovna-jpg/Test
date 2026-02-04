export function isNiceInteger(value: number) {
  return Number.isInteger(value) && Math.abs(value) < 1_000_000;
}

export function isNiceNumber(value: number) {
  return Number.isFinite(value) && Math.abs(value) < 1_000_000;
}

export function ensure(condition: boolean) {
  if (!condition) {
    throw new Error("Validation failed");
  }
}
