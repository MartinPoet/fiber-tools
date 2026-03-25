'use client'

import type { AtlasMetadata, ViewMode, ColorMetric } from '@/types/atlas'
import { DIFF_COLORS, PROVIDER_PALETTE, ProviderColorManager } from '@/lib/atlasColors'

interface AtlasLegendProps {
  metadata: AtlasMetadata
  currentView: ViewMode
  selectedMetric: ColorMetric
  providerColorManager: ProviderColorManager
}

export default function AtlasLegend({
  metadata,
  currentView,
  selectedMetric,
  providerColorManager,
}: AtlasLegendProps) {
  if (currentView === 'diff') {
    const items = [
      { color: DIFF_COLORS.upgraded, label: 'Technik aufgewertet' },
      { color: DIFF_COLORS.changed, label: 'Anbieter veraendert' },
      { color: DIFF_COLORS.same, label: 'Unveraendert' },
      { color: DIFF_COLORS.downgraded, label: 'Technik abgewertet' },
    ]

    return (
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Legende
        </h4>
        <div className="space-y-1">
          {items.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`,
                }}
              />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (selectedMetric === 'tech') {
    return (
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Technologie
        </h4>
        <div className="space-y-1">
          {Object.entries(metadata.tech_colors).map(([tech, color]) => (
            <div key={tech} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Provider legend
  const visibleProviders = providerColorManager.getVisibleProviders()
  const colorMap = providerColorManager.getColorMap()
  const showProvs = visibleProviders.slice(0, 12)

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10 max-w-xs">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Anbieter
      </h4>
      <div className="space-y-1">
        {showProvs.map((provId) => {
          const palIdx = colorMap.get(provId)
          if (palIdx === undefined) return null
          const c = PROVIDER_PALETTE[palIdx]
          const name = metadata.providers[provId]
          return (
            <div key={provId} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: `rgb(${c[0]}, ${c[1]}, ${c[2]})` }}
              />
              <span className="text-sm text-gray-700 truncate">{name}</span>
            </div>
          )
        })}
        {visibleProviders.length > 12 && (
          <div className="text-xs text-gray-500 pt-1">
            + {visibleProviders.length - 12} weitere
          </div>
        )}
        {visibleProviders.length === 0 && (
          <div className="text-sm text-gray-500">Keine Anbieter sichtbar</div>
        )}
      </div>
    </div>
  )
}
