import type { AtlasMetadata, CellEntry } from '@/types/atlas'

// 20 distinct colors for provider palette
export const PROVIDER_PALETTE: [number, number, number][] = [
  [228, 26, 28],
  [55, 126, 184],
  [77, 175, 74],
  [152, 78, 163],
  [255, 127, 0],
  [255, 255, 51],
  [166, 86, 40],
  [247, 129, 191],
  [153, 153, 153],
  [0, 176, 176],
  [255, 80, 80],
  [100, 200, 100],
  [180, 120, 220],
  [255, 180, 50],
  [50, 180, 220],
  [200, 200, 60],
  [140, 100, 80],
  [220, 160, 200],
  [80, 80, 180],
  [180, 220, 100],
]

// Diff view colors
export const DIFF_COLORS = {
  upgraded: [26, 152, 80, 210] as const,    // green - tech upgraded (e.g. xDSL -> FTTH)
  newCover: [0, 150, 80, 210] as const,     // bright green - new coverage
  same: [180, 180, 180, 140] as const,      // gray - no change
  changed: [255, 165, 0, 200] as const,     // orange - providers changed, same tech
  downgraded: [215, 48, 39, 210] as const,  // red - tech downgraded
  removed: [140, 30, 30, 210] as const,     // dark red - coverage removed
}

/**
 * Convert hex color to RGB array
 */
export function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

/**
 * Get technology color from metadata
 */
export function techColor(
  techIdx: number,
  metadata: AtlasMetadata
): [number, number, number, number] {
  const name = metadata.techs[techIdx] || 'other'
  const hex = metadata.tech_colors[name] || '#999999'
  return [...hexToRgb(hex), 200]
}

/**
 * Provider color manager
 */
export class ProviderColorManager {
  private colorMap = new Map<number, number>()
  private visibleProviders: number[] = []

  /**
   * Assign colors to providers based on frequency
   */
  assignColors(provCount: Map<number, number>): void {
    // Sort providers by frequency (most common first)
    this.visibleProviders = [...provCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)

    this.colorMap = new Map()
    this.visibleProviders.forEach((id, i) => {
      this.colorMap.set(id, i % PROVIDER_PALETTE.length)
    })
  }

  /**
   * Get color for a provider
   */
  getColor(provId: number): [number, number, number, number] {
    const idx = this.colorMap.get(provId)
    if (idx === undefined) return [180, 180, 180, 200]
    return [...PROVIDER_PALETTE[idx], 210]
  }

  /**
   * Get visible providers list
   */
  getVisibleProviders(): number[] {
    return this.visibleProviders
  }

  /**
   * Get provider color map
   */
  getColorMap(): Map<number, number> {
    return this.colorMap
  }
}

/**
 * Count providers from passing cells
 */
export function countProviders(
  cellMap: Map<number, CellEntry[]>,
  passingKeys: Set<number>
): Map<number, number> {
  const provCount = new Map<number, number>()

  for (const key of passingKeys) {
    const entries = cellMap.get(key)
    if (!entries) continue
    for (const e of entries) {
      provCount.set(e.prov, (provCount.get(e.prov) || 0) + 1)
    }
  }

  return provCount
}
