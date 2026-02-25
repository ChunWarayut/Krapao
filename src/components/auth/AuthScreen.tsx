"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Wallet, Mail, Lock, User, Loader2 } from 'lucide-react'

export default function AuthScreen({ onAuthenticated }: { onAuthenticated: (userId: string, isGuest: boolean) => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                if (data.user) onAuthenticated(data.user.id, false)
            } else {
                const { data, error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                if (data.user) {
                    // Provide immediate context since email confirmation might be disabled for testing
                    onAuthenticated(data.user.id, false)
                }
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGuestLogin = async () => {
        setError('')
        setIsLoading(true)
        try {
            const { data, error } = await supabase.auth.signInAnonymously()
            if (error) throw error
            if (data.user) onAuthenticated(data.user.id, true)
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'ไม่สามารถเข้าใช้งานแบบผู้เยี่ยมชมได้';
            setError(errorMessage.includes('disabled') ? 'Anonymous sign-ins are disabled. กรุณาเปิดใช้งานใน Supabase Settings > Authentication > Providers.' : errorMessage);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full flex-1 min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="fixed inset-0 z-[-1] mesh-gradient opacity-40" />

            <div className="w-full max-w-md space-y-8 animate-slide-up">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-linear-to-br from-emerald-400 to-teal-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">Krapao</h1>
                        <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mt-2">Digital Wallet</p>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-4xl shadow-xl border border-white/5 space-y-6 relative overflow-hidden">
                    {/* Decorative blurred blob */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                    <form onSubmit={handleEmailAuth} className="space-y-4 relative z-10">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="อีเมลของคุณ"
                                    className="w-full pl-12 pr-4 py-4 bg-emerald-950/40 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-white/30 transition-all font-medium"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="รหัสผ่าน"
                                    className="w-full pl-12 pr-4 py-4 bg-emerald-950/40 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-white/30 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-rose-400 text-xs font-bold text-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-white text-emerald-950 hover:bg-emerald-50 rounded-2xl font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
                        </button>
                    </form>

                    <div className="relative z-10 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                        >
                            {isLogin ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
                        </button>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 py-2">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/30 text-xs font-bold uppercase">หรือ</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                        className="relative z-10 w-full py-4 bg-emerald-900/30 hover:bg-emerald-900/50 text-white border border-white/10 rounded-2xl font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <User className="w-5 h-5" />
                        เข้าใช้งานแบบผู้เยี่ยมชม
                    </button>
                </div>

                <p className="text-center text-xs text-white/30 font-medium">
                    ข้อมูลของคุณถูกเข้ารหัสและปกป้องอย่างปลอดภัยด้วย Supabase
                </p>
            </div>
        </div>
    )
}
