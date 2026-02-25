"use client"

import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Receipt,
    Wallet,
    Target,
    Settings,
    Scan
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'ภาพรวม', href: '/dashboard', icon: LayoutDashboard },
    { name: 'ธุรกรรม', href: '/transactions', icon: Receipt },
    { name: 'กระเป๋าเงิน', href: '/pockets', icon: Wallet },
    { name: 'สแกนใบเสร็จ', href: '/transactions/scan', icon: Scan },
    { name: 'เป้าหมาย', href: '/goals', icon: Target },
    { name: 'ตั้งค่า', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 glass-sidebar p-8 z-20">
            <div className="flex items-center gap-4 mb-12 px-2 group cursor-pointer">
                <div className="w-12 h-12 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <NextImage
                        src="/logo.png"
                        alt="Krapao Logo"
                        fill
                        className="object-contain drop-shadow-lg shadow-brand-gold/20"
                    />
                </div>
                <div>
                    <h1 className="font-black text-2xl tracking-tighter text-white leading-none">Krapao</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-1">กระเป๋าเงินอัจฉริยะ</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-label={item.name}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative cursor-pointer",
                                isActive
                                    ? "bg-emerald-500/15 text-emerald-300 shadow-[inset_0_0_20px_rgba(16,185,129,0.08)]"
                                    : "text-slate-300 hover:bg-slate-700/50 hover:text-emerald-300"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 w-1.5 h-6 bg-linear-to-b from-brand-gold to-brand-violet rounded-r-full" />
                            )}
                            <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-emerald-300" : "text-slate-400")} />
                            <span className="font-semibold text-sm tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto p-6 bg-linear-to-br from-brand-mint/10 to-transparent rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-mint/10 blur-2xl rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700" />
                <p className="text-[10px] font-black text-brand-mint uppercase tracking-widest mb-2">เคล็ดลับ</p>
                <p className="text-xs font-bold leading-relaxed text-white/70">สแกนใบเสร็จเพื่อประหยัดเวลาและบันทึกรายจ่ายอัตโนมัติ!</p>
            </div>
        </aside>
    );
}
