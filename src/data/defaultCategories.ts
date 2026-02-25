import { Category } from "@/types";

export const DEFAULT_CATEGORIES: Category[] = [
    // Expenses
    { id: 'cat-1', name: 'อาหารและเครื่องดื่ม', icon: 'Utensils', color: '#10b981', type: 'expense' },
    { id: 'cat-2', name: 'การเดินทาง', icon: 'Bus', color: '#0ea5e9', type: 'expense' },
    { id: 'cat-3', name: 'ช้อปปิ้ง', icon: 'ShoppingBag', color: '#ec4899', type: 'expense' },
    { id: 'cat-4', name: 'บันเทิง', icon: 'Film', color: '#a855f7', type: 'expense' },
    { id: 'cat-5', name: 'บิลและค่าใช้จ่าย', icon: 'Receipt', color: '#ef4444', type: 'expense' },
    { id: 'cat-10', name: 'สุขภาพ', icon: 'HeartPulse', color: '#f43f5e', type: 'expense' },

    // Incomes
    { id: 'cat-6', name: 'เงินเดือน', icon: 'Banknote', color: '#10b981', type: 'income' },
    { id: 'cat-7', name: 'ฟรีแลนซ์', icon: 'Laptop', color: '#6366f1', type: 'income' },
    { id: 'cat-8', name: 'การลงทุน', icon: 'TrendingUp', color: '#f59e0b', type: 'income' },
    { id: 'cat-9', name: 'รายรับอื่นๆ', icon: 'PlusCircle', color: '#64748b', type: 'income' },
];

