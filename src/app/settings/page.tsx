"use client"

import { useKrapaoStore } from '@/lib/store';
import { generateBudgetReport } from '@/lib/pdfExport';
import { Eye, EyeOff, FileDown, Database, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const {
        privacyMode,
        togglePrivacyMode,
        transactions,
        categories
    } = useKrapaoStore();

    const handleExport = async () => {
        const currentMonth = new Date().getMonth();
        const monthlyTrans = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
        const income = monthlyTrans.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = monthlyTrans.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

        await generateBudgetReport(
            transactions.slice(0, 50), // Export last 50 for demo
            categories,
            {
                monthlyIncome: income,
                monthlyExpense: expense,
                healthScore: income > 0 ? Math.round(((income - expense) / income) * 100) : 0
            }
        );
    };

    const sections = [
        {
            title: 'การแสดงผลและความเป็นส่วนตัว',
            items: [
                {
                    name: 'โหมดความเป็นส่วนตัว',
                    description: 'ซ่อนยอดเงินและจำนวนเงินในหน้าแรก',
                    icon: privacyMode ? EyeOff : Eye,
                    action: togglePrivacyMode,
                    status: privacyMode ? 'เปิด' : 'ปิด',
                    color: 'text-emerald-600'
                }
            ]
        },
        {
            title: 'ข้อมูลและรายงาน',
            items: [
                {
                    name: 'ส่งออกรายงานงบประมาณ (PDF)',
                    description: 'ดาวน์โหลดสรุปรายละเอียดการเงินของคุณ',
                    icon: FileDown,
                    action: handleExport,
                    status: 'ดาวน์โหลด',
                    color: 'text-emerald-600'
                },
                {
                    name: 'ซิงค์ข้อมูลบน Cloud',
                    description: 'เชื่อมต่อและสำรองข้อมูลอัตโนมัติอย่างปลอดภัย',
                    icon: Database,
                    action: () => alert('แอปพลิเคชันกำลังซิงค์และสำรองข้อมูลบน Supabase อัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลง!'),
                    status: 'เชื่อมต่อแล้ว',
                    color: 'text-brand-emerald'
                }
            ]
        },
        {
            title: 'โซนอันตราย',
            items: [
                {
                    name: 'ลบข้อมูลทั้งหมด',
                    description: 'ลบประวัติธุรกรรมและเป้าหมายทั้งหมดอย่างถาวร',
                    icon: Trash2,
                    action: async () => {
                        if (confirm('ต้องการลบข้อมูลทั้งหมดใช่หรือไม่?')) {
                            const { resetAllData } = useKrapaoStore.getState();
                            await resetAllData();
                            alert('ลบข้อมูลทั้งหมดเรียบร้อยแล้ว');
                        }
                    },
                    status: 'ล้างข้อมูล',
                    color: 'text-rose-500'
                }
            ]
        }
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
            <h2 className="text-3xl font-extrabold tracking-tight px-2">การตั้งค่า</h2>

            {sections.map((section, si) => (
                <div key={si} className="space-y-4 animate-slide-up" style={{ animationDelay: `${si * 0.1}s` }}>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-200/40 px-4">
                        {section.title}
                    </h3>
                    <div className="glass-card p-8 rounded-4xl overflow-hidden">
                        {section.items.map((item, ii) => (
                            <button
                                key={ii}
                                onClick={item.action}
                                className={cn(
                                    "w-full flex items-center justify-between p-6 hover:bg-emerald-900/30 transition-all text-left",
                                    ii !== section.items.length - 1 && "border-b border-emerald-800/50"
                                )}
                            >
                                <div className="flex gap-4 items-center">
                                    <div className={cn("p-3 rounded-2xl bg-emerald-900/50", item.color)}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{item.name}</p>
                                        <p className="text-sm text-emerald-200/60">{item.description}</p>
                                    </div>
                                </div>
                                <div className="text-sm font-bold bg-emerald-800 px-4 py-2 rounded-xl">
                                    {item.status}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="text-center pt-8">
                <p className="text-xs text-emerald-200/40">Krapao Digital Wallet v0.1.0</p>
                <p className="text-[10px] text-emerald-200/20 mt-1 uppercase tracking-widest">Minimal • MobileFirst • Secure</p>
            </div>
        </div>
    );
}
