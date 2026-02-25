import type { Metadata } from 'next';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionList from '@/components/transactions/TransactionList';

export const metadata: Metadata = {
    title: "ธุรกรรม",
    description: "บันทึกรายรับรายจ่ายของคุณอย่างรวดเร็ว พร้อมระบบสแกนใบเสร็จอัจฉริยะ",
};

export default function TransactionsPage() {
    return (
        <section className="lg:col-span-12 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Add Transaction Section */}
                <div className="lg:col-span-5 glass-card p-10 rounded-4xl animate-slide-up shadow-premium-soft lg:sticky lg:top-32">
                    <h2 className="text-2xl font-black tracking-tighter text-white mb-8">เพิ่มธุรกรรม</h2>
                    <TransactionForm />
                </div>

                {/* History Section */}
                <div className="lg:col-span-7 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-black tracking-tighter text-white">ประวัติธุรกรรม</h2>
                    </div>
                    <TransactionList />
                </div>
            </div>
        </section>
    );
}
