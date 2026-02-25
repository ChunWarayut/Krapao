"use client"

import { useKrapaoStore } from '@/lib/store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

export default function ExpensePieChart() {
    const { transactions, categories, privacyMode } = useKrapaoStore();

    const currentMonth = new Date().getMonth();
    const expenseTransactions = transactions.filter(t =>
        t.type === 'expense' && new Date(t.date).getMonth() === currentMonth
    );

    const data = categories
        .filter(cat => cat.type === 'expense')
        .map(cat => {
            const amount = expenseTransactions
                .filter(t => t.categoryId === cat.id)
                .reduce((acc, t) => acc + t.amount, 0);
            return { name: cat.name, value: amount, color: cat.color };
        })
        .filter(d => d.value > 0);

    if (data.length === 0) {
        return (
            <div className="glass-card p-10 rounded-4xl h-[450px] flex flex-col items-center justify-center text-center animate-slide-up shadow-[0_20px_80px_rgba(0,0,0,0.02)]">
                <div className="w-24 h-24 bg-linear-to-br from-brand-mint/20 to-brand-emerald/10 rounded-full flex items-center justify-center mb-6 animate-float">
                    <span className="text-brand-emerald font-black text-3xl">!</span>
                </div>
                <h3 className="font-black text-2xl tracking-tighter text-white">รอการบันทึก</h3>
                <p className="text-sm font-medium text-white/40 max-w-xs mt-2 leading-relaxed">
                    เริ่มบันทึกรายจ่ายของคุณเพื่อดูสัดส่วนการใช้จ่ายที่นี่!
                </p>
            </div>
        );
    }

    return (
        <div className="glass-card p-10 rounded-4xl h-[450px] animate-slide-up shadow-[0_20px_80px_rgba(0,0,0,0.02)]">
            <h3 className="font-black text-xl tracking-tighter text-white mb-6">สัดส่วนการใช้จ่าย</h3>
            <div className="w-full h-full pb-10">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" className="hover:opacity-80 transition-opacity" />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number | undefined) => {
                                if (value === undefined) return '';
                                return privacyMode ? '***' : formatCurrency(value);
                            }}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
                                padding: '12px 16px'
                            }}
                            itemStyle={{ fontWeight: '900', color: '#10b981' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
