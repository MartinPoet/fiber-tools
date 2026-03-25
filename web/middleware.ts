// web/middleware.ts
// Note: Firebase Auth is handled client-side via AuthContext
// This middleware is kept minimal - route protection is done in components

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Pass through all requests
  // Client-side auth check is handled by components
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/atlas/:path*',
  ],
}
