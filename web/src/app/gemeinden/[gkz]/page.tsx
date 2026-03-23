'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SidebarLayout from '@/components/SidebarLayout'
import dynamic from 'next/dynamic'

const GemeindeMap = dynamic(() => import('@/components/GemeindeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-800 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-slate-500">Karte wird geladen...</span>
    </div>
  ),
})

interface MunicipalityData {
  GKZ: string
  Gemeindename: string
  Bundesland: string
}

interface MunicipalityDetails {
  lat: number
  lng: number
  buergermeister: string | null
  telefon: string | null
  email: string | null
  homepage: string | null
}

interface AddressStats {
  count: number
  homes: number
  sdu: number
  mdu: number
}

function StatCard({ label, value, subtext, icon }: { label: string; value: string | number; subtext?: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default function GemeindeDetailPage() {
  const params = useParams()
  const gkz = typeof params.gkz === 'string' ? params.gkz : ''

  const [municipality, setMunicipality] = useState<MunicipalityData | null>(null)
  const [details, setDetails] = useState<MunicipalityDetails | null>(null)
  const [addressStats, setAddressStats] = useState<AddressStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!gkz) return

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const munRes = await fetch(`/api/municipality?gkz=${gkz}`)
        if (!munRes.ok) {
          throw new Error('Gemeinde nicht gefunden')
        }
        const munData = await munRes.json()
        if (munData.results) {
          const found = munData.results.find((m: MunicipalityData) => m.GKZ === gkz.padStart(5, '0'))
          if (found) {
            setMunicipality(found)
          } else {
            throw new Error('Gemeinde nicht gefunden')
          }
        } else {
          setMunicipality(munData)
        }

        const detailsRes = await fetch(`/api/municipality/details?gkz=${gkz}`)
        if (detailsRes.ok) {
          const detailsData = await detailsRes.json()
          setDetails(detailsData)
        }

        const addressRes = await fetch(`/api/address?gkz=${gkz}`)
        if (addressRes.ok) {
          const addressData = await addressRes.json()
          setAddressStats(addressData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [gkz])

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 text-slate-400">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Laden...
          </div>
        </div>
      </SidebarLayout>
    )
  }

  if (error || !municipality) {
    return (
      <SidebarLayout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{error || 'Gemeinde nicht gefunden'}</h2>
          <Link href="/gemeinden" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Zurueck zur Suche
          </Link>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-slate-500">
            <li>
              <Link href="/gemeinden" className="hover:text-emerald-400 transition-colors">Gemeinden</Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-white font-medium">{municipality.Gemeindename}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{municipality.Gemeindename}</h1>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-sm">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {municipality.Bundesland}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-sm">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              GKZ {municipality.GKZ}
            </span>
          </div>
        </div>

        {/* Map */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden mb-8">
          <div className="h-80">
            <GemeindeMap
              gkz={gkz}
              center={details ? { lat: details.lat, lng: details.lng } : undefined}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Anschlusspotenzial */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Anschlusspotenzial</h2>
            </div>
            {addressStats ? (
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Adressen gesamt"
                  value={addressStats.count.toLocaleString('de-AT')}
                  icon={
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                />
                <StatCard
                  label="Homes"
                  value={addressStats.homes.toLocaleString('de-AT')}
                  subtext="Potenzielle Anschluesse"
                  icon={
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  }
                />
                <StatCard
                  label="SDU"
                  value={addressStats.sdu.toLocaleString('de-AT')}
                  subtext="Single Dwelling Units"
                />
                <StatCard
                  label="MDU"
                  value={addressStats.mdu.toLocaleString('de-AT')}
                  subtext="Multi Dwelling Units"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Keine Adressdaten verfuegbar
              </div>
            )}
          </div>

          {/* Kontaktdaten */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Kontaktdaten</h2>
            </div>
            {details && (details.buergermeister || details.telefon || details.email || details.homepage) ? (
              <div className="space-y-4">
                {details.buergermeister && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Buergermeister/in</p>
                      <p className="text-white font-medium">{details.buergermeister}</p>
                    </div>
                  </div>
                )}

                {details.telefon && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Telefon</p>
                      <a href={`tel:${details.telefon}`} className="text-emerald-400 hover:text-emerald-300 font-medium">
                        {details.telefon}
                      </a>
                    </div>
                  </div>
                )}

                {details.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">E-Mail</p>
                      <a href={`mailto:${details.email}`} className="text-emerald-400 hover:text-emerald-300 font-medium break-all">
                        {details.email}
                      </a>
                    </div>
                  </div>
                )}

                {details.homepage && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Homepage</p>
                      <a
                        href={details.homepage.startsWith('http') ? details.homepage : `https://${details.homepage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-medium break-all"
                      >
                        {details.homepage}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Keine Kontaktdaten verfuegbar
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/gemeinden"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurueck zur Gemeindesuche
          </Link>
        </div>
      </div>
    </SidebarLayout>
  )
}
