// web/src/app/api/municipality/details/route.ts

import { NextResponse } from 'next/server'

// Geo-Daten aus eurer municipalityStats.json
import stats from '../../../../../data/municipalityStats.json'
// Bürgermeister-Daten aus eurer BGM Übersicht.json
import bgmJson from '../../../../../data/BGM Übersicht.json'
// Kontakt-Infos aus eurem bgm_info_all.json
import contactJson from '../../../../../data/bgm_info_all.json'

/**
 * Ein Eintrag in den Geo-Daten:
 */
interface GeoEntry {
  lat: number
  lng: number
}

/**
 * Das gesamte Geo-Lookup-Objekt
 */
type StatsMap = Record<string, GeoEntry>

/**
 * Roh-Datensatz aus der BGM-Übersicht
 */
interface BgmRawItem {
  a2: number    // Kennzahl (GKZ)
  a5: string    // Anrede, z.B. "Herrn" oder "Frau"
  a6: string    // Amtsbezeichnung, z.B. "Bürgermeister" / "Bürgermeisterin"
  a7: string    // Vorname
  a8: string    // Nachname
}

/**
 * Struktur eures JSON-Imports für Bürgermeister
 */
interface BgmJson {
  data: BgmRawItem[]
}

/**
 * Struktur für die Kontakt-Infos
 */
interface ContactInfo {
  office_name: string
  address: string | null
  telefon: string
  fax: string | null
  email: string | null
  homepage: string | null
}

// Castet die statisch importierten JSON-Objekte auf unsere Typen
const statsMap = stats as StatsMap
const bgmData = (bgmJson as BgmJson).data
// erstes cast auf unknown, dann auf Record<string,ContactInfo>, um TS-Fehler wegen null-Werten zu umgehen
const contactMap = (contactJson as unknown) as Record<string, ContactInfo>

// Erstelle ein Lookup: GKZ (5-stellig) → BgmRawItem
const bgmMap: Record<string, BgmRawItem> = {}
for (const item of bgmData) {
  const key = item.a2.toString().padStart(5, '0')
  bgmMap[key] = item
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('gkz')?.trim()
  if (!raw) {
    return NextResponse.json({ error: 'Bitte GKZ param übergeben' }, { status: 400 })
  }
  const gkz = raw.padStart(5, '0')

  // Geo-Lookup
  const entry = statsMap[gkz]
  if (!entry || entry.lat == null || entry.lng == null) {
    return NextResponse.json(
      { error: 'Keine Geo-Daten für diese Gemeinde' },
      { status: 404 }
    )
  }

  // BGM-Lookup
  const bgm = bgmMap[gkz] ?? null
  const buergermeister = bgm
    ? `${bgm.a5} ${bgm.a7} ${bgm.a8}`
    : null

  // Kontakt-Lookup
  const contact = contactMap[gkz] ?? null
  const telefon = contact?.telefon ?? null
  const email = contact?.email ?? null
  const homepage = contact?.homepage ?? null

  return NextResponse.json(
    {
      lat: entry.lat,
      lng: entry.lng,
      buergermeister,
      telefon,
      email,
      homepage
    },
    { status: 200 }
  )
}
