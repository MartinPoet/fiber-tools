'use client'

import { useState } from 'react'
import SidebarLayout from '@/components/SidebarLayout'
import AuthGuard from '@/components/AuthGuard'

interface CapexResult {
  trenchTotal: number
  baseTotal: number
  totalCapex: number
}

interface FormData {
  lengthAsphalt: number
  costAsphalt: number
  lengthBefestigt: number
  costBefestigt: number
  lengthUnbefestigt: number
  costUnbefestigt: number
  costPlanung: number
  costMaterial: number
  costDoku: number
  costOther: number
}

const DEFAULT_VALUES: FormData = {
  lengthAsphalt: 0,
  costAsphalt: 120,
  lengthBefestigt: 0,
  costBefestigt: 80,
  lengthUnbefestigt: 0,
  costUnbefestigt: 40,
  costPlanung: 3,
  costMaterial: 15,
  costDoku: 1.1,
  costOther: 0.5,
}

function InputField({
  label,
  name,
  value,
  onChange,
  unit,
}: {
  label: string
  name: keyof FormData
  value: number
  onChange: (name: keyof FormData, value: number) => void
  unit: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type="number"
          min="0"
          step="0.1"
          value={value}
          onChange={(e) => onChange(name, parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-2.5 pr-14 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
          {unit}
        </span>
      </div>
    </div>
  )
}

function ResultRow({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-3 ${highlight ? 'border-t border-slate-700 pt-4 mt-2' : ''}`}>
      <span className={highlight ? 'font-semibold text-white' : 'text-slate-400'}>{label}</span>
      <span className={highlight ? 'font-bold text-emerald-400 text-2xl' : 'font-medium text-white'}>
        {value.toLocaleString('de-AT', { style: 'currency', currency: 'EUR' })}
      </span>
    </div>
  )
}

function CapexCalculator() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_VALUES)
  const [result, setResult] = useState<CapexResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (name: keyof FormData, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const totalLength = formData.lengthAsphalt + formData.lengthBefestigt + formData.lengthUnbefestigt

  const handleCalculate = async () => {
    if (totalLength === 0) {
      setError('Bitte geben Sie mindestens eine Grabungslaenge ein')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/capex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Berechnung fehlgeschlagen')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler bei der Berechnung')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData(DEFAULT_VALUES)
    setResult(null)
    setError(null)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">CAPEX-Kalkulation</h1>
            <span className="text-xs px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 font-medium">
              Premium
            </span>
          </div>
        </div>
        <p className="text-slate-400 mt-2">
          Berechnen Sie die Investitionskosten fuer Ihr Glasfaser-Projekt mit detaillierter Kostenaufstellung.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Form - takes 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* Grabungskosten */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Grabungsarbeiten</h2>
            </div>

            <div className="space-y-6">
              {/* Asphalt */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-700">
                <InputField label="Asphalt - Laenge" name="lengthAsphalt" value={formData.lengthAsphalt} onChange={handleChange} unit="m" />
                <InputField label="Asphalt - Kosten/m" name="costAsphalt" value={formData.costAsphalt} onChange={handleChange} unit="EUR" />
              </div>

              {/* Befestigt */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-700">
                <InputField label="Befestigt - Laenge" name="lengthBefestigt" value={formData.lengthBefestigt} onChange={handleChange} unit="m" />
                <InputField label="Befestigt - Kosten/m" name="costBefestigt" value={formData.costBefestigt} onChange={handleChange} unit="EUR" />
              </div>

              {/* Unbefestigt */}
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Unbefestigt - Laenge" name="lengthUnbefestigt" value={formData.lengthUnbefestigt} onChange={handleChange} unit="m" />
                <InputField label="Unbefestigt - Kosten/m" name="costUnbefestigt" value={formData.costUnbefestigt} onChange={handleChange} unit="EUR" />
              </div>
            </div>
          </div>

          {/* Weitere Kosten */}
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Weitere Kosten (pro Meter)</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Planung" name="costPlanung" value={formData.costPlanung} onChange={handleChange} unit="EUR/m" />
              <InputField label="Material" name="costMaterial" value={formData.costMaterial} onChange={handleChange} unit="EUR/m" />
              <InputField label="Dokumentation" name="costDoku" value={formData.costDoku} onChange={handleChange} unit="EUR/m" />
              <InputField label="Sonstiges" name="costOther" value={formData.costOther} onChange={handleChange} unit="EUR/m" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              disabled={loading || totalLength === 0}
              className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Berechne...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Berechnen
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Zuruecksetzen
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Results - takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Ergebnis</h2>
            </div>

            {result ? (
              <div className="space-y-2">
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg mb-6">
                  <p className="text-sm text-slate-400 mb-1">Gesamtlaenge Trasse</p>
                  <p className="text-3xl font-bold text-white">
                    {totalLength.toLocaleString('de-AT')} <span className="text-lg text-slate-400">m</span>
                  </p>
                </div>

                <ResultRow label="Grabungskosten" value={result.trenchTotal} />
                <ResultRow label="Basiskosten" value={result.baseTotal} />
                <ResultRow label="Gesamt CAPEX" value={result.totalCapex} highlight />

                <div className="mt-6 pt-4 border-t border-slate-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Durchschnitt pro Meter</span>
                    <span className="text-slate-300 font-medium">
                      {(result.totalCapex / totalLength).toLocaleString('de-AT', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-500">
                  Geben Sie die Projektdaten ein und klicken Sie auf &quot;Berechnen&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KalkulationPage() {
  return (
    <SidebarLayout>
      <AuthGuard fallbackMessage="Die CAPEX-Kalkulation ist ein Premium-Feature. Bitte melden Sie sich an, um darauf zuzugreifen.">
        <CapexCalculator />
      </AuthGuard>
    </SidebarLayout>
  )
}
