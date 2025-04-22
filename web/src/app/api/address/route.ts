// web/src/app/api/address/route.ts
import { NextResponse } from 'next/server';
import { loadAddresses, Address } from './utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('gkz')?.trim();
  if (!raw) {
    return NextResponse.json(
      { error: 'Bitte GKZ als Query‑Param übergeben' },
      { status: 400 }
    );
  }

  const gkz = raw.padStart(5, '0');
  const all: Address[] = loadAddresses().filter(addr => addr.GEMNR === gkz);

  const count = all.length;
  let homes = 0;
  let sdu = 0;
  let mdu = 0;

  all.forEach(addr => {
    const hh = Number(addr.HH) || 0;
    const fa = Number(addr.ANZFA) || 0;
    const addressHomes = hh + fa;
    homes += addressHomes;

    if (addressHomes > 2) mdu += 1;
    else sdu += 1;
  });

  if (count === 0) {
    return NextResponse.json(
      { error: 'Keine Adressen für diese Gemeinde' },
      { status: 404 }
    );
  }

  return NextResponse.json({ count, homes, sdu, mdu });
}
