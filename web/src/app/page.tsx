import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      {/* Logo oben */}
      <div className="mb-8">
        <Image 
          src="/logo.png" 
          alt="FTTH Tools Logo" 
          width={120} 
          height={120} 
        />
      </div>

      {/* Untertitel */}
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Deine Plattform für Glasfaser‑Planungstools. Bald live mit CAPEX‑Kalkulator, Gemeinde‑Analyse & mehr!
      </p>

      {/* E‑Mail‑Form */}
      <form className="flex flex-col items-center space-y-3 w-full max-w-sm">
        <input
          type="email"
          placeholder="Deine E‑Mail für Updates" 
          className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          type="submit"
          className="w-full rounded bg-teal-500 px-4 py-2 text-white font-medium hover:bg-teal-600"
        >
          Informieren Sie mich
        </button>
      </form>
    </main>
  )
}
