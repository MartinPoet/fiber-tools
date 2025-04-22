'use client'

import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';

interface Municipality {
  GKZ: string;
  Gemeindename: string;
  Bundesland: string;
  [key: string]: any;
}

export default function MunicipalityPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Municipality | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/municipality?gkz=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`Fehler: ${res.status}`);
      const data: Municipality = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <h1 className="text-2xl font-bold mb-4">Gemeinde‑Suche</h1>
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="GKZ oder Name eingeben"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border px-3 py-2 rounded flex-grow"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? 'Suche…' : 'Suchen'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {result && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">{result.Gemeindename}</h2>
          <table className="w-full table-auto">
            <tbody>
              <tr>
                <th className="text-left p-1">GKZ</th>
                <td className="p-1">{result.GKZ}</td>
              </tr>
              <tr>
                <th className="text-left p-1">Bundesland</th>
                <td className="p-1">{result.Bundesland}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </SidebarLayout>
  );
}
