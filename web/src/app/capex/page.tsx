'use client';

import { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';

export default function CapexPage() {
  const [lengthAsphalt, setLengthAsphalt] = useState(0);
  const [costAsphalt, setCostAsphalt]     = useState(15);  // Default €/m
  const [lengthBefestigt, setLengthBefestigt] = useState(0);
  const [costBefestigt, setCostBefestigt]     = useState(12);
  const [lengthUnbefestigt, setLengthUnbefestigt] = useState(0);
  const [costUnbefestigt, setCostUnbefestigt]     = useState(8);

  const [trenchTotal, setTrenchTotal] = useState<number|null>(null);
  const [loading, setLoading]         = useState(false);

  const calculate = async () => {
    setLoading(true);
    const res = await fetch('/api/capex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lengthAsphalt,
        costAsphalt,
        lengthBefestigt,
        costBefestigt,
        lengthUnbefestigt,
        costUnbefestigt,
      }),
    });
    const { trenchTotal } = await res.json();
    setTrenchTotal(trenchTotal);
    setLoading(false);
  };

  return (
    <SidebarLayout>
      <h1 className="text-2xl font-bold mb-4">CAPEX Rechner</h1>
      <div className="space-y-4">
        {/* Kategorie: Asphalt */}
        <div className="flex items-center space-x-2">
          <label className="w-32">Asphalt (m):</label>
          <input
            type="number"
            value={lengthAsphalt}
            onChange={e => setLengthAsphalt(+e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
          <span>×</span>
          <input
            type="number"
            value={costAsphalt}
            onChange={e => setCostAsphalt(+e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
          <span>€/m</span>
        </div>
        {/* Kategorie: Befestigt */}
        <div className="flex items-center space-x-2">
          <label className="w-32">Befestigt (m):</label>
          <input
            type="number"
            value={lengthBefestigt}
            onChange={e => setLengthBefestigt(+e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
          <span>×</span>
          <input
            type="number"
            value={costBefestigt}
            onChange={e => setCostBefestigt(+e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
          <span>€/m</span>
        </div>
        {/* Kategorie: Unbefestigt */}
        <div className="flex items-center space-x-2">
          <label className="w-32">Unbef. (m):</label>
          <input
            type="number"
            value={lengthUnbefestigt}
            onChange={e => setLengthUnbefestigt(+e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
          <span>×</span>
          <input
            type="number"
            value={costUnbefestigt}
            onChange={e => setCostUnbefestigt(+e.target.value)}
            className="border px-2 py-1 rounded w-20"
          />
          <span>€/m</span>
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={loading}
        className="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
      >
        {loading ? 'Berechne…' : 'Berechnen'}
      </button>

      {trenchTotal !== null && (
        <p className="mt-4 text-lg">
          Geschätzte Graben‑Kosten: <strong>€{trenchTotal.toLocaleString()}</strong>
        </p>
      )}
    </SidebarLayout>
  );
}
