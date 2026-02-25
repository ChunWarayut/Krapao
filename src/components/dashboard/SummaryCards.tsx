"use client"

import { useKrapaoStore } from '@/lib/store';
import { formatCurrency, cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export default function SummaryCards() {
    const { transactions, pockets, privacyMode } = useKrapaoStore();

    const totalBalance = pockets.reduce((acc, p) => acc + p.balance, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const cards = [
        {
            title: 'ยอดเงินคงเหลือ',
            value: totalBalance,
            icon: Wallet,
            color: 'text-brand-emerald',
            bg: 'bg-brand-mint/5',
            extra: 'gradient-border',
        },
        {
            title: 'รายรับเดือนนี้',
            value: income,
            icon: ArrowUpRight,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            trend: '+12% จากเดือนที่แล้ว',
        },
        {
            title: 'รายจ่ายเดือนนี้',
            value: expense,
            icon: ArrowDownRight,
            color: 'text-rose-500',
            bg: 'bg-rose-500/5',
            trend: '-5% จากเดือนที่แล้ว',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, i) => (
                <div key={i} className={cn("glass-card p-8 rounded-4xl animate-slide-up group hover:-translate-y-1 transition-all duration-500", card.extra)} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-6">
                        <div className={cn("p-4 rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110", card.bg)}>
                            <card.icon className={cn("w-7 h-7", card.color)} />
                        </div>
                        {card.trend && (
                            <span className={cn("text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase",
                                card.trend.startsWith('+') ? "bg-brand-mint/20 text-brand-emerald" : "bg-rose-500/20 text-rose-600"
                            )}>
                                {card.trend}
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{card.title}</p>
                    <h3 className={cn("text-3xl font-black tracking-tighter text-white", privacyMode && "privacy-blur")}>
                        {formatCurrency(card.value)}
                    </h3>
                </div>
            ))}
        </div>
    );
}
