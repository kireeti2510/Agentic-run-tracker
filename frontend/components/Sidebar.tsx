"use client"
import React from 'react'
import Link from 'next/link'
import { Home, Table2, Settings } from 'lucide-react'

interface SidebarProps {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg md:text-xl font-bold mb-6 mt-2 md:mt-0">Agentic</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/" 
              onClick={onNavigate}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/tables" 
              onClick={onNavigate}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Table2 size={20} />
              <span>Tables</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/settings" 
              onClick={onNavigate}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
