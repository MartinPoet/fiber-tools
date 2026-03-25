'use client'

import { useState, useRef, useEffect } from 'react'
import type { AtlasMetadata, FilterRule } from '@/types/atlas'

interface FilterRulesProps {
  quarter: 'a' | 'b'
  rules: FilterRule[]
  metadata: AtlasMetadata
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, rule: FilterRule) => void
}

export default function FilterRules({
  rules,
  metadata,
  onAdd,
  onRemove,
  onUpdate,
}: FilterRulesProps) {
  return (
    <div className="mt-3">
      {rules.map((rule, idx) => (
        <RuleItem
          key={idx}
          rule={rule}
          index={idx}
          metadata={metadata}
          onRemove={() => onRemove(idx)}
          onUpdate={(r) => onUpdate(idx, r)}
        />
      ))}
      <button
        onClick={onAdd}
        className="mt-2 text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1"
      >
        <span>+</span>
        <span>Filter hinzufuegen</span>
      </button>
    </div>
  )
}

interface RuleItemProps {
  rule: FilterRule
  index: number
  metadata: AtlasMetadata
  onRemove: () => void
  onUpdate: (rule: FilterRule) => void
}

function RuleItem({ rule, metadata, onRemove, onUpdate }: RuleItemProps) {
  const toggleMode = () => {
    onUpdate({
      ...rule,
      mode: rule.mode === 'include' ? 'exclude' : 'include',
    })
  }

  const toggleProvider = (provId: number) => {
    const newProviders = new Set(rule.providers)
    if (newProviders.has(provId)) {
      newProviders.delete(provId)
    } else {
      newProviders.add(provId)
    }
    onUpdate({ ...rule, providers: newProviders })
  }

  const toggleTech = (techIdx: number) => {
    const newTechs = new Set(rule.techs)
    if (newTechs.has(techIdx)) {
      newTechs.delete(techIdx)
    } else {
      newTechs.add(techIdx)
    }
    onUpdate({ ...rule, techs: newTechs })
  }

  return (
    <div
      className={`border rounded-lg p-3 mb-2 ${
        rule.mode === 'include'
          ? 'border-green-300 bg-green-50'
          : 'border-red-300 bg-red-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={toggleMode}
          className={`text-xs font-medium px-2 py-1 rounded ${
            rule.mode === 'include'
              ? 'bg-green-200 text-green-800'
              : 'bg-red-200 text-red-800'
          }`}
        >
          {rule.mode === 'include' ? 'MUSS enthalten' : 'DARF NICHT enthalten'}
        </button>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          x
        </button>
      </div>

      {/* Provider selector */}
      <div className="mb-2">
        <label className="text-xs text-gray-600 block mb-1">Anbieter:</label>
        <ProviderMultiselect
          providers={metadata.providers}
          selected={rule.providers}
          onToggle={toggleProvider}
        />
      </div>

      {/* Tech checkboxes */}
      <div>
        <label className="text-xs text-gray-600 block mb-1">Technologie:</label>
        <div className="flex flex-wrap gap-2">
          {metadata.techs.map((tech, idx) => {
            if (tech === 'other') return null
            const color = metadata.tech_colors[tech] || '#999'
            return (
              <label
                key={idx}
                className="flex items-center gap-1 text-xs cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={rule.techs.has(idx)}
                  onChange={() => toggleTech(idx)}
                  className="rounded"
                />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>{tech}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface ProviderMultiselectProps {
  providers: string[]
  selected: Set<number>
  onToggle: (id: number) => void
}

function ProviderMultiselect({
  providers,
  selected,
  onToggle,
}: ProviderMultiselectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getLabel = () => {
    if (selected.size === 0) return 'Alle Anbieter'
    if (selected.size <= 2) {
      return [...selected].map((i) => providers[i]).join(', ')
    }
    return `${selected.size} Anbieter ausgewaehlt`
  }

  const filteredProviders = providers
    .map((name, idx) => ({ name, idx }))
    .filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()))

  const selectAll = () => {
    providers.forEach((_, idx) => {
      if (!selected.has(idx)) onToggle(idx)
    })
  }

  const selectNone = () => {
    ;[...selected].forEach((idx) => onToggle(idx))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
      >
        {getLabel()}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suchen..."
            className="w-full px-3 py-2 text-sm border-b border-gray-200"
            autoFocus
          />

          <div className="flex gap-2 p-2 border-b border-gray-200">
            <button
              onClick={selectAll}
              className="text-xs text-teal-600 hover:underline"
            >
              Alle
            </button>
            <button
              onClick={selectNone}
              className="text-xs text-teal-600 hover:underline"
            >
              Keine
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto p-2">
            {filteredProviders.map(({ name, idx }) => (
              <label
                key={idx}
                className="flex items-center gap-2 py-1 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
              >
                <input
                  type="checkbox"
                  checked={selected.has(idx)}
                  onChange={() => onToggle(idx)}
                  className="rounded"
                />
                <span className="truncate">{name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
