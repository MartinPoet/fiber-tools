// web/src/app/api/municipality/details/route.ts

import { NextResponse } from 'next/server'

// Geo-Daten aus eurer municipalityStats.json
import stats from '../../../../../data/municipalityStats.json'
// Bürgermeister-Daten aus eurer BGM Übersicht.json
import bgmJson from '../../../../../data/BGM Übersicht.json'
// Office-Daten (Telefon, E-Mail, Homepage) aus eurem bgm_info_all.json
import officeData from '../../../../../data/bgm_info_all.json'

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
 * Ein Eintrag in euren zusätzlichen Office-Daten
 */
interface OfficeEntry {
  office_name?: string | null
  address?: string | null
  telefon?: string | null
  fax?: string | null
  email?: string | null
  homepage?: string | null
}

// Castet die statisch importierten JSON-Objekte auf unsere Typen
const statsMap = stats as StatsMap
const bgmData = (bgmJson as BgmJson).data

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

  // BGM-Lookup (Bürgermeister)
  const bgm = bgmMap[gkz] ?? null
  const buergermeister = bgm
    ? `${bgm.a5} ${bgm.a7} ${bgm.a8}`
    : null

  // Office-Lookup (Telefon, E-Mail, Homepage)
  const office: OfficeEntry = officeData[gkz] ?? {}
  const telefon = office.telefon ?? null
  const fax = office.fax ?? null
  const email = office.email ?? null
  const homepage = office.homepage ?? null

  return NextResponse.json(
    {
      lat: entry.lat,
      lng: entry.lng,
      buergermeister,
      telefon,
      fax,
      email,
      homepage
    },
    { status: 200 }
  )
}
