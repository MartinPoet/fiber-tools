'use client'

import type { QuarterInfo } from '@/types/atlas'
import { formatQuarter } from '@/lib/atlasParser'

interface QuarterSelectorProps {
  quarters: QuarterInfo[]
  value: string
  onChange: (value: string) => void
}

export default function QuarterSelector({
  quarters,
  value,
  onChange,
}: QuarterSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
    >
      {quarters.map((q) => (
        <option key={q.id} value={q.id}>
          {formatQuarter(q.id)}
        </option>
      ))}
    </select>
  )
}
