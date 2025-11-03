"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { listTables, getActiveRunsCount, getProjectsCount } from '../../lib/api'
import Link from 'next/link'
import { Database, Table2, Activity, FolderKanban, ArrowRight } from 'lucide-react'

export default function DashboardContent() {
  const { data, error, isLoading } = useQuery({ queryKey: ['tables'], queryFn: () => listTables() })
  const { data: activeRunsCount, isLoading: loadingRuns } = useQuery({
    queryKey: ['activeRuns'],
    queryFn: () => getActiveRunsCount()
  })
  const { data: projectsCount, isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjectsCount()
  })

  if (error) return <div className="text-red-600 p-4 bg-red-50 rounded-lg">Error loading metadata</div>

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your Agentic Run Tracker</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Active</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Tables</h3>
          <p className="text-4xl font-bold">{isLoading ? '...' : data?.length || 0}</p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Live</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Active Runs</h3>
          <p className="text-4xl font-bold">{loadingRuns ? '...' : activeRunsCount || 0}</p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <FolderKanban className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Projects</h3>
          <p className="text-4xl font-bold">{loadingProjects ? '...' : projectsCount || 0}</p>
        </div>
      </div>

      {/* Tables Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Table2 className="w-6 h-6 text-blue-600" />
            Database Tables
          </h2>
          <Link
            href="/tables"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.slice(0, 8).map((tableName: string) => (
              <Link
                key={tableName}
                href={`/tables/${tableName}`}
                className="group bg-white p-5 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Table2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors capitalize truncate">
                  {tableName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">View records →</p>
              </Link>
            ))}

            {data && data.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tables found</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/tables"
            className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group"
          >
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Browse Tables</h3>
              <p className="text-sm text-gray-600">View all database tables</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>

          <button className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group opacity-50 cursor-not-allowed">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-600">View Runs</h3>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  )
}
