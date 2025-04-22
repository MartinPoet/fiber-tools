// web/src/app/api/municipality/details/route.ts
import { NextResponse } from 'next/server'

// JSON direkt importieren dank resolveJsonModule (Pfad: fünf Ebenen hoch)
import stats from '../../../../../data/municipalityStats.json'

/** Struktur eines Eintrags aus municipalityStats.json */
type StatRow = {
  count: number
  homes: number
  sdu: number
  mdu: number
  lat: number | null
  lng: number | null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('gkz')?.trim()
  if (!raw) {
    return NextResponse.json(
      { error: 'Bitte GKZ param übergeben' },
      { status: 400 }
    )
  }

  const gkz = raw.padStart(5, '0')

  // Typisiertes Lookup – kein any mehr
  const entry = (stats as Record<string, StatRow>)[gkz]

  if (!entry) {
    return NextResponse.json(
      { error: 'Keine Geo‑Daten für diese Gemeinde' },
      { status: 404 }
    )
  }

  if (entry.lat == null || entry.lng == null) {
    return NextResponse.json(
      { error: 'Keine Geo‑Daten für diese Gemeinde' },
      { status: 404 }
    )
  }

  return NextResponse.json({ lat: entry.lat, lng: entry.lng })
}
