import proj4 from 'proj4'
import type { CellEntry, ParsedData, CellDisplayValue, FilterRule } from '@/types/atlas'

// Define EPSG:3035 projection
proj4.defs(
  'EPSG:3035',
  '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs'
)

const toWGS84 = proj4('EPSG:3035', 'EPSG:4326')

/**
 * Parse binary data into structured cell map.
 * Binary format: 11 bytes per row
 * - uint16 N (2 bytes)
 * - uint16 E (2 bytes)
 * - uint16 provider (2 bytes)
 * - uint8 tech (1 byte)
 * - uint16 dl*10 (2 bytes)
 * - uint16 ul*10 (2 bytes)
 */
export function parseBinary(buffer: ArrayBuffer): ParsedData {
  const view = new DataView(buffer)
  const rowCount = buffer.byteLength / 11
  const rows: CellEntry[] = new Array(rowCount)

  for (let i = 0; i < rowCount; i++) {
    const off = i * 11
    rows[i] = {
      n: view.getUint16(off, true),
      e: view.getUint16(off + 2, true),
      prov: view.getUint16(off + 4, true),
      tech: view.getUint8(off + 6),
      dl: view.getUint16(off + 7, true) / 10,
      ul: view.getUint16(off + 9, true) / 10,
    }
  }

  // Group by cell
  const cellMap = new Map<number, CellEntry[]>()
  for (const row of rows) {
    const key = (row.n << 16) | row.e // pack into single int for speed
    let arr = cellMap.get(key)
    if (!arr) {
      arr = []
      cellMap.set(key, arr)
    }
    arr.push(row)
  }

  return { rows, cellMap }
}

/**
 * Apply filter rules to a cellMap.
 * Returns Set of cell keys that pass ALL rules.
 */
export function applyFilters(
  cellMap: Map<number, CellEntry[]>,
  rules: FilterRule[]
): Set<number> {
  if (rules.length === 0) {
    return new Set(cellMap.keys())
  }

  let passingCells: Set<number> | null = null

  for (const rule of rules) {
    const matching = new Set<number>()

    for (const [key, entries] of cellMap) {
      const hasMatch = entries.some((e) => {
        const provMatch = rule.providers.size === 0 || rule.providers.has(e.prov)
        const techMatch = rule.techs.size === 0 || rule.techs.has(e.tech)
        return provMatch && techMatch
      })

      if (rule.mode === 'include' && hasMatch) {
        matching.add(key)
      } else if (rule.mode === 'exclude' && !hasMatch) {
        matching.add(key)
      }
    }

    // Intersect with previous rules
    if (passingCells === null) {
      passingCells = matching
    } else {
      for (const k of passingCells) {
        if (!matching.has(k)) passingCells.delete(k)
      }
    }
  }

  return passingCells || new Set()
}

/**
 * Get the "display value" for a cell (after filtering).
 * Returns the best entry per cell for display purposes.
 */
export function getCellDisplayValue(entries: CellEntry[]): CellDisplayValue {
  let maxDl = 0
  let maxUl = 0
  let bestTech = 99
  const provs = new Set<number>()

  for (const e of entries) {
    if (e.dl > maxDl) maxDl = e.dl
    if (e.ul > maxUl) maxUl = e.ul
    if (e.tech < bestTech) bestTech = e.tech
    provs.add(e.prov)
  }

  return { maxDl, maxUl, bestTech, nProviders: provs.size }
}

/**
 * Convert cell key back to N, E coordinates
 */
export function keyToNE(key: number): { n: number; e: number } {
  const n = (key >> 16) & 0xffff
  const e = key & 0xffff
  return { n, e }
}

/**
 * Convert cell key to center point in WGS84
 */
export function keyToCoords(key: number): [number, number] {
  const { n, e } = keyToNE(key)
  const x3035 = e * 100 + 50
  const y3035 = n * 100 + 50
  return toWGS84.forward([x3035, y3035]) as [number, number]
}

/**
 * Convert cell key to polygon corners in WGS84
 */
export function keyToPolygon(key: number): [number, number][] {
  const { n, e } = keyToNE(key)
  const x0 = e * 100
  const y0 = n * 100
  return [
    toWGS84.forward([x0, y0]) as [number, number],
    toWGS84.forward([x0 + 100, y0]) as [number, number],
    toWGS84.forward([x0 + 100, y0 + 100]) as [number, number],
    toWGS84.forward([x0, y0 + 100]) as [number, number],
  ]
}

/**
 * Get dominant provider from entries (one with best technology)
 */
export function getDominantProvider(entries: CellEntry[]): number {
  let best = entries[0]
  for (const e of entries) {
    if (e.tech < best.tech) best = e
  }
  return best.prov
}

/**
 * Format quarter ID to readable string
 */
export function formatQuarter(q: string): string {
  const m = q.match(/(\d{4})q(\d)/)
  return m ? `Q${m[2]} ${m[1]}` : q
}
