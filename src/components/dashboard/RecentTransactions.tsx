"use client"

import { useKrapaoStore } from '@/lib/store';
import { formatCurrency, cn } from '@/lib/utils';
import { DEFAULT_CATEGORIES } from '@/data/defaultCategories';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function RecentTransactions() {
    const { transactions, categories, privacyMode } = useKrapaoStore();

    const recent = transactions.slice(0, 5);

    if (recent.length === 0) {
        return null;
    }

    return (
        <div className="glass-card p-10 rounded-4xl animate-slide-up shadow-[0_20px_80px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-xl tracking-tighter text-white">ธุรกรรมล่าสุด</h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-brand-mint hover:scale-105 transition-transform">ดูทั้งหมด</button>
            </div>

            <div className="space-y-4">
                {recent.map((transaction, i) => {
                    const category = categories.find(c => c.id === transaction.categoryId) || DEFAULT_CATEGORIES[0];
                    const Icon = (Icons as unknown as Record<string, LucideIcon>)[category.icon] || Icons.HelpCircle;

                    return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-3xl hover:bg-white/5 transition-all duration-300 group cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="flex items-center gap-5">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-opacity-20 transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: category.color, boxShadow: `0 10px 20px -5px ${category.color}40` }}
                                >
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-base text-white tracking-tight">{transaction.note || category.name}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-0.5">{format(new Date(transaction.date), 'MMM d, h:mm a')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={cn(
                                    "font-black text-lg tracking-tighter",
                                    transaction.type === 'income' ? "text-brand-emerald" : "text-rose-500",
                                    privacyMode && "privacy-blur"
                                )}>
                                    {transaction.type === 'income' ? '+' : '-'}{privacyMode ? '***' : formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-[9px] font-black text-brand-mint/40 uppercase tracking-widest mt-0.5">
                                    {transaction.type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
