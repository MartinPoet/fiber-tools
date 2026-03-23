'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import SidebarLayout from '@/components/SidebarLayout'

interface Municipality {
  GKZ: string
  Gemeindename: string
  Bundesland: string
}

const BUNDESLAENDER = [
  'Alle',
  'Burgenland',
  'Kaernten',
  'Niederoesterreich',
  'Oberoesterreich',
  'Salzburg',
  'Steiermark',
  'Tirol',
  'Vorarlberg',
  'Wien',
]

const BL_MAP: Record<string, string> = {
  'Kaernten': 'Kärnten',
  'Niederoesterreich': 'Niederösterreich',
  'Oberoesterreich': 'Oberösterreich',
}

export default function GemeindenPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBundesland, setSelectedBundesland] = useState('Alle')
  const [results, setResults] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError('Bitte geben Sie einen Suchbegriff ein (Name oder GKZ)')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const res = await fetch(`/api/municipality?gkz=${encodeURIComponent(searchTerm.trim())}`)
      const data = await res.json()

      if (!res.ok) {
        setResults([])
        setError(data.error || 'Keine Ergebnisse gefunden')
        return
      }

      let municipalities: Municipality[] = []
      if (data.results) {
        municipalities = data.results
      } else if (data.GKZ) {
        municipalities = [data]
      }

      if (selectedBundesland !== 'Alle') {
        const blFilter = BL_MAP[selectedBundesland] || selectedBundesland
        municipalities = municipalities.filter(m => m.Bundesland === blFilter)
      }

      setResults(municipalities)
      if (municipalities.length === 0) {
        setError('Keine Ergebnisse fuer die gewaehlten Filter gefunden')
      }
    } catch (err) {
      setError('Fehler bei der Suche')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedBundesland])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gemeindeanalyse</h1>
          <p className="text-slate-400">
            Suchen Sie nach Gemeinden und erhalten Sie detaillierte Informationen zu Statistiken, Kontaktdaten und Anschlusspotenzial.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-slate-300 mb-2">
                Gemeinde suchen
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Name oder GKZ eingeben..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>

            <div className="md:w-48">
              <label htmlFor="bundesland" className="block text-sm font-medium text-slate-300 mb-2">
                Bundesland
              </label>
              <select
                id="bundesland"
                value={selectedBundesland}
                onChange={(e) => setSelectedBundesland(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              >
                {BUNDESLAENDER.map((bl) => (
                  <option key={bl} value={bl}>{bl}</option>
                ))}
              </select>
            </div>

            <div className="md:self-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Suche...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Suchen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && hasSearched && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">
              {results.length} Ergebnis{results.length !== 1 ? 'se' : ''} gefunden
            </p>

            <div className="grid gap-3">
              {results.map((municipality) => (
                <Link
                  key={municipality.GKZ}
                  href={`/gemeinden/${municipality.GKZ}`}
                  className="group block bg-slate-800 border border-slate-700 p-4 rounded-xl hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {municipality.Gemeindename}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {municipality.Bundesland} | GKZ: {municipality.GKZ}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Gemeinde suchen</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Geben Sie einen Gemeindenamen oder eine GKZ ein, um detaillierte Informationen zu erhalten.
            </p>
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}
