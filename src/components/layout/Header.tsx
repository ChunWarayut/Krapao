"use client"

import { useState, useEffect } from 'react';
import { useKrapaoStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, Bell, LogOut, User as UserIcon, Cloud, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
    const { privacyMode, togglePrivacyMode, user, isSyncing, lastSyncError } = useKrapaoStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHydrated(true);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-transparent sticky top-0 z-30 backdrop-blur-md">
            <div className="lg:hidden flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-brand-mint to-brand-emerald rounded-xl flex items-center justify-center shadow-lg shadow-brand-mint/20">
                    <span className="text-white font-black text-xl tracking-tighter">K</span>
                </div>
                <h1 className="font-black text-xl tracking-tighter text-white">Krapao</h1>
            </div>

            <div className="hidden lg:block">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-mint/60 mb-0.5">ยินดีต้อนรับกลับมา!</h2>
                <p className="text-xl font-black tracking-tight text-white">สรุปกระเป๋าเงินของคุณ</p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={togglePrivacyMode}
                    className={cn(
                        "p-2.5 rounded-2xl transition-all duration-300 border backdrop-blur-md",
                        privacyMode
                            ? "bg-brand-emerald border-brand-emerald text-white shadow-lg shadow-brand-emerald/20"
                            : "bg-white/5 border-white/10 text-brand-mint hover:scale-105 active:scale-95"
                    )}
                    title={privacyMode ? "แสดงยอดเงิน" : "ซ่อนยอดเงิน (โหมดความเป็นส่วนตัว)"}
                >
                    {privacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>

                <button className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-brand-mint backdrop-blur-md transition-all hover:scale-105 active:scale-95">
                    <Bell className="w-5 h-5" />
                </button>

                {/* Sync Status Badge */}
                <div className={cn(
                    "hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl border backdrop-blur-md transition-all duration-500",
                    isSyncing
                        ? "bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald"
                        : lastSyncError
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                            : "bg-white/5 border-white/10 text-slate-400"
                )}>
                    {isSyncing ? (
                        <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest">กำลังเซฟ...</span>
                        </>
                    ) : lastSyncError ? (
                        <>
                            <Cloud className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">เซฟไม่สำเร็จ</span>
                        </>
                    ) : (
                        <>
                            <Cloud className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">บันทึกแล้ว</span>
                        </>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-11 h-11 rounded-2xl bg-linear-to-br from-brand-mint to-brand-emerald p-0.5 ml-2 shadow-lg shadow-brand-mint/10 flex items-center justify-center transition-transform hover:scale-105"
                    >
                        <div className="w-full h-full rounded-[14px] bg-emerald-950 overflow-hidden border-2 border-emerald-900 flex items-center justify-center">
                            {!isHydrated ? null : user?.isGuest ? (
                                <UserIcon className="w-5 h-5 text-emerald-400" />
                            ) : (
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Lucky'}`} alt="User Profile" />
                            )}
                        </div>
                    </button>

                    {showDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowDropdown(false)}
                            />
                            <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl p-2 shadow-2xl border border-white/10 z-50 animate-slide-up origin-top-right">
                                <div className="p-3 border-b border-white/5 mb-2">
                                    <p className="text-sm font-bold text-white tracking-tight">
                                        {user?.isGuest ? 'ผู้เยี่ยมชม' : 'บัญชีของคุณ'}
                                    </p>
                                    <p className="text-[10px] text-emerald-400 font-medium tracking-widest mt-1 uppercase">
                                        {user?.isGuest ? 'ข้อมูลจะหายไปเมื่อล้างเบราว์เซอร์' : 'ซิงค์ข้อมูลแล้ว'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 transition-colors text-sm font-bold text-left"
                                >
                                    <LogOut className="w-4 h-4" />
                                    ออกจากระบบ
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
