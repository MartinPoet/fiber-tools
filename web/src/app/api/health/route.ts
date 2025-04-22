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
  } = await request.json();

  const trenchTotal =
    lengthAsphalt * costAsphalt +
    lengthBefestigt * costBefestigt +
    lengthUnbefestigt * costUnbefestigt;

  // Stub: nur Graben‑Kosten  
  return NextResponse.json({ trenchTotal });
}
