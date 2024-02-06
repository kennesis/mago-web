export function toPrecision(value: number, precision: number): number {
  const p = Math.pow(10, precision);

  return Math.round(value * p) / p;
}

/**
 * Whether the provided value is considered a number.
 * @docs-private
 */
export function isNumberValue(value: any): boolean {
  // parseFloat(value) handles most of the cases we're interested in (it treats null, empty string,
  // and other non-number values as NaN, where Number just uses 0) but it considers the string
  // '123hello' to be a valid number. Therefore we also check if Number(value) is NaN.
  return !isNaN(parseFloat(value)) && !isNaN(Number(value));
}

/** Coerces a data-bound value (typically a string) to a number. */
export function coerceInteger(value: any): number;
export function coerceInteger<D>(value: any, fallback: D): number | D;
export function coerceInteger(value: any, fallbackValue = 0): number {
  return isNumberValue(value) ? (value > 0 ? Math.floor(value) : Math.ceil(value)) : fallbackValue;
}

/**
 * Compares two dates.
 * @param first The first date to compare.
 * @param second The second date to compare.
 * @returns 0 if the dates are equal, a number less than 0 if the first date is earlier,
 *     a number greater than 0 if the first date is later.
 */
 export function compareDate(first: Date, second: Date): number {
  return (
    first.getFullYear() - second.getFullYear() ||
    first.getMonth() - second.getMonth() ||
    first.getDate() - second.getDate()
  );
}

/**
 * Checks if two dates are equal.
 * @param first The first date to check.
 * @param second The second date to check.
 * @returns Whether the two dates are equal.
 *     Null dates are considered equal to other null dates.
 */
export function sameDate(first: Date | null, second: Date | null): boolean {
  if (first && second) {
    return !compareDate(first, second);
  }
  return first == second;
}


export function printDebug(fun: string | (() => string), on?: boolean): void {
  on && console.info(typeof fun === 'function' ? fun() : fun);
}
