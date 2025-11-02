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
        // Basic Queries
        {
            category: 'Basic',
            name: 'All Users',
            query: 'SELECT * FROM User;'
        },
        {
            category: 'Basic',
            name: 'Recent Runs',
            query: 'SELECT RunID, AgentID, Status, time FROM Run ORDER BY time DESC LIMIT 10;'
        },

        // Functions & Procedures
        {
            category: 'Functions',
            name: 'Count Agents per Project',
            query: 'SELECT ProjectID, count_agents_in_project(ProjectID) AS agent_count FROM Project;'
        },
        {
            category: 'Procedures',
            name: 'Get Runs by Agent (Agent ID: 1)',
            query: 'CALL GetRunsByAgent(1);'
        },
        {
            category: 'Procedures',
            name: 'Get Run Metrics (Run ID: 1)',
            query: 'CALL GetRunMetrics(1);'
        },
        {
            category: 'Procedures',
            name: 'Get Artifacts for Run (Run ID: 1)',
            query: 'CALL GetArtifactsForRun(1);'
        },
        {
            category: 'Procedures',
            name: 'Get Project Summary (Project ID: 1)',
            query: 'CALL GetProjectSummary(1);'
        },
        {
            category: 'Procedures',
            name: 'Get Agent Performance (Agent ID: 1)',
            query: 'CALL GetAgentPerformance(1);'
        },
        {
            category: 'Procedures',
            name: 'Get Top Performing Agents (Top 5)',
            query: 'CALL GetTopPerformingAgents(5);'
        },

        // JOIN Queries
        {
            category: 'JOIN',
            name: 'Projects with User Info',
            query: 'SELECT p.ProjectID, p.name AS ProjectName, p.status, CONCAT(u.Fname, " ", u.Lname) AS Owner, u.Email FROM Project p INNER JOIN User u ON p.userID = u.userID;'
        },
        {
            category: 'JOIN',
            name: 'Runs with Agent & Project Details',
            query: 'SELECT r.RunID, r.Status, r.time, a.name AS AgentName, a.model, p.name AS ProjectName FROM Run r INNER JOIN Agent a ON r.AgentID = a.AgentID INNER JOIN Project p ON a.ProjectID = p.ProjectID ORDER BY r.time DESC LIMIT 10;'
        },
        {
            category: 'JOIN',
            name: 'Agents with Run Count',
            query: 'SELECT a.AgentID, a.name AS AgentName, a.version, a.model, COUNT(r.RunID) AS TotalRuns FROM Agent a LEFT JOIN Run r ON a.AgentID = r.AgentID GROUP BY a.AgentID, a.name, a.version, a.model;'
        },
        {
            category: 'JOIN',
            name: 'Run Steps with Run Status',
            query: 'SELECT rs.RunID, r.Status AS RunStatus, rs.Step_No, rs.Name AS StepName, rs.Status AS StepStatus, rs.Step_Type FROM RunStep rs INNER JOIN Run r ON rs.RunID = r.RunID ORDER BY rs.RunID, rs.Step_No;'
        },

        // Aggregate Queries
        {
            category: 'Aggregate',
            name: 'Run Status Summary',
            query: 'SELECT Status, COUNT(*) AS Count FROM Run GROUP BY Status ORDER BY Count DESC;'
        },
        {
            category: 'Aggregate',
            name: 'Average Metrics by Run',
            query: 'SELECT RunID, AVG(Value_Numeric) AS AvgValue, COUNT(*) AS MetricCount FROM RunMetric WHERE Value_Numeric IS NOT NULL GROUP BY RunID HAVING AVG(Value_Numeric) > 0;'
        },
        {
            category: 'Aggregate',
            name: 'Project Run Statistics',
            query: 'SELECT p.ProjectID, p.name AS ProjectName, COUNT(DISTINCT a.AgentID) AS TotalAgents, COUNT(r.RunID) AS TotalRuns, SUM(CASE WHEN r.Status = "succeeded" THEN 1 ELSE 0 END) AS SuccessfulRuns FROM Project p LEFT JOIN Agent a ON p.ProjectID = a.ProjectID LEFT JOIN Run r ON a.AgentID = r.AgentID GROUP BY p.ProjectID, p.name;'
        },
        {
            category: 'Aggregate',
            name: 'Dataset Types Distribution',
            query: 'SELECT type, COUNT(*) AS Count FROM Dataset GROUP BY type ORDER BY Count DESC;'
        },

        // Nested/Subquery Examples
        {
            category: 'Nested',
            name: 'Projects with Most Agents',
            query: 'SELECT ProjectID, name, (SELECT COUNT(*) FROM Agent WHERE Agent.ProjectID = Project.ProjectID) AS AgentCount FROM Project ORDER BY AgentCount DESC;'
        },
        {
            category: 'Nested',
            name: 'Runs with Above-Average Latency',
            query: 'SELECT r.RunID, r.Status, (SELECT AVG(Value_Numeric) FROM RunMetric rm WHERE rm.RunID = r.RunID AND rm.Name = "latency_ms") AS Run_Latency FROM Run r WHERE (SELECT AVG(Value_Numeric) FROM RunMetric rm WHERE rm.Name = "latency_ms") < (SELECT AVG(Value_Numeric) FROM RunMetric rm WHERE rm.RunID = r.RunID AND rm.Name = "latency_ms");'
        },
        {
            category: 'Nested',
            name: 'Agents with Highest Success Rate',
            query: 'SELECT AgentID, name, (SELECT COUNT(*) FROM Run WHERE Run.AgentID = Agent.AgentID AND Status = "succeeded") AS SuccessCount, (SELECT COUNT(*) FROM Run WHERE Run.AgentID = Agent.AgentID) AS TotalRuns FROM Agent HAVING TotalRuns > 0 ORDER BY SuccessCount DESC;'
        },

        // Complex Queries
        {
            category: 'Complex',
            name: 'Runs with Incomplete Finalize Steps',
            query: 'SELECT r.RunID, r.Status, (SELECT COUNT(*) FROM RunStep rs WHERE rs.RunID = r.RunID AND rs.Step_Type = "finalize" AND rs.Status = "ok") AS Completed_Finalize_Steps, (SELECT COUNT(*) FROM RunStep rs WHERE rs.RunID = r.RunID) AS Total_Steps FROM Run r WHERE (SELECT COUNT(*) FROM RunStep rs WHERE rs.RunID = r.RunID AND rs.Step_Type = "finalize" AND rs.Status = "ok") < (SELECT COUNT(*) FROM RunStep rs WHERE rs.RunID = r.RunID);'
        },
        {
            category: 'Complex',
            name: 'Projects with No Runs',
            query: 'SELECT p.ProjectID, p.name FROM Project p WHERE NOT EXISTS (SELECT 1 FROM Agent a JOIN Run r ON a.AgentID = r.AgentID WHERE a.ProjectID = p.ProjectID);'
        },
        {
            category: 'Complex',
            name: 'Run Timeline Analysis',
            query: 'SELECT r.RunID, r.Status, COUNT(rs.Step_No) AS TotalSteps, SUM(CASE WHEN rs.Status = "ok" THEN 1 ELSE 0 END) AS CompletedSteps, SUM(CASE WHEN rs.Status = "error" THEN 1 ELSE 0 END) AS FailedSteps, SUM(CASE WHEN rs.Status = "pending" THEN 1 ELSE 0 END) AS PendingSteps FROM Run r LEFT JOIN RunStep rs ON r.RunID = rs.RunID GROUP BY r.RunID, r.Status ORDER BY r.time DESC;'
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
                    <div className="bg-white rounded-lg shadow p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <h3 className="font-semibold mb-3 sticky top-0 bg-white pb-2">Example Queries</h3>
                        <div className="space-y-4">
                            {['Basic', 'Functions', 'Procedures', 'JOIN', 'Aggregate', 'Nested', 'Complex'].map(category => {
                                const categoryQueries = exampleQueries.filter(q => q.category === category)
                                if (categoryQueries.length === 0) return null

                                return (
                                    <div key={category}>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                            {category === 'JOIN' && '🔗'}
                                            {category === 'Aggregate' && '📊'}
                                            {category === 'Nested' && '🔍'}
                                            {category === 'Complex' && '⚙️'}
                                            {category === 'Functions' && '🔧'}
                                            {category === 'Procedures' && '📋'}
                                            {category === 'Basic' && '📝'}
                                            {category}
                                        </h4>
                                        <div className="space-y-2">
                                            {categoryQueries.map((example, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => loadExample(example.query)}
                                                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                                                    title={example.query}
                                                >
                                                    {example.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
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
