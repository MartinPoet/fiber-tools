// web/src/app/api/address/route.ts
import { NextResponse } from 'next/server';
// Importiere die voraggregierten Stats als JSON.
// Vier Ebenen hoch, um vom API‑Ordner in web/data zu gelangen:
import stats from '../../../../data/municipalityStats.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('gkz')?.trim();
  if (!raw) {
    return NextResponse.json(
      { error: 'Bitte GKZ als Query‑Param übergeben' },
      { status: 400 }
    );
  }

  // Einfache Normalisierung auf 5 Stellen:
  const gkz = raw.padStart(5, '0');

  // JSON‑Objekt keyed by GKZ liefert direkt die Stats
  // (count, homes, sdu, mdu)
  const s = (stats as Record<string,{
    count: number;
    homes: number;
    sdu: number;
    mdu: number;
  }>)[gkz];

  if (!s) {
    return NextResponse.json(
      { error: 'Keine Adressen für diese Gemeinde' },
      { status: 404 }
    );
  }

  // Direkt zurückgeben – kein CSV‑Parsing im Runtime!
  return NextResponse.json(s);
}
