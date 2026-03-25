'use client'

import type { AtlasMetadata, FilterRule, ViewMode, ColorMetric } from '@/types/atlas'
import { formatQuarter } from '@/lib/atlasParser'
import QuarterSelector from './QuarterSelector'
import FilterRules from './FilterRules'
import ViewModeToggle from './ViewModeToggle'

interface AtlasSidebarProps {
  metadata: AtlasMetadata
  quarterA: string
  quarterB: string
  currentView: ViewMode
  selectedMetric: ColorMetric
  rulesA: FilterRule[]
  rulesB: FilterRule[]
  onQuarterAChange: (q: string) => void
  onQuarterBChange: (q: string) => void
  onViewChange: (v: ViewMode) => void
  onMetricChange: (m: ColorMetric) => void
  onAddRule: (quarter: 'a' | 'b') => void
  onRemoveRule: (quarter: 'a' | 'b', index: number) => void
  onUpdateRule: (quarter: 'a' | 'b', index: number, rule: FilterRule) => void
  statsA: number
  statsB: number
  intersection: number
}

export default function AtlasSidebar({
  metadata,
  quarterA,
  quarterB,
  currentView,
  selectedMetric,
  rulesA,
  rulesB,
  onQuarterAChange,
  onQuarterBChange,
  onViewChange,
  onMetricChange,
  onAddRule,
  onRemoveRule,
  onUpdateRule,
  statsA,
  statsB,
  intersection,
}: AtlasSidebarProps) {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">BB-Atlas</h1>
        <p className="text-sm text-gray-500">Breitband Festnetz Vergleich</p>
      </div>

      {/* View Mode */}
      <div className="p-4 border-b border-gray-200">
        <ViewModeToggle currentView={currentView} onChange={onViewChange} />
      </div>

      {/* Quarter A */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Quartal A</span>
          <span className="text-xs text-gray-500">{formatQuarter(quarterA)}</span>
        </div>
        <QuarterSelector
          quarters={metadata.quarters}
          value={quarterA}
          onChange={onQuarterAChange}
        />
        <FilterRules
          quarter="a"
          rules={rulesA}
          metadata={metadata}
          onAdd={() => onAddRule('a')}
          onRemove={(idx) => onRemoveRule('a', idx)}
          onUpdate={(idx, rule) => onUpdateRule('a', idx, rule)}
        />
      </div>

      {/* Quarter B */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Quartal B</span>
          <span className="text-xs text-gray-500">{formatQuarter(quarterB)}</span>
        </div>
        <QuarterSelector
          quarters={metadata.quarters}
          value={quarterB}
          onChange={onQuarterBChange}
        />
        <FilterRules
          quarter="b"
          rules={rulesB}
          metadata={metadata}
          onAdd={() => onAddRule('b')}
          onRemove={(idx) => onRemoveRule('b', idx)}
          onUpdate={(idx, rule) => onUpdateRule('b', idx, rule)}
        />
      </div>

      {/* Color Mode */}
      <div className="p-4 border-b border-gray-200">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Farbmodus
        </label>
        <select
          value={selectedMetric}
          onChange={(e) => onMetricChange(e.target.value as ColorMetric)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="provider">Nach Anbieter</option>
          <option value="tech">Nach Technologie</option>
        </select>
      </div>

      {/* Stats */}
      <div className="p-4 flex-grow">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Statistiken</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Zellen Filter A</span>
            <span className="font-medium">{statsA.toLocaleString('de')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Zellen Filter B</span>
            <span className="font-medium">{statsB.toLocaleString('de')}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-500">Schnittmenge (Diff)</span>
            <span className="font-medium">{intersection.toLocaleString('de')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
