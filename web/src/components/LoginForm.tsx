'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'

type Mode = 'login' | 'register' | 'reset'

export default function LoginForm() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else if (mode === 'register') {
        await signUp(email, password)
      } else if (mode === 'reset') {
        await resetPassword(email)
        setMessage('Passwort-Reset E-Mail wurde gesendet.')
      }
    } catch (err) {
      const firebaseError = err as { code?: string }
      switch (firebaseError.code) {
        case 'auth/invalid-email':
          setError('Ungueltige E-Mail-Adresse.')
          break
        case 'auth/user-not-found':
          setError('Benutzer nicht gefunden.')
          break
        case 'auth/wrong-password':
          setError('Falsches Passwort.')
          break
        case 'auth/email-already-in-use':
          setError('E-Mail wird bereits verwendet.')
          break
        case 'auth/weak-password':
          setError('Passwort muss mindestens 6 Zeichen haben.')
          break
        case 'auth/invalid-credential':
          setError('Ungueltige Anmeldedaten.')
          break
        default:
          setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            placeholder="name@beispiel.de"
          />
        </div>

        {mode !== 'reset' && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              placeholder="Mindestens 6 Zeichen"
            />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Laden...
            </>
          ) : mode === 'login' ? (
            'Anmelden'
          ) : mode === 'register' ? (
            'Registrieren'
          ) : (
            'Passwort zuruecksetzen'
          )}
        </button>
      </form>

      <div className="mt-4 text-sm text-center space-y-2">
        {mode === 'login' && (
          <>
            <button
              onClick={() => { setMode('register'); setError(''); setMessage(''); }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Noch kein Konto? Registrieren
            </button>
            <br />
            <button
              onClick={() => { setMode('reset'); setError(''); setMessage(''); }}
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Passwort vergessen?
            </button>
          </>
        )}
        {mode === 'register' && (
          <button
            onClick={() => { setMode('login'); setError(''); setMessage(''); }}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Bereits ein Konto? Anmelden
          </button>
        )}
        {mode === 'reset' && (
          <button
            onClick={() => { setMode('login'); setError(''); setMessage(''); }}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Zurueck zur Anmeldung
          </button>
        )}
      </div>
    </div>
  )
}
