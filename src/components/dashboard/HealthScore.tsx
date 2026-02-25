"use client"

import { useKrapaoStore } from '@/lib/store';
import { calculateHealthScore, cn } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export default function HealthScore() {
    const { transactions } = useKrapaoStore();

    const currentMonth = new Date().getMonth();
    const monthlyTransactions = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);

    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    const score = calculateHealthScore(income, expense);

    let status = "เริ่มต้นใช้งาน";
    let color = "text-emerald-500";
    let Icon = Shield;
    let message = "บันทึกรายรับรายจ่ายเพื่อดูคะแนนสุขภาพการเงินของคุณ!";

    if (income > 0) {
        if (score >= 80) {
            status = "ยอดเยี่ยม";
            color = "text-emerald-500";
            Icon = ShieldCheck;
            message = "คุณออมเงินเก่งมาก! ทำดีต่อไปนะ";
        } else if (score >= 50) {
            status = "ดี";
            color = "text-blue-500";
            Icon = Shield;
            message = "มั่นคงดี ลองพยายามออมเพิ่มอีกนิดนะ!";
        } else {
            status = "ควรระวัง";
            color = "text-amber-500";
            Icon = ShieldAlert;
            message = "รายจ่ายคุณสูงเกินไป ระวังหน่อยนะ";
        }
    }

    return (
        <div className="glass-card p-10 rounded-4xl flex flex-col md:flex-row items-center gap-10 animate-slide-up shadow-[0_20px_80px_rgba(0,0,0,0.02)]">
            <div className="relative w-44 h-44 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-10 border-white/5" />
                {/* Simple Circular Progress - High Fidelity */}
                <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <circle
                        cx="88" cy="88" r="76"
                        className="stroke-transparent"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    <circle
                        cx="88" cy="88" r="76"
                        className={cn("transition-all duration-1000 ease-out",
                            score >= 80 ? "stroke-brand-mint" : score >= 50 ? "stroke-blue-500" : "stroke-amber-500"
                        )}
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={477}
                        strokeDashoffset={477 - (477 * score) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black tracking-tighter text-white leading-none">{score}</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-brand-mint/40 mt-1">สุขภาพ</span>
                </div>
            </div>

            <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2.5 mb-3">
                    <div className={cn("p-1.5 rounded-lg", status === "Excellent" ? "bg-brand-emerald/10" : "bg-blue-500/10")}>
                        <Icon className={cn("w-6 h-6", color)} />
                    </div>
                    <h3 className={cn("text-2xl font-black tracking-tight", color)}>{status}</h3>
                </div>
                <p className="text-white/60 text-sm font-medium max-w-sm leading-relaxed">
                    {message}
                </p>

                <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                    <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-[9px] font-black text-brand-mint/50 uppercase tracking-widest mb-1">สัดส่วนการออม</p>
                        <p className="text-base font-black text-white tracking-tight">{score}%</p>
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-[9px] font-black text-brand-mint/50 uppercase tracking-widest mb-1">สถานะงบประมาณ</p>
                        <p className="text-base font-black text-white tracking-tight">สดใส</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
