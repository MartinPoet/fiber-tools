'use client'

import type { ViewMode } from '@/types/atlas'

interface ViewModeToggleProps {
  currentView: ViewMode
  onChange: (view: ViewMode) => void
}

export default function ViewModeToggle({
  currentView,
  onChange,
}: ViewModeToggleProps) {
  const buttons: { value: ViewMode; label: string }[] = [
    { value: 'a', label: 'Quartal A' },
    { value: 'b', label: 'Quartal B' },
    { value: 'diff', label: 'Differenz' },
  ]

  return (
    <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => onChange(btn.value)}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            currentView === btn.value
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-300'
          }`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}
