"use client"

import { useKrapaoStore } from '@/lib/store';
import GoalCard from '@/components/goals/GoalCard';
import GoalForm from '@/components/goals/GoalForm';
import { Target } from 'lucide-react';

export default function GoalsPage() {
    const { goals } = useKrapaoStore();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <section className="lg:col-span-4 space-y-10 lg:sticky lg:top-32">
                <div className="glass-card p-10 rounded-4xl shadow-premium-soft">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-linear-to-br from-brand-mint to-brand-emerald rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-emerald/20">
                            <Target className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter text-white">เป้าหมายใหม่</h2>
                    </div>
                    <GoalForm />
                </div>
            </section>

            <section className="lg:col-span-8 space-y-10">
                <h2 className="text-2xl font-black tracking-tighter text-white px-2">เป้าหมายการออม</h2>

                {goals.length === 0 ? (
                    <div className="text-center py-20 bg-emerald-950/10 backdrop-blur-3xl rounded-4xl border-2 border-dashed border-brand-emerald/20 flex flex-col items-center">
                        <div className="w-24 h-24 bg-linear-to-br from-brand-mint/20 to-brand-emerald/10 rounded-full flex items-center justify-center mb-8 animate-float">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h3 className="font-black text-2xl tracking-tighter text-white">เริ่มต้นวางแผน</h3>
                        <p className="text-sm text-white/40 max-w-xs mt-3 font-medium leading-relaxed">
                            คุณยังไม่ได้ตั้งเป้าหมาย เริ่มต้นกำหนดเป้าหมายทางการเงินของคุณเลย!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {goals.map(goal => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
