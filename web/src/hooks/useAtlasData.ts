import { useState, useEffect, useCallback, useRef } from 'react'
import type {
  AtlasMetadata,
  ParsedData,
  FilterRule,
  ViewMode,
  ColorMetric,
} from '@/types/atlas'
import { parseBinary } from '@/lib/atlasParser'

const META_URL = '/atlas/metadata.json'

interface UseAtlasDataReturn {
  metadata: AtlasMetadata | null
  rawA: ParsedData | null
  rawB: ParsedData | null
  quarterA: string
  quarterB: string
  currentView: ViewMode
  selectedMetric: ColorMetric
  rulesA: FilterRule[]
  rulesB: FilterRule[]
  loading: boolean
  error: string | null
  setQuarterA: (q: string) => void
  setQuarterB: (q: string) => void
  setCurrentView: (v: ViewMode) => void
  setSelectedMetric: (m: ColorMetric) => void
  addRule: (quarter: 'a' | 'b') => void
  removeRule: (quarter: 'a' | 'b', index: number) => void
  updateRule: (quarter: 'a' | 'b', index: number, rule: FilterRule) => void
}

export function useAtlasData(): UseAtlasDataReturn {
  const [metadata, setMetadata] = useState<AtlasMetadata | null>(null)
  const [rawA, setRawA] = useState<ParsedData | null>(null)
  const [rawB, setRawB] = useState<ParsedData | null>(null)
  const [quarterA, setQuarterA] = useState<string>('')
  const [quarterB, setQuarterB] = useState<string>('')
  const [currentView, setCurrentView] = useState<ViewMode>('a')
  const [selectedMetric, setSelectedMetric] = useState<ColorMetric>('provider')
  const [rulesA, setRulesA] = useState<FilterRule[]>([])
  const [rulesB, setRulesB] = useState<FilterRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cache for binary data
  const rawCache = useRef<Record<string, ParsedData>>({})

  // Load metadata on mount
  useEffect(() => {
    async function loadMetadata() {
      try {
        const resp = await fetch(META_URL)
        const data: AtlasMetadata = await resp.json()
        setMetadata(data)

        // Set default quarters
        if (data.quarters.length > 0) {
          setQuarterA(data.quarters[0].id)
          setQuarterB(data.quarters[data.quarters.length - 1].id)
        }
      } catch (err) {
        setError('Fehler beim Laden der Metadaten')
        console.error(err)
      }
    }
    loadMetadata()
  }, [])

  // Load binary data for a quarter
  const loadBinary = useCallback(
    async (quarterId: string): Promise<ParsedData | null> => {
      if (rawCache.current[quarterId]) {
        return rawCache.current[quarterId]
      }

      if (!metadata) return null

      const qInfo = metadata.quarters.find((q) => q.id === quarterId)
      if (!qInfo) return null

      try {
        const resp = await fetch(`/atlas/${qInfo.file}`)
        const buffer = await resp.arrayBuffer()
        const parsed = parseBinary(buffer)
        rawCache.current[quarterId] = parsed
        return parsed
      } catch (err) {
        console.error('Failed to load binary data:', err)
        return null
      }
    },
    [metadata]
  )

  // Load quarters when they change
  useEffect(() => {
    if (!metadata || !quarterA || !quarterB) return

    async function loadQuarters() {
      setLoading(true)
      const [dataA, dataB] = await Promise.all([
        loadBinary(quarterA),
        loadBinary(quarterB),
      ])
      setRawA(dataA)
      setRawB(dataB)
      setLoading(false)
    }

    loadQuarters()
  }, [metadata, quarterA, quarterB, loadBinary])

  const addRule = useCallback((quarter: 'a' | 'b') => {
    const newRule: FilterRule = {
      mode: 'include',
      providers: new Set(),
      techs: new Set(),
    }
    if (quarter === 'a') {
      setRulesA((prev) => [...prev, newRule])
    } else {
      setRulesB((prev) => [...prev, newRule])
    }
  }, [])

  const removeRule = useCallback((quarter: 'a' | 'b', index: number) => {
    if (quarter === 'a') {
      setRulesA((prev) => prev.filter((_, i) => i !== index))
    } else {
      setRulesB((prev) => prev.filter((_, i) => i !== index))
    }
  }, [])

  const updateRule = useCallback(
    (quarter: 'a' | 'b', index: number, rule: FilterRule) => {
      if (quarter === 'a') {
        setRulesA((prev) => prev.map((r, i) => (i === index ? rule : r)))
      } else {
        setRulesB((prev) => prev.map((r, i) => (i === index ? rule : r)))
      }
    },
    []
  )

  return {
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
  }
}
