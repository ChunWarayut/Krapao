"use client"

import { useState } from 'react';
import { useKrapaoStore } from '@/lib/store';
import { parseQuickEntry } from '@/lib/smartTagging';
import { TransactionType } from '@/types';
import CategoryPicker from './CategoryPicker';
import { format } from 'date-fns';
import { Check, Search, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TransactionForm({ onClose }: { onClose?: () => void }) {
    const { categories, pockets, addTransaction } = useKrapaoStore();

    const [type, setType] = useState<TransactionType>('expense');
    const [quickInput, setQuickInput] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [categoryId, setCategoryId] = useState(categories.find(c => c.type === 'expense')?.id || '');
    const [pocketId, setPocketId] = useState(pockets[0]?.id || '');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    // Handle Quick Entry (Smart Tagging)
    const handleQuickInputChange = (val: string) => {
        setQuickInput(val);
        const parsed = parseQuickEntry(val);
        if (parsed) {
            if (parsed.amount) setAmount(parsed.amount.toString());
            if (parsed.note) setNote(parsed.note);
            if (parsed.category) setCategoryId(parsed.category.id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !pocketId || !categoryId) return;

        addTransaction({
            amount: parseFloat(amount),
            type,
            note,
            categoryId,
            pocketId,
            date: new Date(date).toISOString(),
        });

        if (onClose) onClose();
        // Reset form
        setAmount('');
        setNote('');
        setQuickInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            <div className="flex gap-2 p-1.5 bg-emerald-900/40 rounded-2xl">
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={cn(
                        "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                        type === 'expense' ? "bg-emerald-800 text-rose-500 shadow-sm" : "text-emerald-200/40"
                    )}
                >
                    รายจ่าย
                </button>
                <button
                    type="button"
                    onClick={() => setType('income')}
                    className={cn(
                        "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                        type === 'income' ? "bg-amber-900/60 text-amber-500 shadow-sm" : "text-emerald-200/40"
                    )}
                >
                    รายรับ
                </button>
            </div>

            <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-emerald/50 transition-colors group-focus-within:text-brand-emerald">
                    <Search className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    placeholder="พิมพ์ด่วน: 'กาแฟ 120'..."
                    value={quickInput}
                    onChange={(e) => handleQuickInputChange(e.target.value)}
                    className="w-full pl-14 pr-24 py-5 bg-emerald-900/20 border border-white/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 transition-all text-lg font-bold text-white"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-brand-emerald uppercase tracking-widest bg-brand-mint/30 px-3 py-1.5 rounded-full shadow-sm animate-pulse">
                    ด่วน
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">จำนวนเงิน</label>
                    <div className="relative group">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-brand-emerald text-xl">$</span>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-10 pr-6 py-4 bg-emerald-950/40 backdrop-blur-xl border border-white/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 transition-all font-black text-center text-2xl tracking-tighter text-white"
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">วันที่</label>
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-6 py-4 bg-emerald-950/40 backdrop-blur-xl border border-white/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 transition-all font-bold text-center text-xl text-white"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">หมวดหมู่</label>
                <CategoryPicker
                    categories={categories}
                    selectedId={categoryId}
                    onSelect={setCategoryId}
                    type={type}
                />
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">กระเป๋าเงิน</label>
                <div className="grid grid-cols-2 gap-4">
                    {pockets.map(p => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => setPocketId(p.id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-4 rounded-3xl border transition-all active:scale-95 group/pocket",
                                pocketId === p.id
                                    ? "bg-brand-emerald border-brand-emerald text-white shadow-xl shadow-brand-emerald/30"
                                    : "bg-emerald-950/40 backdrop-blur-xl border-white/5 text-white hover:bg-emerald-950/60"
                            )}
                        >
                            <Wallet className={cn("w-5 h-5", pocketId === p.id ? "text-white" : "text-brand-emerald")} />
                            <span className="text-[14px] font-black tracking-tight">{p.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">บันทึกช่วยจำ (ไม่บังคับ)</label>
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="รายละเอียดเพิ่มเติม..."
                    className="w-full px-6 py-4 bg-emerald-950/40 backdrop-blur-xl border border-white/5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-emerald/50 transition-all font-bold text-white"
                />
            </div>

            <button
                type="submit"
                className="w-full py-5 bg-linear-to-br from-brand-gold via-brand-emerald to-brand-violet hover:scale-[1.02] text-white rounded-3xl font-black text-xl tracking-tight shadow-xl shadow-brand-gold/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 cursor-pointer"
            >
                <Check className="w-7 h-7" />
                บันทึกธุรกรรม
            </button>
        </form>
    );
}
