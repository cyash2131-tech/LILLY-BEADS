/**
 * Utility functions for Lilyy Beads application.
 */

/**
 * Formats a given price in USD to Indian Rupees (INR) with a standard multiplier of 80.
 * @param usdAmount The price in USD
 */
export function formatCurrency(usdAmount: number): string {
  const inrAmount = usdAmount * 80;
  return `₹${inrAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}
