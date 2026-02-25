"use client"

import { useState } from 'react';
import { useKrapaoStore } from '@/lib/store';
import { Check } from 'lucide-react';

export default function GoalForm({ onClose }: { onClose?: () => void }) {
    const { addGoal } = useKrapaoStore();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [emoji, setEmoji] = useState('💰');
    const [deadline, setDeadline] = useState('');

    const emojis = ['💰', '🚗', '🏠', '✈️', '💻', '⌚', '🎁', '🎓', '🏥'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !targetAmount) return;

        addGoal({
            name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: 0,
            emoji,
            deadline,
            isCompleted: false,
        });

        if (onClose) onClose();
        setName('');
        setTargetAmount('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-emerald-200/40 ml-2">ไอคอน</label>
                <div className="flex flex-wrap gap-2">
                    {emojis.map(e => (
                        <button
                            key={e}
                            type="button"
                            onClick={() => setEmoji(e)}
                            className={`w-12 h-12 flex items-center justify-center text-xl rounded-xl border transition-all ${emoji === e
                                ? "bg-emerald-600 border-emerald-600 scale-110 shadow-lg shadow-emerald-600/20"
                                : "bg-emerald-900 border-emerald-800 grayscale hover:grayscale-0"
                                }`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-emerald-200/40 ml-2">ชื่อเป้าหมาย</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="รถคันใหม่, เที่ยวญี่ปุ่น..."
                    className="w-full px-4 py-3 bg-emerald-900 border border-emerald-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-emerald-200/40 ml-2">จำนวนเงินเป้าหมาย</label>
                    <input
                        type="number"
                        required
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-emerald-900 border border-emerald-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-emerald-200/40 ml-2">วันที่เป้าหมาย (ไม่บังคับ)</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-4 py-3 bg-emerald-900 border border-emerald-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <Check className="w-6 h-6" />
                สร้างเป้าหมาย
            </button>
        </form>
    );
}
