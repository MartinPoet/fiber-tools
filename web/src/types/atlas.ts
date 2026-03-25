// Atlas TypeScript Interfaces

export interface QuarterInfo {
  id: string
  file: string
  rows: number
  bytes: number
}

export interface AtlasMetadata {
  quarters: QuarterInfo[]
  providers: string[]
  techs: string[]
  tech_colors: Record<string, string>
  row_bytes: number
  cell_size_m: number
  crs: string
}

export interface CellEntry {
  n: number
  e: number
  prov: number
  tech: number
  dl: number
  ul: number
}

export interface ParsedData {
  rows: CellEntry[]
  cellMap: Map<number, CellEntry[]>
}

export interface CellDisplayValue {
  maxDl: number
  maxUl: number
  bestTech: number
  nProviders: number
}

export interface FilterRule {
  mode: 'include' | 'exclude'
  providers: Set<number>
  techs: Set<number>
}

export type ViewMode = 'a' | 'b' | 'diff'
export type ColorMetric = 'provider' | 'tech'

export type ChangeType = 'upgraded' | 'downgraded' | 'changed' | 'same' | 'new' | 'removed'

export interface SingleViewCell {
  polygon: [number, number][]
  color: number[]
  maxDl: number
  maxUl: number
  bestTech: number
  nProviders: number
  entries: CellEntry[]
}

export interface DiffViewCell {
  polygon: [number, number][]
  color: number[]
  changeType: ChangeType
  valA: CellDisplayValue
  valB: CellDisplayValue
  entriesA: CellEntry[]
  entriesB: CellEntry[]
  type: 'both' | 'new' | 'removed'
}

export type LayerCell = SingleViewCell | DiffViewCell

export interface AtlasState {
  metadata: AtlasMetadata | null
  rawA: ParsedData | null
  rawB: ParsedData | null
  quarterA: string
  quarterB: string
  currentView: ViewMode
  selectedMetric: ColorMetric
  rulesA: FilterRule[]
  rulesB: FilterRule[]
  selectedCellPolygon: [number, number][] | null
  loading: boolean
}
