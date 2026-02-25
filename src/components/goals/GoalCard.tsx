"use client"

import { Goal } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { useKrapaoStore } from '@/lib/store';
import { useState } from 'react';

export default function GoalCard({ goal }: { goal: Goal }) {
    const { contributeToGoal, privacyMode } = useKrapaoStore();
    const [amount, setAmount] = useState('');

    const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

    const handleContribute = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;
        contributeToGoal(goal.id, parseFloat(amount));
        setAmount('');
    };

    return (
        <div className="glass-card p-6 rounded-4xl animate-slide-up h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-emerald-900/30 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-emerald-800/50">
                    {goal.emoji}
                </div>
                {goal.isCompleted ? (
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        สำเร็จแล้ว
                    </div>
                ) : (
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        เก็บได้แล้ว {progress}%
                    </div>
                )}
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{goal.name}</h3>
                <p className="text-sm text-emerald-200/60 mb-6 font-medium">
                    เป้าหมายการออม
                </p>

                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-emerald-200/40">
                        <span className={privacyMode ? "privacy-blur" : ""}>{formatCurrency(goal.currentAmount)}</span>
                        <span className={privacyMode ? "privacy-blur" : ""}>{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="h-3 bg-emerald-900/30 rounded-full overflow-hidden border border-emerald-800/50">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-1000 ease-out",
                                goal.isCompleted ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-emerald-600"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {!goal.isCompleted && (
                <form onSubmit={handleContribute} className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">$</span>
                        <input
                            type="number"
                            placeholder="เพิ่มเงิน"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-6 pr-2 py-2.5 bg-emerald-900 border border-emerald-800 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 active:scale-95 transition-all shadow-md shadow-emerald-600/20"
                    >
                        <TrendingUp className="w-5 h-5" />
                    </button>
                </form>
            )}
        </div>
    );
}
