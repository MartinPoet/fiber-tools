// web/src/app/api/capex/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const {
    lengthAsphalt,
    costAsphalt,
    lengthBefestigt,
    costBefestigt,
    lengthUnbefestigt,
    costUnbefestigt,

    // Neue Parameter
    costPlanung = 3,     // €/m
    costMaterial = 15,   // €/m
    costDukt = 1.1,      // €/m
    costOther = 0.5,     // €/m
  } = await request.json();

  // Graben‑Kosten
  const trenchTotal =
    lengthAsphalt * costAsphalt +
    lengthBefestigt * costBefestigt +
    lengthUnbefestigt * costUnbefestigt;

  // Gesamtlänge aller Trassen
  const totalLength =
    lengthAsphalt + lengthBefestigt + lengthUnbefestigt;

  // Basiskosten (Planung, Material, Dukt, Sonstiges)
  const baseTotal =
    totalLength * costPlanung +
    totalLength * costMaterial +
    totalLength * costDukt +
    totalLength * costOther;

  // Endsumme
  const totalCapex = trenchTotal + baseTotal;

  return NextResponse.json({ trenchTotal, baseTotal, totalCapex });
}

export async function GET() {
  return NextResponse.json({ message: 'Bitte per POST mit JSON‑Body aufrufen' });
}
