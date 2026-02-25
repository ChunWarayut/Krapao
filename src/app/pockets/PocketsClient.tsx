"use client"

import { useState } from 'react';
import { useKrapaoStore } from '@/lib/store';
import { formatCurrency, cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { LucideIcon, Wallet, PiggyBank, Plus, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const POCKET_ICONS = ['Wallet', 'PiggyBank', 'CreditCard', 'Banknote', 'DollarSign', 'Coins', 'ShoppingBag', 'Home', 'Car', 'Plane'];
const POCKET_COLORS = ['#10b981', '#F59E0B', '#8B5CF6', '#0ea5e9', '#ec4899', '#ef4444', '#f97316', '#14b8a6', '#6366f1', '#84cc16'];

export default function PocketsClient() {
    const { pockets, transactions, privacyMode, addPocket } = useKrapaoStore();
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('Wallet');
    const [color, setColor] = useState('#10b981');

    const totalBalance = pockets.reduce((acc, p) => acc + p.balance, 0);

    const getPocketTransactions = (pocketId: string) =>
        transactions.filter(t => t.pocketId === pocketId);

    const getPocketIncome = (pocketId: string) =>
        getPocketTransactions(pocketId).filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);

    const getPocketExpense = (pocketId: string) =>
        getPocketTransactions(pocketId).filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        addPocket({ name: name.trim(), icon, color, balance: 0 });
        setName('');
        setIcon('Wallet');
        setColor('#10b981');
        setShowForm(false);
    };

    return (
        <div className="space-y-10 animate-slide-up">
            {/* Header Row */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white">กระเป๋าเงิน</h1>
                    <p className="text-sm text-slate-400 mt-1 font-medium">จัดการกระเป๋าเงินและยอดเงินของคุณ</p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-2 px-5 py-3 bg-linear-to-br from-brand-gold to-brand-violet text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-gold/20 hover:scale-105 transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    เพิ่มกระเป๋า
                </button>
            </div>

            {/* Total Balance Banner */}
            <div className="glass-card p-8 rounded-4xl gradient-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">ยอดรวมทั้งหมด</p>
                <p className={cn("text-5xl font-black tracking-tighter text-white", privacyMode && "privacy-blur")}>
                    {formatCurrency(totalBalance)}
                </p>
                <p className="text-xs text-slate-500 mt-2 font-medium">{pockets.length} กระเป๋าเงิน</p>
            </div>

            {/* Add Pocket Form */}
            {showForm && (
                <div className="glass-card p-8 rounded-4xl animate-slide-up">
                    <h2 className="text-lg font-black tracking-tight text-white mb-6">เพิ่มกระเป๋าเงินใหม่</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">ชื่อกระเป๋า</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="เช่น ค่าใช้จ่ายรายเดือน"
                                required
                                className="w-full px-5 py-3.5 bg-slate-800/60 border border-slate-600/50 rounded-2xl font-semibold text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">ไอคอน</label>
                            <div className="grid grid-cols-5 gap-2">
                                {POCKET_ICONS.map(ic => {
                                    const Ic = (Icons as unknown as Record<string, LucideIcon>)[ic] || Wallet;
                                    return (
                                        <button
                                            key={ic}
                                            type="button"
                                            onClick={() => setIcon(ic)}
                                            className={cn(
                                                "p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer",
                                                icon === ic ? "bg-brand-emerald text-white" : "bg-slate-800 text-slate-400 hover:bg-brand-emerald/20"
                                            )}
                                        >
                                            <Ic className="w-5 h-5" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">สี</label>
                            <div className="flex gap-2 flex-wrap">
                                {POCKET_COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={cn("w-9 h-9 rounded-full border-2 transition-all cursor-pointer", color === c ? "border-white scale-110 shadow-lg" : "border-transparent")}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-1 py-3.5 bg-linear-to-br from-brand-emerald to-brand-teal text-white rounded-2xl font-black tracking-tight shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                                สร้างกระเป๋า
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3.5 bg-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-700 transition-all cursor-pointer">
                                ยกเลิก
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Pockets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pockets.map((pocket, i) => {
                    const Icon = (Icons as unknown as Record<string, LucideIcon>)[pocket.icon] || PiggyBank;
                    const income = getPocketIncome(pocket.id);
                    const expense = getPocketExpense(pocket.id);
                    const txCount = getPocketTransactions(pocket.id).length;
                    const isPositive = pocket.balance >= 0;

                    return (
                        <div
                            key={pocket.id}
                            className="glass-card p-7 rounded-4xl group hover:-translate-y-1 transition-all duration-300 animate-slide-up cursor-default"
                            style={{ animationDelay: `${i * 0.08}s` }}
                        >
                            {/* Icon & Name */}
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundColor: `${pocket.color}20`, boxShadow: `0 8px 24px ${pocket.color}30` }}
                                >
                                    <Icon className="w-7 h-7" style={{ color: pocket.color }} />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg tracking-tight text-white">{pocket.name}</h3>
                                    <p className="text-xs text-slate-400 font-medium">{txCount} ธุรกรรม</p>
                                </div>
                            </div>

                            {/* Balance */}
                            <div className="mb-5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ยอดคงเหลือ</p>
                                <p className={cn(
                                    "text-3xl font-black tracking-tighter",
                                    isPositive ? "text-white" : "text-rose-500",
                                    privacyMode && "privacy-blur"
                                )}>
                                    {formatCurrency(pocket.balance)}
                                </p>
                            </div>

                            {/* Income / Expense */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-amber-500/10 rounded-2xl p-3">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">รายรับ</span>
                                    </div>
                                    <p className={cn("text-sm font-black text-amber-400", privacyMode && "privacy-blur")}>
                                        {formatCurrency(income)}
                                    </p>
                                </div>
                                <div className="bg-rose-500/10 rounded-2xl p-3">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-600">รายจ่าย</span>
                                    </div>
                                    <p className={cn("text-sm font-black text-rose-500", privacyMode && "privacy-blur")}>
                                        {formatCurrency(expense)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            {income > 0 && (
                                <div className="mt-4">
                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${Math.min((expense / income) * 100, 100)}%`,
                                                backgroundColor: expense / income > 0.8 ? '#ef4444' : pocket.color
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[9px] text-slate-400">ใช้จ่ายแล้ว {income > 0 ? Math.round((expense / income) * 100) : 0}%</span>
                                        {expense / income > 0.8 && <span className="text-[9px] text-rose-400 font-bold">⚠ ใกล้เต็ม</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {pockets.length === 0 && (
                <div className="text-center py-20 glass-card rounded-4xl border-2 border-dashed border-brand-emerald/20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-brand-mint/10 rounded-full flex items-center justify-center mb-6 animate-float">
                        <Wallet className="w-9 h-9 text-brand-emerald" />
                    </div>
                    <h3 className="font-black text-xl tracking-tighter text-white">ยังไม่มีกระเป๋าเงิน</h3>
                    <p className="text-sm text-slate-400 mt-2 max-w-xs font-medium leading-relaxed">กดปุ่ม &quot;เพิ่มกระเป๋า&quot; เพื่อสร้างกระเป๋าเงินแรกของคุณ</p>
                </div>
            )}

            {/* Stats summary row */}
            {pockets.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">รายรับรวม</p>
                            <p className={cn("text-xl font-black tracking-tighter text-white", privacyMode && "privacy-blur")}>
                                {formatCurrency(pockets.reduce((a, p) => a + getPocketIncome(p.id), 0))}
                            </p>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                            <TrendingDown className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">รายจ่ายรวม</p>
                            <p className={cn("text-xl font-black tracking-tighter text-rose-500", privacyMode && "privacy-blur")}>
                                {formatCurrency(pockets.reduce((a, p) => a + getPocketExpense(p.id), 0))}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
