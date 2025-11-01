"use client"
import React from 'react'
import { Sun, Moon } from 'lucide-react'

export default function Topbar({ onToggleDark }: { onToggleDark?: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex-1">
        <h1 className="text-lg md:text-xl font-semibold">Agentic Run Tracker</h1>
        <p className="text-xs md:text-sm text-gray-500">Dashboard Overview</p>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onToggleDark}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          <Sun className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  )
}
