// web/src/app/api/municipality/geo/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const raw = searchParams.get('gkz')?.trim()
  if (!raw) {
    return NextResponse.json({ error: 'GKZ fehlt' }, { status: 400 })
  }

  const gkz = raw.padStart(5, '0')
  const file = path.join(process.cwd(), 'data', 'geom', `${gkz}.json`)
  try {
    const geojson = fs.readFileSync(file, 'utf8')
    return new NextResponse(geojson, {
      headers: { 'Content-Type': 'application/geo+json' },
    })
  } catch {
    return NextResponse.json({ error: 'Grenze nicht gefunden' }, { status: 404 })
  }
}
