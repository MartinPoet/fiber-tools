'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

interface AuthGuardProps {
  children: React.ReactNode
  fallbackMessage?: string
}

export default function AuthGuard({ children, fallbackMessage }: AuthGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Laden...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Premium-Feature</h2>
          <p className="text-slate-400">
            {fallbackMessage || 'Bitte melden Sie sich an, um auf dieses Feature zuzugreifen.'}
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <LoginForm />
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Zurueck zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
