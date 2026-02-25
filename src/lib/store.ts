import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Category, Pocket, Goal } from '@/types';
import { DEFAULT_CATEGORIES } from '@/data/defaultCategories';
import { supabase } from './supabase/client';

interface KrapaoState {
    transactions: Transaction[];
    categories: Category[];
    pockets: Pocket[];
    goals: Goal[];
    privacyMode: boolean;
    user: { id: string, isGuest: boolean } | null;
    isSyncing: boolean;
    lastSyncError: string | null;

    // Actions
    setUser: (user: { id: string, isGuest: boolean } | null) => void;
    loadUserData: (userId: string) => Promise<void>;
    clearUserData: () => void;
    _sync: (operation: () => Promise<any> | any) => Promise<void>;

    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    updateTransaction: (id: string, transaction: Partial<Transaction>) => void;

    addPocket: (pocket: Omit<Pocket, 'id'>) => void;
    updatePocket: (id: string, pocket: Partial<Pocket>) => void;

    addGoal: (goal: Omit<Goal, 'id'>) => void;
    updateGoal: (id: string, goal: Partial<Goal>) => void;
    contributeToGoal: (id: string, amount: number) => void;
    resetAllData: () => Promise<void>;

    togglePrivacyMode: () => void;
}

export const useKrapaoStore = create<KrapaoState>()(
    persist(
        (set, get) => ({
            transactions: [],
            categories: DEFAULT_CATEGORIES,
            pockets: [
                { id: 'pk-1', name: 'กระเป๋าหลัก', icon: 'Wallet', color: '#10b981', balance: 0 },
                { id: 'pk-2', name: 'เงินออม', icon: 'PiggyBank', color: '#34d399', balance: 0 },
            ],
            goals: [],
            privacyMode: false,
            user: null,
            isSyncing: false,
            lastSyncError: null,

            setUser: (user) => set({ user }),

            loadUserData: async (userId) => {
                try {
                    // Fetch pockets
                    const { data: pocketsData } = await supabase.from('pockets').select('*').eq('user_id', userId);
                    // Fetch categories
                    const { data: categoriesData } = await supabase.from('categories').select('*').eq('user_id', userId);
                    // Fetch transactions
                    const { data: txData } = await supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false });
                    // Fetch goals
                    const { data: goalsData } = await supabase.from('goals').select('*').eq('user_id', userId);

                    set((state) => ({
                        pockets: pocketsData && pocketsData.length > 0 ? pocketsData : state.pockets,
                        categories: categoriesData && categoriesData.length > 0 ? categoriesData : DEFAULT_CATEGORIES,
                        transactions: txData || [],
                        goals: goalsData || [],
                    }));
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            },

            clearUserData: () => {
                set({
                    transactions: [],
                    pockets: [
                        { id: 'pk-1', name: 'กระเป๋าหลัก', icon: 'Wallet', color: '#10b981', balance: 0 },
                        { id: 'pk-2', name: 'เงินออม', icon: 'PiggyBank', color: '#34d399', balance: 0 },
                    ],
                    goals: [],
                    user: null
                });
            },

            // Helper for background sync
            _sync: async (operation: () => Promise<any> | any) => {
                set({ isSyncing: true, lastSyncError: null });
                try {
                    const result = await operation();
                    if (result && result.error) throw result.error;
                    set({ isSyncing: false });
                } catch (err: any) {
                    console.error("Sync error:", err);
                    set({ isSyncing: false, lastSyncError: err.message || 'Sync failed' });
                }
            },

            addTransaction: async (transaction) => {
                const user = get().user;
                if (!user) return;

                const newTx = { ...transaction, id: Math.random().toString(36).substring(2, 9), user_id: user.id };

                // Optimistic UI Update
                set((state) => ({
                    transactions: [newTx, ...state.transactions],
                    pockets: state.pockets.map(p => {
                        if (p.id === transaction.pocketId) {
                            const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
                            return { ...p, balance: p.balance + amount };
                        }
                        return p;
                    })
                }));

                get()._sync(() => supabase.from('transactions').insert([{
                    user_id: user.id,
                    amount: transaction.amount,
                    type: transaction.type,
                    note: transaction.note,
                    category_id: transaction.categoryId,
                    pocket_id: transaction.pocketId,
                    date: transaction.date
                }]));
            },

            deleteTransaction: async (id) => {
                const tx = get().transactions.find(t => t.id === id);
                if (!tx) return;

                // Optimistic UI Update
                set((state) => ({
                    transactions: state.transactions.filter(t => t.id !== id),
                    pockets: state.pockets.map(p => {
                        if (p.id === tx.pocketId) {
                            const amount = tx.type === 'income' ? -tx.amount : tx.amount;
                            return { ...p, balance: p.balance + amount };
                        }
                        return p;
                    })
                }));

                // Background Sync
                get()._sync(() => supabase.from('transactions').delete().eq('id', id));
            },

            updateTransaction: async (id, updatedTx) => {
                const user = get().user;
                if (!user) return;

                set((state) => ({
                    transactions: state.transactions.map(t => t.id === id ? { ...t, ...updatedTx } : t)
                }));

                await supabase.from('transactions').update({
                    amount: updatedTx.amount,
                    type: updatedTx.type,
                    note: updatedTx.note,
                    category_id: updatedTx.categoryId,
                    pocket_id: updatedTx.pocketId,
                    date: updatedTx.date
                }).eq('id', id);
            },

            addPocket: async (pocket) => {
                const user = get().user;
                if (!user) return;

                const newPocket = { ...pocket, id: Math.random().toString(36).substring(2, 9) };
                set((state) => ({ pockets: [...state.pockets, newPocket] }));

                get()._sync(() => supabase.from('pockets').insert([{
                    id: newPocket.id, // Add ID for Supabase
                    user_id: user.id,
                    name: pocket.name,
                    icon: pocket.icon,
                    color: pocket.color,
                    balance: pocket.balance
                }]));
            },

            updatePocket: async (id, updated) => {
                set((state) => ({
                    pockets: state.pockets.map(p => p.id === id ? { ...p, ...updated } : p)
                }));

                get()._sync(() => supabase.from('pockets').update(updated).eq('id', id));
            },

            addGoal: async (goal) => {
                const user = get().user;
                if (!user) return;

                const newGoal = { ...goal, id: Math.random().toString(36).substring(2, 9), currentAmount: 0 };
                set((state) => ({ goals: [...state.goals, newGoal] }));

                get()._sync(() => supabase.from('goals').insert([{
                    id: newGoal.id, // Add ID for Supabase
                    user_id: user.id,
                    name: goal.name,
                    emoji: goal.emoji,
                    target_amount: goal.targetAmount,
                    current_amount: newGoal.currentAmount, // Use newGoal's currentAmount (0)
                    deadline: goal.deadline
                }]));
            },

            updateGoal: async (id, updated) => {
                set((state) => ({
                    goals: state.goals.map(g => g.id === id ? { ...g, ...updated } : g)
                }));

                // Map camelCase to snake_case for Supabase
                const supaUpdate: any = {}; // Use any here temporarily for Supabase dynamic update object
                if (updated.name) supaUpdate.name = updated.name;
                if (updated.emoji) supaUpdate.emoji = updated.emoji;
                if (updated.targetAmount !== undefined) supaUpdate.target_amount = updated.targetAmount;
                if (updated.currentAmount !== undefined) supaUpdate.current_amount = updated.currentAmount;
                if (updated.isCompleted !== undefined) supaUpdate.is_completed = updated.isCompleted;
                if (updated.deadline) supaUpdate.deadline = updated.deadline;

                if (Object.keys(supaUpdate).length > 0) {
                    get()._sync(() => supabase.from('goals').update(supaUpdate).eq('id', id));
                }
            },

            contributeToGoal: async (id, amount) => {
                set((state) => ({
                    goals: state.goals.map(g => {
                        if (g.id === id) {
                            return { ...g, currentAmount: g.currentAmount + amount };
                        }
                        return g;
                    })
                }));

                const goal = get().goals.find(g => g.id === id);
                if (goal) {
                    await supabase.from('goals').update({ current_amount: goal.currentAmount }).eq('id', id);
                }
            },
            togglePrivacyMode: () => set((state) => ({ privacyMode: !state.privacyMode })),

            resetAllData: async () => {
                const user = get().user;

                // 1. Reset local state
                set({
                    transactions: [],
                    pockets: [
                        { id: 'pk-1', name: 'กระเป๋าหลัก', icon: 'Wallet', color: '#10b981', balance: 0 },
                        { id: 'pk-2', name: 'เงินออม', icon: 'PiggyBank', color: '#34d399', balance: 0 },
                    ],
                    goals: [],
                });

                // 2. If synced to Supabase, delete cloud data too
                if (user && !user.id.startsWith('guest-')) {
                    await get()._sync(async () => {
                        await supabase.from('transactions').delete().eq('user_id', user.id);
                        await supabase.from('pockets').delete().eq('user_id', user.id);
                        await supabase.from('goals').delete().eq('user_id', user.id);
                        return { error: null };
                    });
                }
            },
        }),
        {
            name: 'krapao-storage',
            version: 1,
            migrate: (persistedState: unknown, version: number) => {
                if (version === 0) {
                    // Migrate English categories to Thai and translate default pockets
                    const state = persistedState as KrapaoState;
                    const updatedPockets = state.pockets?.map(p => {
                        if (p.name === 'General Wallet') return { ...p, name: 'กระเป๋าหลัก' };
                        if (p.name === 'Savings') return { ...p, name: 'เงินออม' };
                        return p;
                    }) || [];

                    return {
                        ...state,
                        categories: DEFAULT_CATEGORIES,
                        pockets: updatedPockets
                    };
                }
                return persistedState as KrapaoState;
            }
        }
    )
);
