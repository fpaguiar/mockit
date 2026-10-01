/** Computes the Luhn check digit for a string of digits (without the check digit). */
export function luhnCheckDigit(payload: string): number {
  let sum = 0;
  for (let i = 0; i < payload.length; i++) {
    let digit = Number(payload[payload.length - 1 - i]);
    // The rightmost payload digit sits next to the check digit, so it gets doubled.
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return (10 - (sum % 10)) % 10;
}

export function isLuhnValid(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 2) return false;
  return luhnCheckDigit(digits.slice(0, -1)) === Number(digits.at(-1));
}
