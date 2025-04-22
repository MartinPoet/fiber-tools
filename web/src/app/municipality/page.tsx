'use client'

import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';

interface Municipality {
  GKZ: string;
  Gemeindename: string;
  Bundesland: string;
}

export default function MunicipalityPage() {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<Municipality | Municipality[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/municipality?gkz=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Fehler: ${res.status}`);
      }
      const data = await res.json() as Municipality | { results: Municipality[] };
      if ('results' in data) {
        setResult(data.results);
      } else {
        setResult(data);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unbekannter Fehler';
      setError(message);
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
        Array.isArray(result) ? (
          <div className="space-y-4">
            {result.map(item => (
              <div key={item.GKZ} className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-2">{item.Gemeindename}</h2>
                <p>GKZ: {item.GKZ}</p>
                <p>Bundesland: {item.Bundesland}</p>
              </div>
            ))}
          </div>
        ) : (
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
        )
      )}
    </SidebarLayout>
  );
}
