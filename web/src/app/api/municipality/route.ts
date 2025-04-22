// web/src/app/api/municipality/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mapping erste Ziffer → Bundesland
const BL: Record<string,string> = {
  '1': 'Burgenland',
  '2': 'Kärnten',
  '3': 'Niederösterreich',
  '4': 'Oberösterreich',
  '5': 'Salzburg',
  '6': 'Steiermark',
  '7': 'Tirol',
  '8': 'Vorarlberg',
  '9': 'Wien',
};

// Pfad zur CSV in deinem Projekt
const csvPath = path.join(process.cwd(), 'data', 'municipalities.csv');

// CSV einlesen, BOM entfernen, in Objekte transformieren
function loadMunicipalities() {
  const text = fs.readFileSync(csvPath, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  // Header mit BOM‑Strip und trim
  const rawHeaders = lines.shift()!.split(';');
  const headers = rawHeaders.map(h => h.replace(/^\uFEFF/, '').trim());

  return lines.map(line => {
    const cols = line.split(';');
    const obj: Record<string,string> = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i]?.trim() ?? '';
    });

    // Normiere: padStart, Bundesland, sprechende Keys
    const gkz = obj['GKZ'].padStart(5, '0');
    const name = obj['Zeilenbeschriftungen'];
    const land = BL[gkz.charAt(0)] || 'unbekannt';

    return {
      GKZ: gkz,
      Gemeindename: name,
      Bundesland: land,
      // Falls Du später mehr Spalten brauchst, füge sie hier hinzu:
      // ...obj
    };
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const qRaw = searchParams.get('gkz')?.trim().toLowerCase() || '';
  if (!qRaw) {
    return NextResponse.json(
      { error: 'Bitte GKZ oder Name als Query‑Parameter mitgeben' },
      { status: 400 }
    );
  }

  const list = loadMunicipalities();
  // 1) exakte GKZ‑Suche
  const qGkz = qRaw.padStart(5, '0');
  let matches = list.filter(rec => rec.GKZ.toLowerCase() === qGkz);

  // 2) falls leer, Namens‑Suche
  if (matches.length === 0) {
    matches = list.filter(rec =>
      rec.Gemeindename.toLowerCase().includes(qRaw)
    );
  }

  if (matches.length === 0) {
    return NextResponse.json({ error: 'Gemeinde nicht gefunden' }, { status: 404 });
  }
  // 3) Mehrfach‑Treffer
  if (matches.length > 1) {
    return NextResponse.json({ results: matches });
  }
  // Einzelfund
  return NextResponse.json(matches[0]);
}
