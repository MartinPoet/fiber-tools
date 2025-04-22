// web/middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/', // Umgeleitet wird auf deine Landing‑Page
  },
})

// Hier legst du fest, welche Routen geschützt sind:
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/capex/:path*',
    '/restoration/:path*',
    '/municipality/:path*',
    '/competitors/:path*',
  ],
}
