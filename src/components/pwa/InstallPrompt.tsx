"use client"

import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed or in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            (document as any).referrer.includes('android-app://');

        if (isStandalone) return;

        // Check if dismissed
        if (localStorage.getItem('pwa-prompt-dismissed')) return;

        // Detect iOS
        const userAgent = window.navigator.userAgent;
        const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !((window as any).MSStream);

        // Use a small delay for both state sets to avoid cascading render lint
        const timer = setTimeout(() => {
            if (isIOSDevice) {
                setIsIOS(true);
                setIsVisible(true);
            }
        }, 3000);

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timer);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-28 left-4 right-4 z-50 animate-slide-up flex justify-center">
            <div className="relative group max-w-md w-full">
                {/* Glow Backdrop Effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-brand-mint/20 via-brand-gold/10 to-brand-violet/20 rounded-[2.5rem] blur-2xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 opacity-70"></div>

                <div className="relative glass-card p-4 rounded-[2rem] shadow-2xl border border-white/20 flex items-center justify-between gap-4 overflow-hidden">
                    {/* Animated Shine Effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"></div>

                    <div className="flex items-center gap-4 relative z-10">
                        {/* App Icon Circle */}
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-brand-emerald to-brand-teal flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <Download className="w-7 h-7 drop-shadow-md" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-gold rounded-full border-2 border-[#1E293B] flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h4 className="text-sm font-black text-white tracking-tight">
                                สัมผัสประสบการณ์ที่เหนือกว่า
                            </h4>
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                                {isIOS
                                    ? "แตะ 'แชร์' แล้วเลือก 'เพิ่มลงในหน้าจอโฮม'"
                                    : "ติดตั้ง Krapao ลงบนเครื่องของคุณเพื่อการเข้าถึงที่รวดเร็ว"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        {!isIOS && (
                            <button
                                onClick={handleInstall}
                                className="px-5 py-2.5 bg-linear-to-r from-brand-emerald to-brand-mint text-emerald-950 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-emerald/20"
                            >
                                ติดตั้งเลย
                            </button>
                        )}
                        {isIOS && (
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Share className="w-5 h-5 text-brand-mint animate-bounce" />
                            </div>
                        )}

                        <button
                            onClick={handleDismiss}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
