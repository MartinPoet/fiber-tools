'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function LandingPage() {
  const { data: session } = useSession()
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto p-6 md:p-12">
        <div className="w-full md:w-1/2 mt-8 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            FTTH Tools
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-700">
            Kostenfreie und kostenpflichtige Tools für effizienten Glasfaserausbau in Österreich.
          </p>
          {/* Conditional Login/Logout Button */}
          {session ? (
            <button
              onClick={() => signOut()}
              className="inline-block mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
            >
              Abmelden
            </button>
          ) : (
            <button
              onClick={() => signIn('github')}
              className="inline-block mt-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700"
            >
              Einloggen
            </button>
          )}
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          {/* Placeholder for hero image */}
          <div className="bg-teal-100 w-80 h-80 rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold text-center">Unsere Tools</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'CAPEX Kalkulation', href: '/capex' },
              { title: 'Restaurationsrichtlinien', href: '/restoration' },
              { title: 'Gemeinde-Analyse', href: '/municipality' },
              { title: 'Konkurrenz-Analyse', href: '/competitors' },
            ].map(feature => (
              <Link
                key={feature.title}
                href={feature.href}
                className="block p-6 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-600">Mehr erfahren</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h4 className="font-semibold">FTTH Tools</h4>
            <p className="mt-2 text-sm">© {new Date().getFullYear()} FTTH Tools. Alle Rechte vorbehalten.</p>
          </div>
          <div className="space-x-4">
            <Link href="/imprint" className="text-sm hover:underline">Impressum</Link>
            <Link href="/privacy" className="text-sm hover:underline">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
