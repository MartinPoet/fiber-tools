'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

export default function LandingPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Laden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Fiber Tools</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/atlas" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Atlas
            </Link>
            <Link href="/gemeinden" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Gemeinden
            </Link>
            <Link href="/kalkulation" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Kalkulation
            </Link>
            {user ? (
              <button
                onClick={() => signOut()}
                className="text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Abmelden
              </button>
            ) : (
              <button
                onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors font-medium"
              >
                Anmelden
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              FTTH Infrastructure Intelligence
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Datengetriebene Planung fuer den
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> Glasfaserausbau</span>
            </h1>

            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              Professionelle Analyse-Tools fuer Netzbetreiber, Kommunen und Investoren.
              Fundierte Entscheidungen auf Basis aktueller Marktdaten und Potenzialanalysen.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/atlas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors"
              >
                Atlas erkunden
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/gemeinden"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold transition-colors"
              >
                Gemeindeanalyse
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-800 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-1">2.095</div>
              <div className="text-slate-400 text-sm">Gemeinden erfasst</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-1">4.8M</div>
              <div className="text-slate-400 text-sm">Adressen analysiert</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-1">Q4/24</div>
              <div className="text-slate-400 text-sm">Aktuelle Daten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-1">100%</div>
              <div className="text-slate-400 text-sm">Oesterreich-Abdeckung</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Unsere Analyse-Tools</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Spezialisierte Werkzeuge fuer jeden Schritt Ihrer FTTH-Projektplanung
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Atlas Card */}
            <Link href="/atlas" className="group">
              <div className="h-full p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-800 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-400 transition-colors">
                  Breitband-Atlas
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Interaktive Karte mit Versorgungsdaten aller oesterreichischen Gemeinden.
                  Vergleichen Sie Quartale und identifizieren Sie Ausbaugebiete.
                </p>
                <div className="flex items-center text-emerald-400 text-sm font-medium">
                  Zur Karte
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Gemeinden Card */}
            <Link href="/gemeinden" className="group">
              <div className="h-full p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-emerald-500/50 hover:bg-slate-800 transition-all">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                  Gemeindeanalyse
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Detaillierte Gemeinde-Profile mit Anschlusspotenzial, Kontaktdaten
                  und Statistiken fuer Ihre Akquise und Projektplanung.
                </p>
                <div className="flex items-center text-blue-400 text-sm font-medium">
                  Gemeinden durchsuchen
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* CAPEX Card */}
            <Link href="/kalkulation" className="group">
              <div className="relative h-full p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-amber-500/50 hover:bg-slate-800 transition-all">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-xs font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Premium
                  </span>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-400 transition-colors">
                  CAPEX-Kalkulation
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Professionelle Investitionskostenberechnung fuer Tiefbau, Material
                  und Projektmanagement. Detaillierte Kostenaufstellung.
                </p>
                <div className="flex items-center text-amber-400 text-sm font-medium">
                  Zur Kalkulation
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Login Section */}
      {!user && (
        <section id="login-section" className="py-24 bg-slate-800/30 border-y border-slate-800">
          <div className="max-w-md mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Premium-Zugang</h2>
              <p className="text-slate-400">
                Melden Sie sich an, um auf alle Features zuzugreifen
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
              <LoginForm />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold">Fiber Tools</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <Link href="/imprint" className="hover:text-white transition-colors">Impressum</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Datenschutz</Link>
              <span>© {new Date().getFullYear()} Fiber Tools</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
