'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { MapboxOverlay } from '@deck.gl/mapbox'
import { SolidPolygonLayer, PathLayer } from '@deck.gl/layers'
import type {
  AtlasMetadata,
  ParsedData,
  FilterRule,
  ViewMode,
  ColorMetric,
  SingleViewCell,
  DiffViewCell,
  CellEntry,
} from '@/types/atlas'
import {
  applyFilters,
  getCellDisplayValue,
  keyToPolygon,
  getDominantProvider,
  formatQuarter,
} from '@/lib/atlasParser'
import {
  techColor,
  DIFF_COLORS,
  ProviderColorManager,
  countProviders,
} from '@/lib/atlasColors'
import 'maplibre-gl/dist/maplibre-gl.css'

const BASEMAP_URL =
  'https://mapsneu.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png'

interface AtlasMapProps {
  metadata: AtlasMetadata
  rawA: ParsedData | null
  rawB: ParsedData | null
  quarterA: string
  quarterB: string
  currentView: ViewMode
  selectedMetric: ColorMetric
  rulesA: FilterRule[]
  rulesB: FilterRule[]
  selectedCellPolygon: [number, number][] | null
  onCellClick: (cell: SingleViewCell | DiffViewCell | null) => void
  onStatsUpdate: (passA: Set<number>, passB: Set<number>) => void
  providerColorManager: ProviderColorManager
}

