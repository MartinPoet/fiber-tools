'use client';

import React, { Fragment, useState } from 'react';
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
  const [costDoku, setCostDoku]               = useState(1.1);
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
        costDoku,
        costOther,
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <SidebarLayout>
      <h1 className="text-3xl font-semibold mb-8">CAPEX Rechner</h1>

      {/* Grid mit 2 Spalten */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Graben‑Kosten Card (als Tailwind‑Div) */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-4">Graben‑Kosten</h2>
          <div className="grid grid-cols-4 gap-x-4 gap-y-6 items-center">
            {[
              { label: 'Asphalt', length: lengthAsphalt, setLength: setLengthAsphalt, cost: costAsphalt, setCost: setCostAsphalt },
              { label: 'Befestigt', length: lengthBefestigt, setLength: setLengthBefestigt, cost: costBefestigt, setCost: setCostBefestigt },
              { label: 'Unbef.', length: lengthUnbefestigt, setLength: setLengthUnbefestigt, cost: costUnbefestigt, setCost: setCostUnbefestigt },
            ].map(({ label, length, setLength, cost, setCost }) => (
              <Fragment key={label}>
                <label className="text-right">{label} (m):</label>
                <input
                  type="number"
                  value={length}
                  onChange={e => setLength(+e.target.value)}
                  className="border px-2 py-1 rounded w-24"
                />
                <span className="text-center">×</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={cost}
                    onChange={e => setCost(+e.target.value)}
                    className="border px-2 py-1 rounded w-24"
                  />
                  <span>€/m</span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Basiskosten Card */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-4">Basiskosten</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Planung', cost: costPlanung, setCost: setCostPlanung },
              { label: 'Material', cost: costMaterial, setCost: setCostMaterial },
              { label: 'Doku', cost: costDoku, setCost: setCostDoku },
              { label: 'Other', cost: costOther, setCost: setCostOther },
            ].map(({ label, cost, setCost }) => (
              <div key={label} className="flex flex-col">
                <label className="mb-1">{label} (€/m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={cost}
                  onChange={e => setCost(+e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ergebnis-Panel */}
      {result && (
        <div className="mt-8 p-6 border-l-4 border-teal-500 bg-teal-50 rounded">
          <p>Graben‑Kosten: €{result.trenchTotal.toLocaleString()}</p>
          <p>Basiskosten: €{result.baseTotal.toLocaleString()}</p>
          <p className="mt-2 text-2xl font-bold">Gesamt CAPEX: €{result.totalCapex.toLocaleString()}</p>
        </div>
      )}

      {/* Sticky Button */}
      <div className="mt-8 sticky bottom-0 bg-white p-4 text-right">
        <button
          onClick={calculate}
          disabled={loading}
          className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
        >
          {loading ? 'Berechne…' : 'Berechnen'}
        </button>
      </div>
    </SidebarLayout>
  );
}