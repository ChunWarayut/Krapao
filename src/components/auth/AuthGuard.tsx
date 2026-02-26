"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useKrapaoStore } from '@/lib/store'
import AuthScreen from './AuthScreen'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { setUser, loadUserData, clearUserData } = useKrapaoStore()
    const [isChecking, setIsChecking] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        // 1. Check current session on mount
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.user) {
                const isGuest = (session.user as any).is_anonymous || false
                handleUserAuthenticated(session.user.id, isGuest)
            } else {
                setIsChecking(false)
            }
        }

        checkSession()

        // 2. Listen for auth changes (logout, etc)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            if (event === 'SIGNED_OUT') {
                clearUserData()
                setIsAuthenticated(false)
            } else if (session?.user && event === 'SIGNED_IN') {
                const isGuest = (session.user as any).is_anonymous || false
                handleUserAuthenticated(session.user.id, isGuest)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUserAuthenticated = async (userId: string, isGuest: boolean) => {
        setIsChecking(true)
        try {
            // Set basic user info in store
            setUser({ id: userId, isGuest })

            // Attempt to load existing user data from Supabase
            await loadUserData(userId)

            setIsAuthenticated(true)
        } catch (error) {
            console.error('Failed to initialize user data:', error)
        } finally {
            setIsChecking(false)
        }
    }

    if (isChecking) {
        return (
            <div className="w-full flex-1 min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-white/50 text-sm font-bold tracking-wider">กำลังตรวจสอบข้อมูล...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <AuthScreen onAuthenticated={handleUserAuthenticated} />
    }

    return <>{children}</>
}
