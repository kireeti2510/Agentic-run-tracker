"use client"
import React from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { listTables } from '../../lib/api'
import Link from 'next/link'
import { Table2, Database } from 'lucide-react'

const queryClient = new QueryClient()

function TablesContent() {
  const { data, error, isLoading } = useQuery({ queryKey: ['tables'], queryFn: listTables })
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (error) return <div className="text-red-600 p-4 bg-red-50 rounded-lg">Error loading tables</div>
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" />
          Database Tables
        </h2>
        <p className="text-gray-600">Browse and manage your database tables</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.map((t: string) => (
          <Link 
            key={t} 
            href={`/tables/${t}`} 
            className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Table2 className="w-6 h-6 text-blue-600" />
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors capitalize">
              {t}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Click to view records</p>
          </Link>
        ))}
      </div>
      
      {data && data.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No tables found in the database</p>
        </div>
      )}
    </div>
  )
}

export default function TablesIndex() {
  return (
    <QueryClientProvider client={queryClient}>
      <TablesContent />
    </QueryClientProvider>
  )
}
