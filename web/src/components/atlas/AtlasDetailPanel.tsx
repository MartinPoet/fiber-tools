'use client'

import type { AtlasMetadata, SingleViewCell, DiffViewCell, CellEntry } from '@/types/atlas'
import { formatQuarter } from '@/lib/atlasParser'

interface AtlasDetailPanelProps {
  cell: SingleViewCell | DiffViewCell
  metadata: AtlasMetadata
  quarterA: string
  quarterB: string
  currentView: 'a' | 'b' | 'diff'
  onClose: () => void
}

export default function AtlasDetailPanel({
  cell,
  metadata,
  quarterA,
  quarterB,
  currentView,
  onClose,
}: AtlasDetailPanelProps) {
  const isDiff = 'changeType' in cell

  const changeLabels: Record<string, { label: string; color: string }> = {
    upgraded: { label: 'Technik aufgewertet', color: '#1a9850' },
    downgraded: { label: 'Technik abgewertet', color: '#c0392b' },
    changed: { label: 'Anbieter veraendert', color: '#e67e22' },
    same: { label: 'Unveraendert', color: '#999' },
    new: { label: 'Neue Versorgung', color: '#27ae60' },
    removed: { label: 'Versorgung entfallen', color: '#8b1e1e' },
  }

  const renderEntryTable = (entries: CellEntry[]) => {
    const sorted = [...entries].sort(
      (a, b) =>
        a.tech - b.tech ||
        metadata.providers[a.prov].localeCompare(metadata.providers[b.prov])
    )

    return (
      <table className="w-full text-sm">
        <tbody>
          {sorted.map((e, idx) => {
            const techName = metadata.techs[e.tech] || '?'
            const color = metadata.tech_colors[techName] || '#999'
            return (
              <tr key={idx} className="border-b border-gray-100 last:border-0">
                <td className="py-2 font-medium">{metadata.providers[e.prov]}</td>
                <td className="py-2">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {techName}
                  </span>
                </td>
                <td className="py-2 text-right text-gray-500">
                  {e.dl} / {e.ul} Mbit/s
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Zellen-Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          x
        </button>
      </div>

      <div className="p-4">
        {isDiff && (cell as DiffViewCell).type === 'both' ? (
          <>
            {/* Change type badge */}
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
              style={{
                backgroundColor:
                  changeLabels[(cell as DiffViewCell).changeType]?.color + '20',
                color: changeLabels[(cell as DiffViewCell).changeType]?.color,
              }}
            >
              {changeLabels[(cell as DiffViewCell).changeType]?.label}
            </div>

            {/* Before */}
            <div className="mb-4">
              <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Vorher - {formatQuarter(quarterA)}
              </h3>
              {renderEntryTable((cell as DiffViewCell).entriesA)}
            </div>

            {/* Arrow */}
            <div className="text-center text-gray-400 text-2xl mb-4">▼</div>

            {/* After */}
            <div>
              <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Nachher - {formatQuarter(quarterB)}
              </h3>
              {renderEntryTable((cell as DiffViewCell).entriesB)}
            </div>
          </>
        ) : (
          <>
            {/* Single view */}
            <div className="mb-2">
              <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                {formatQuarter(currentView === 'a' ? quarterA : quarterB)} -{' '}
                {(cell as SingleViewCell).nProviders} Anbieter
              </h3>
              {renderEntryTable((cell as SingleViewCell).entries)}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Max Download</span>
                  <span className="font-medium">
                    {(cell as SingleViewCell).maxDl} Mbit/s
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Max Upload</span>
                  <span className="font-medium">
                    {(cell as SingleViewCell).maxUl} Mbit/s
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
