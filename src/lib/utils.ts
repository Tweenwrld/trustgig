import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility functions
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number, currency = 'ADA'): string {
  return `${amount.toFixed(2)} ${currency}`;
}

export function truncateAddress(address: string, chars = 8): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function isValidCardanoAddress(address: string): boolean {
  return /^addr[1-9A-HJ-NP-Za-km-z]{98}$/.test(address);
}

export function calculateJobProgress(
  milestones: Array<{ completed: boolean }>
): number {
  if (milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.completed).length;
  return (completed / milestones.length) * 100;
}
