'use client'

import { useState } from 'react'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function SqlQueryPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState<string[]>([])

    // Example queries for quick access
    const exampleQueries = [
        {
            name: 'Count Agents per Project',
            query: 'SELECT ProjectID, count_agents_in_project(ProjectID) AS agent_count FROM Project;'
        },
        {
            name: 'Get Runs by Agent (Agent ID: 1)',
            query: 'CALL GetRunsByAgent(1);'
        },
        {
            name: 'Get Run Metrics (Run ID: 1)',
            query: 'CALL GetRunMetrics(1);'
        },
        {
            name: 'Get Artifacts for Run (Run ID: 1)',
            query: 'CALL GetArtifactsForRun(1);'
        },
        {
            name: 'All Users',
            query: 'SELECT * FROM User;'
        },
        {
            name: 'Recent Runs',
            query: 'SELECT RunID, AgentID, Status, time FROM Run ORDER BY time DESC LIMIT 10;'
        }
    ]

    const executeQuery = async () => {
        if (!query.trim()) {
            toast.error('Please enter a query')
            return
        }

        setLoading(true)
        setResults(null)

        try {
            const response = await fetch(`${API_URL}/api/query/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || 'Query execution failed')
                setResults({ error: data.error, details: data.details })
                return
            }

            setResults(data)
            toast.success('Query executed successfully!')

            // Add to history (keep last 10)
            setHistory(prev => {
                const newHistory = [query, ...prev.filter(q => q !== query)]
                return newHistory.slice(0, 10)
            })
        } catch (err: any) {
            toast.error('Failed to execute query')
            setResults({ error: err.message })
        } finally {
            setLoading(false)
        }
    }

    const loadExample = (exampleQuery: string) => {
        setQuery(exampleQuery)
        setResults(null)
    }

    const loadFromHistory = (historicalQuery: string) => {
        setQuery(historicalQuery)
        setResults(null)
    }

    const clearResults = () => {
        setResults(null)
        setQuery('')
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">SQL Query Executor</h1>
                <p className="text-gray-600">Execute custom SQL queries, functions, and procedures</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Query Area */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Query Input */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <label className="block text-sm font-medium mb-2">SQL Query</label>
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your SQL query here... (e.g., SELECT * FROM User;)"
                            className="w-full h-40 p-3 border rounded-lg font-mono text-sm"
                            disabled={loading}
                        />
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={executeQuery}
                                disabled={loading || !query.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Executing...' : 'Execute Query'}
                            </button>
                            <button
                                onClick={clearResults}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Results Area */}
                    {results && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="text-xl font-semibold mb-3">Results</h2>

                            {results.error ? (
                                <div className="bg-red-50 border border-red-200 rounded p-4">
                                    <p className="text-red-800 font-medium">Error:</p>
                                    <p className="text-red-600 mt-1">{results.error}</p>
                                    {results.details && (
                                        <p className="text-red-500 text-sm mt-2">Details: {results.details}</p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-4 mb-3 text-sm">
                                        <span className="text-gray-600">
                                            Type: <span className="font-medium">{results.queryType}</span>
                                        </span>
                                        {results.rowCount !== undefined && (
                                            <span className="text-gray-600">
                                                Rows: <span className="font-medium">{results.rowCount}</span>
                                            </span>
                                        )}
                                        {results.affectedRows !== undefined && (
                                            <span className="text-gray-600">
                                                Affected: <span className="font-medium">{results.affectedRows}</span>
                                            </span>
                                        )}
                                    </div>

                                    {results.data && Array.isArray(results.data) && results.data.length > 0 ? (
                                        <div className="overflow-auto max-h-96 border rounded">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        {Object.keys(results.data[0]).map((key) => (
                                                            <th
                                                                key={key}
                                                                className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                                            >
                                                                {key}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {results.data.map((row: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            {Object.values(row).map((val: any, cellIdx: number) => (
                                                                <td key={cellIdx} className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                                                                    {val === null ? (
                                                                        <span className="text-gray-400 italic">null</span>
                                                                    ) : typeof val === 'object' ? (
                                                                        JSON.stringify(val)
                                                                    ) : (
                                                                        String(val)
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : results.affectedRows !== undefined ? (
                                        <div className="bg-green-50 border border-green-200 rounded p-4">
                                            <p className="text-green-800">
                                                Query executed successfully. {results.affectedRows} row(s) affected.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                            <p className="text-blue-800">Query executed successfully with no results.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar with Examples and History */}
                <div className="space-y-4">
                    {/* Example Queries */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-3">Example Queries</h3>
                        <div className="space-y-2">
                            {exampleQueries.map((example, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => loadExample(example.query)}
                                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200"
                                >
                                    {example.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Query History */}
                    {history.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3">Query History</h3>
                            <div className="space-y-2 max-h-60 overflow-auto">
                                {history.map((historicalQuery, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => loadFromHistory(historicalQuery)}
                                        className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 font-mono truncate"
                                        title={historicalQuery}
                                    >
                                        {historicalQuery}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
