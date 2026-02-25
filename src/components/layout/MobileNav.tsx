"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Receipt,
    Scan,
    Target,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'ภาพรวม', href: '/dashboard', icon: LayoutDashboard },
    { name: 'ธุรกรรม', href: '/transactions', icon: Receipt },
    { name: 'สแกน', href: '/transactions/scan', icon: Scan },
    { name: 'เป้าหมาย', href: '/goals', icon: Target },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-linear-to-t from-background via-background/90 to-transparent">
            <div className="glass-card h-16 rounded-3xl flex items-center justify-around px-4 relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-white/5">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href;

                    // Add extra space for the central floating button
                    const isSecond = index === 1;
                    const isThird = index === 2;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-12 h-12 transition-all duration-300",
                                isActive ? "text-brand-mint" : "text-white/30 hover:text-brand-emerald",
                                isSecond && "mr-10",
                                isThird && "ml-10"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "scale-110")} />
                            <span className="text-[10px] font-black mt-1 uppercase tracking-widest leading-none">{item.name}</span>
                            {isActive && (
                                <div className="absolute bottom-1 w-1 h-1 bg-brand-mint rounded-full" />
                            )}
                        </Link>
                    );
                })}

                {/* Central Add Button - Premium Floating Action Button */}
                <Link
                    href="/transactions?add=true"
                    className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 bg-linear-to-br from-brand-mint to-brand-emerald rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-mint/30 border-[6px] border-background active:scale-95 transition-all duration-300 group"
                >
                    <Plus className="w-8 h-8 font-black group-hover:rotate-90 transition-transform duration-500" />
                </Link>
            </div>
        </div>
    );
}
