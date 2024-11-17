export function generateLuhnNumber(length: number): string {
  // Helper function to calculate the Luhn checksum for a given number array
  function calculateLuhnChecksum(digits: number[]): number {
    let sum = 0;
    let shouldDouble = true;

    // Iterate over digits from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10;
  }

  // Generate random digits for the number, excluding the last one which is the check digit
  let digits: number[] = [];
  for (let i = 0; i < length - 1; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  // Calculate the Luhn checksum for the generated digits
  let checksum = calculateLuhnChecksum(digits);

  // Determine the check digit that makes the whole number valid
  let checkDigit = (10 - checksum) % 10;

  // Append the check digit to the digits array
  digits.push(checkDigit);

  // Return the generated Luhn-valid number as a string
  return digits.join("");
}
