// web/src/app/api/municipality/details/route.ts
import { NextResponse } from 'next/server'

// Geo-Daten aus eurer municipalityStats.json
import stats from '../../../../../data/municipalityStats.json'
// Bürgermeister-Daten aus eurer BGM Übersicht.json
import bgmJson from '../../../../../data/BGM Übersicht.json'

interface BgmItem {
  a2: number      // Kennzahl (GKZ)
  a6: string      // Titel, z.B. "Herrn" oder "Frau"
  a7: string      // Vorname
  a8: string      // Nachname
}

// Erstelle ein Lookup-Objekt: GKZ (5-stellig) → BgmItem
const bgmMap: Record<string, BgmItem> = {}
;(bgmJson.data as BgmItem[]).forEach(item => {
  const key = String(item.a2).padStart(5, '0')
  bgmMap[key] = item
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('gkz')?.trim()
  if (!raw) {
    return NextResponse.json({ error: 'Bitte GKZ param übergeben' }, { status: 400 })
  }
  const gkz = raw.padStart(5, '0')

  // Geo-Lookup
  const entry = (stats as Record<string, any>)[gkz]
  if (!entry || entry.lat == null || entry.lng == null) {
    return NextResponse.json({ error: 'Keine Geo-Daten für diese Gemeinde' }, { status: 404 })
  }

  // BGM-Lookup
  const bgm = bgmMap[gkz] || null
  const buergermeister = bgm
    ? `${bgm.a6} ${bgm.a7} ${bgm.a8}`
    : null

  return NextResponse.json(
    { lat: entry.lat, lng: entry.lng, buergermeister },
    { status: 200 }
  )
}
