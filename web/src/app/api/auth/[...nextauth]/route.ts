// web/src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

// authOptions darf hier NICHT exportiert werden
const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
// nur diese beiden Handler exportieren:
export { handler as GET, handler as POST }
