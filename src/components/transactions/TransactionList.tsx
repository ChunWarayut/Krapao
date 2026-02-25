"use client"

import { useState } from 'react';
import { useKrapaoStore } from '@/lib/store';
import { formatCurrency, cn } from '@/lib/utils';
import { DEFAULT_CATEGORIES } from '@/data/defaultCategories';
import * as Icons from 'lucide-react';
import { LucideIcon, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionList() {
    const { transactions, categories, privacyMode, deleteTransaction } = useKrapaoStore();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

    const filtered = transactions.filter(t => {
        const matchesSearch = t.note?.toLowerCase().includes(search.toLowerCase()) ||
            categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-emerald/40 w-5 h-5 transition-colors group-focus-within:text-brand-emerald" />
                    <input
                        type="text"
                        placeholder="ค้นหาธุรกรรม..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-emerald-900/20 backdrop-blur-xl border border-white/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 transition-all font-bold text-white"
                    />
                </div>
                <div className="flex bg-black/20 backdrop-blur-xl p-1.5 rounded-3xl border border-white/5 shadow-sm">
                    {(['all', 'income', 'expense'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={cn(
                                "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filterType === type
                                    ? "bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20"
                                    : "text-white/40 hover:text-brand-emerald"
                            )}
                        >
                            {type === 'all' ? 'ทั้งหมด' : type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-20 bg-emerald-950/20 rounded-[2.5rem] border-2 border-dashed border-emerald-800">
                        <p className="text-emerald-200/40 font-medium">ไม่พบธุรกรรม</p>
                    </div>
                ) : (
                    filtered.map((t) => {
                        const category = categories.find(c => c.id === t.categoryId) || DEFAULT_CATEGORIES[0];
                        const Icon = (Icons as unknown as Record<string, LucideIcon>)[category.icon] || Icons.HelpCircle;

                        return (
                            <div key={t.id} className="glass-card group overflow-hidden animate-slide-up hover:scale-[1.01] transition-all duration-300">
                                <div className="flex items-center justify-between p-5 rounded-4xl">
                                    <div className="flex items-center gap-6">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundColor: category.color, boxShadow: `0 10px 25px -5px ${category.color}40` }}
                                        >
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg text-white tracking-tight">{t.note || category.name}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">{format(new Date(t.date), 'EEEE, MMM d, yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className={cn(
                                                "font-black text-xl tracking-tighter",
                                                t.type === 'income' ? "text-brand-emerald" : "text-rose-500",
                                                privacyMode && "privacy-blur"
                                            )}>
                                                {t.type === 'income' ? '+' : '-'}{privacyMode ? '***' : formatCurrency(t.amount)}
                                            </p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-mint/40 mt-1">
                                                {category.name}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="p-3 text-rose-300 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
