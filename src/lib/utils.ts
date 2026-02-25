import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // Default to USD for demo, could be THB
        minimumFractionDigits: 0,
    }).format(amount);
}

export function calculateHealthScore(income: number, expense: number) {
    if (income === 0) return 50;
    const ratio = (income - expense) / income;
    const score = Math.max(0, Math.min(100, Math.round(ratio * 100)));
    return score;
}
