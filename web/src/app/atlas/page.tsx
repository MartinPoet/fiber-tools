'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import SidebarLayout from '@/components/SidebarLayout'
import { useAtlasData } from '@/hooks/useAtlasData'
import { AtlasSidebar, AtlasDetailPanel, AtlasLegend } from '@/components/atlas'
import { ProviderColorManager } from '@/lib/atlasColors'
import type { SingleViewCell, DiffViewCell } from '@/types/atlas'

// Dynamic import for AtlasMap to avoid SSR issues with MapLibre
const AtlasMap = dynamic(() => import('@/components/atlas/AtlasMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-gray-500">Karte wird geladen...</div>
    </div>
  ),
})

export default function AtlasPage() {
  const {
    metadata,
    rawA,
    rawB,
    quarterA,
    quarterB,
    currentView,
    selectedMetric,
    rulesA,
    rulesB,
    loading,
    error,
    setQuarterA,
    setQuarterB,
    setCurrentView,
    setSelectedMetric,
    addRule,
    removeRule,
    updateRule,
  } = useAtlasData()

  const [selectedCell, setSelectedCell] = useState<
    SingleViewCell | DiffViewCell | null
  >(null)
  const [selectedCellPolygon, setSelectedCellPolygon] = useState<
    [number, number][] | null
  >(null)
  const [stats, setStats] = useState({ passA: 0, passB: 0, intersection: 0 })

  const providerColorManager = useMemo(() => new ProviderColorManager(), [])

  const handleCellClick = useCallback(
    (cell: SingleViewCell | DiffViewCell | null) => {
      setSelectedCell(cell)
      setSelectedCellPolygon(cell?.polygon || null)
    },
    []
  )

  const handleCloseDetail = useCallback(() => {
    setSelectedCell(null)
    setSelectedCellPolygon(null)
  }, [])

  const handleStatsUpdate = useCallback(
    (passA: Set<number>, passB: Set<number>) => {
      let intersection = 0
      for (const key of passA) {
        if (passB.has(key)) intersection++
      }
      setStats({
        passA: passA.size,
        passB: passB.size,
        intersection,
      })
    },
    []
  )

  if (error) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">{error}</div>
        </div>
      </SidebarLayout>
    )
  }

  if (!metadata || loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-500">Laden...</div>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <div className="flex h-full -m-6">
        {/* Left Sidebar */}
        <AtlasSidebar
          metadata={metadata}
          quarterA={quarterA}
          quarterB={quarterB}
          currentView={currentView}
          selectedMetric={selectedMetric}
          rulesA={rulesA}
          rulesB={rulesB}
          onQuarterAChange={setQuarterA}
          onQuarterBChange={setQuarterB}
          onViewChange={setCurrentView}
          onMetricChange={setSelectedMetric}
          onAddRule={addRule}
          onRemoveRule={removeRule}
          onUpdateRule={updateRule}
          statsA={stats.passA}
          statsB={stats.passB}
          intersection={stats.intersection}
        />

        {/* Map */}
        <div className="flex-1 relative">
          {rawA && rawB && (
            <>
              <AtlasMap
                metadata={metadata}
                rawA={rawA}
                rawB={rawB}
                quarterA={quarterA}
                quarterB={quarterB}
                currentView={currentView}
                selectedMetric={selectedMetric}
                rulesA={rulesA}
                rulesB={rulesB}
                selectedCellPolygon={selectedCellPolygon}
                onCellClick={handleCellClick}
                onStatsUpdate={handleStatsUpdate}
                providerColorManager={providerColorManager}
              />
              <AtlasLegend
                metadata={metadata}
                currentView={currentView}
                selectedMetric={selectedMetric}
                providerColorManager={providerColorManager}
              />
            </>
          )}
        </div>

        {/* Right Detail Panel */}
        {selectedCell && (
          <AtlasDetailPanel
            cell={selectedCell}
            metadata={metadata}
            quarterA={quarterA}
            quarterB={quarterB}
            currentView={currentView}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </SidebarLayout>
  )
}
