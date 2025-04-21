'use client';

import { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';

export default function CapexPage() {
  // Längen
  const [lengthAsphalt, setLengthAsphalt]     = useState(0);
  const [lengthBefestigt, setLengthBefestigt] = useState(0);
  const [lengthUnbefestigt, setLengthUnbefestigt] = useState(0);
  // Graben‑Kosten
  const [costAsphalt, setCostAsphalt]         = useState(120);
  const [costBefestigt, setCostBefestigt]     = useState(100);
  const [costUnbefestigt, setCostUnbefestigt] = useState(50);
  // Basiskosten
  const [costPlanung, setCostPlanung]         = useState(3);
  const [costMaterial, setCostMaterial]       = useState(15);
  const [costDukt, setCostDukt]               = useState(1.1);
  const [costOther, setCostOther]             = useState(0.5);

  const [result, setResult] = useState<{
    trenchTotal: number;
    baseTotal: number;
    totalCapex: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

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
        costPlanung,
        costMaterial,
        costDukt,
        costOther,
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <SidebarLayout>
      <h1 className="text-2xl font-bold mb-4">CAPEX Rechner</h1>

      <div className="space-y-4">
        {/* Graben-Kategorien */}
        {[
          { label: 'Asphalt', length: lengthAsphalt, setLength: setLengthAsphalt, cost: costAsphalt, setCost: setCostAsphalt },
          { label: 'Befestigt', length: lengthBefestigt, setLength: setLengthBefestigt, cost: costBefestigt, setCost: setCostBefestigt },
          { label: 'Unbef.', length: lengthUnbefestigt, setLength: setLengthUnbefestigt, cost: costUnbefestigt, setCost: setCostUnbefestigt },
        ].map(({ label, length, setLength, cost, setCost }) => (
          <div key={label} className="flex items-center space-x-2">
            <label className="w-32">{label} (m):</label>
            <input
              type="number"
              value={length}
              onChange={e => setLength(+e.target.value)}
              className="border px-2 py-1 rounded w-20"
            />
            <span>×</span>
            <input
              type="number"
              value={cost}
              onChange={e => setCost(+e.target.value)}
              className="border px-2 py-1 rounded w-20"
            />
            <span>€/m</span>
          </div>
        ))}

        {/* Basiskosten */}
        {[
          { label: 'Planung', cost: costPlanung, setCost: setCostPlanung },
          { label: 'Material', cost: costMaterial, setCost: setCostMaterial },
          { label: 'Dukt', cost: costDukt, setCost: setCostDukt },
          { label: 'Other', cost: costOther, setCost: setCostOther },
        ].map(({ label, cost, setCost }) => (
          <div key={label} className="flex items-center space-x-2">
            <label className="w-32">{label} (€/m):</label>
            <input
              type="number"
              step="0.1"
              value={cost}
              onChange={e => setCost(+e.target.value)}
              className="border px-2 py-1 rounded w-20"
            />
          </div>
        ))}
      </div>

      <button
        onClick={calculate}
        disabled={loading}
        className="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
      >
        {loading ? 'Berechne…' : 'Berechnen'}
      </button>

      {result && (
        <div className="mt-6 space-y-2">
          <p>Graben‑Kosten: €{result.trenchTotal.toLocaleString()}</p>
          <p>Basiskosten: €{result.baseTotal.toLocaleString()}</p>
          <p className="font-bold">Gesamt CAPEX: €{result.totalCapex.toLocaleString()}</p>
        </div>
      )}
    </SidebarLayout>
  );
}
