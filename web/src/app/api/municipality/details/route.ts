// web/src/app/api/municipality/details/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('gkz')?.trim();
  if (!raw) {
    return NextResponse.json({ error: 'Bitte GKZ param übergeben' }, { status: 400 });
  }
  const gkz = raw.padStart(5, '0');

  // CSV einlesen
  const csvPath = path.join(process.cwd(), 'data', 'nexiga.csv');
  const text = fs.readFileSync(csvPath, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  // Header parsen
  const headers = lines.shift()!.split(';').map(h => h.replace(/^\uFEFF/, '').trim());
  const idxG = headers.indexOf('GEMNR');
  const idxX = headers.indexOf('X_WGS84');
  const idxY = headers.indexOf('Y_WGS84');
  if (idxG < 0 || idxX < 0 || idxY < 0) {
    return NextResponse.json({ error: 'CSV-Header unvollständig' }, { status: 500 });
  }

  let sumLat = 0, sumLng = 0, count = 0;
  for (const line of lines) {
    const cols = line.split(';');
    const gem = cols[idxG].trim().padStart(5, '0');
    if (gem === gkz) {
      const x = parseFloat(cols[idxX].replace(',', '.'));
      const y = parseFloat(cols[idxY].replace(',', '.'));
      if (!isNaN(x) && !isNaN(y)) {
        sumLng += x;
        sumLat += y;
        count++;
      }
    }
  }
  if (count === 0) {
    return NextResponse.json({ error: 'Keine Geo-Daten für diese Gemeinde' }, { status: 404 });
  }

  return NextResponse.json({
    lat: sumLat / count,
    lng: sumLng / count,
  });
}
