export type TransactionType = 'income' | 'expense';

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: TransactionType;
}

export interface Pocket {
    id: string;
    name: string;
    icon: string;
    color: string;
    balance: number;
}

export interface Transaction {
    id: string;
    pocketId: string;
    categoryId: string;
    amount: number;
    type: TransactionType;
    note: string;
    date: string; // ISO string
    receiptUrl?: string;
}

export interface Goal {
    id: string;
    name: string;
    emoji: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string; // ISO string
    isCompleted: boolean;
}

export interface UserStats {
    monthlyIncome: number;
    monthlyExpense: number;
    healthScore: number; // 0 to 100
}
