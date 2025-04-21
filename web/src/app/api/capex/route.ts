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

  return NextResponse.json({ trenchTotal });
}

// Optional: GET‑Fallback, damit `/api/capex` im Browser nicht 404 wirft
export async function GET() {
  return NextResponse.json({ message: 'Bitte per POST mit JSON‑Body aufrufen' });
}