export default function AtlasMap({
  metadata,
  rawA,
  rawB,
  quarterA,
  quarterB,
  currentView,
  selectedMetric,
  rulesA,
  rulesB,
  selectedCellPolygon,
  onCellClick,
  onStatsUpdate,
  providerColorManager,
}: AtlasMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const deckOverlay = useRef<MapboxOverlay | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          basemap: {
            type: 'raster',
            tiles: [BASEMAP_URL],
            tileSize: 256,
            attribution: '&copy; <a href="https://basemap.at">basemap.at</a>',
          },
        },
        layers: [{ id: 'basemap', type: 'raster', source: 'basemap' }],
      },
      center: [13.35, 47.7],
      zoom: 7,
      maxZoom: 16,
      minZoom: 6,
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.current.on('load', () => {
      deckOverlay.current = new MapboxOverlay({
        layers: [],
      })
      map.current?.addControl(deckOverlay.current as unknown as maplibregl.IControl)
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Build layer data
  const buildSingleViewData = useCallback(
    (
      cellMap: Map<number, CellEntry[]>,
      passingKeys: Set<number>
    ): SingleViewCell[] => {
      const result: SingleViewCell[] = []

      // Count providers and assign colors
      const provCount = countProviders(cellMap, passingKeys)
      providerColorManager.assignColors(provCount)

      for (const key of passingKeys) {
        const entries = cellMap.get(key)
        if (!entries) continue
        const val = getCellDisplayValue(entries)
        const polygon = keyToPolygon(key)

        let color: number[]
        if (selectedMetric === 'tech') {
          color = techColor(val.bestTech, metadata)
        } else {
          const dominantProv = getDominantProvider(entries)
          color = providerColorManager.getColor(dominantProv)
        }

        result.push({ polygon, color, ...val, entries })
      }

      return result
    },
    [metadata, selectedMetric, providerColorManager]
  )

  const buildDiffViewData = useCallback(
    (
      cellMapA: Map<number, CellEntry[]>,
      passA: Set<number>,
      cellMapB: Map<number, CellEntry[]>,
      passB: Set<number>
    ): DiffViewCell[] => {
      const result: DiffViewCell[] = []

      // Only show cells that pass both filters (intersection)
      for (const key of passA) {
        if (!passB.has(key)) continue

        const entriesA = cellMapA.get(key)
        const entriesB = cellMapB.get(key)
        if (!entriesA || !entriesB) continue

        const valA = getCellDisplayValue(entriesA)
        const valB = getCellDisplayValue(entriesB)
        const polygon = keyToPolygon(key)

        // Determine change type
        const techChanged = valA.bestTech !== valB.bestTech
        const provsA = new Set(entriesA.map((e) => e.prov))
        const provsB = new Set(entriesB.map((e) => e.prov))
        const provsChanged =
          provsA.size !== provsB.size || [...provsA].some((p) => !provsB.has(p))

        let color: readonly number[]
        let changeType: DiffViewCell['changeType']

        if (techChanged && valB.bestTech < valA.bestTech) {
          color = DIFF_COLORS.upgraded
          changeType = 'upgraded'
        } else if (techChanged && valB.bestTech > valA.bestTech) {
          color = DIFF_COLORS.downgraded
          changeType = 'downgraded'
        } else if (provsChanged) {
          color = DIFF_COLORS.changed
          changeType = 'changed'
        } else {
          color = DIFF_COLORS.same
          changeType = 'same'
        }

        result.push({
          polygon,
          color: [...color],
          changeType,
          valA,
          valB,
          entriesA,
          entriesB,
          type: 'both',
        })
      }

      return result
    },
    []
  )

  // Memoized layer data
  const { layerData, passA, passB } = useMemo(() => {
    if (!rawA || !rawB) {
      return { layerData: [], passA: new Set<number>(), passB: new Set<number>() }
    }

    const passASet = applyFilters(rawA.cellMap, rulesA)
    const passBSet = applyFilters(rawB.cellMap, rulesB)

    let data: (SingleViewCell | DiffViewCell)[]
    if (currentView === 'a') {
      data = buildSingleViewData(rawA.cellMap, passASet)
    } else if (currentView === 'b') {
      data = buildSingleViewData(rawB.cellMap, passBSet)
    } else {
      data = buildDiffViewData(rawA.cellMap, passASet, rawB.cellMap, passBSet)
    }

    return { layerData: data, passA: passASet, passB: passBSet }
  }, [rawA, rawB, rulesA, rulesB, currentView, buildSingleViewData, buildDiffViewData])

  // Update stats
  useEffect(() => {
    onStatsUpdate(passA, passB)
  }, [passA, passB, onStatsUpdate])

  // Handle click
  const handleClick = useCallback(
    (info: { object?: SingleViewCell | DiffViewCell }) => {
      if (info.object) {
        onCellClick(info.object)
      }
    },
    [onCellClick]
  )

  // Get tooltip
  const getTooltip = useCallback(
    ({ object }: { object?: SingleViewCell | DiffViewCell }) => {
      if (!object) return null

      const style = 'font-size:12px;line-height:1.4;min-width:200px'

      const formatEntryList = (entries: CellEntry[]) => {
        const sorted = [...entries].sort(
          (a, b) =>
            a.tech - b.tech ||
            metadata.providers[a.prov].localeCompare(metadata.providers[b.prov])
        )
        return `<table style="border-collapse:collapse;width:100%;margin:2px 0 4px 0">${sorted
          .map((e) => {
            const techName = metadata.techs[e.tech] || '?'
            const color = metadata.tech_colors[techName] || '#999'
            return `<tr>
            <td style="padding:1px 6px 1px 0;font-weight:600">${metadata.providers[e.prov]}</td>
            <td style="padding:1px 6px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color}"></span> ${techName}</td>
        </tr>`
          })
          .join('')}</table>`
      }

      if ('changeType' in object) {
        const changeLabels: Record<string, [string, string]> = {
          upgraded: ['Technik aufgewertet', '#1a9850'],
          downgraded: ['Technik abgewertet', '#c0392b'],
          changed: ['Anbieter veraendert', '#e67e22'],
          same: ['Unveraendert', '#999'],
          new: ['Neue Versorgung', '#27ae60'],
          removed: ['Versorgung entfallen', '#8b1e1e'],
        }
        const [changeLabel, changeColor] = changeLabels[object.changeType] || [
          '?',
          '#666',
        ]

        let html = `<div style="${style}">`
        html += `<div style="font-weight:700;color:${changeColor};margin-bottom:6px">${changeLabel}</div>`

        if (object.type === 'both') {
          html += `<div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px">Vorher - ${formatQuarter(quarterA)}</div>`
          html += formatEntryList(object.entriesA)
          html += `<div style="text-align:center;font-size:16px;color:#888;margin:4px 0">▼</div>`
          html += `<div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px">Nachher - ${formatQuarter(quarterB)}</div>`
          html += formatEntryList(object.entriesB)
        }

        html += `</div>`
        return { html }
      }

      // Single quarter view
      const q = currentView === 'a' ? quarterA : quarterB
      let html = `<div style="${style}">`
      html += `<div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px">${formatQuarter(q)} - ${object.nProviders} Anbieter</div>`
      html += formatEntryList(object.entries)
      html += `</div>`
      return { html }
    },
    [metadata, quarterA, quarterB, currentView]
  )

  // Update deck layers
  useEffect(() => {
    if (!deckOverlay.current) return

    const cellLayer = new SolidPolygonLayer<SingleViewCell | DiffViewCell>({
      id: 'cells',
      data: layerData,
      getPolygon: (d) => d.polygon,
      getFillColor: (d) => d.color as [number, number, number, number],
      pickable: true,
      opacity: 0.85,
      extruded: false,
      onClick: handleClick,
      updateTriggers: {
        getFillColor: [currentView, selectedMetric, quarterA, quarterB],
      },
    })

    const layers: (SolidPolygonLayer<SingleViewCell | DiffViewCell> | PathLayer<{ path: [number, number][] }>)[] = [cellLayer]

    if (selectedCellPolygon) {
      const ring = [...selectedCellPolygon, selectedCellPolygon[0]]
      layers.push(
        new PathLayer<{ path: [number, number][] }>({
          id: 'cell-highlight',
          data: [{ path: ring }],
          getPath: (d) => d.path,
          getColor: [255, 255, 255, 255],
          getWidth: 3,
          widthUnits: 'pixels',
        })
      )
    }

    deckOverlay.current.setProps({ layers, getTooltip })
  }, [
    layerData,
    selectedCellPolygon,
    currentView,
    selectedMetric,
    quarterA,
    quarterB,
    handleClick,
    getTooltip,
  ])

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    />
  )
}
