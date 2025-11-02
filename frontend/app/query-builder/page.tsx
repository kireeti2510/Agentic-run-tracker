'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function QueryBuilderPage() {
    const [selectedTable, setSelectedTable] = useState('')
    const [selectedColumns, setSelectedColumns] = useState<string[]>([])
    const [whereConditions, setWhereConditions] = useState<{ column: string, operator: string, value: string }[]>([])
    const [orderBy, setOrderBy] = useState('')
    const [orderDirection, setOrderDirection] = useState<'ASC' | 'DESC'>('ASC')
    const [limit, setLimit] = useState('')
    const [joinTable, setJoinTable] = useState('')
    const [joinType, setJoinType] = useState<'INNER' | 'LEFT' | 'RIGHT'>('INNER')
    const [joinCondition, setJoinCondition] = useState('')
    const [groupBy, setGroupBy] = useState('')
    const [havingCondition, setHavingCondition] = useState('')
    const [aggregateFunction, setAggregateFunction] = useState('')
    const [aggregateColumn, setAggregateColumn] = useState('')

    const [generatedQuery, setGeneratedQuery] = useState('')
    const [results, setResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const tables = [
        { name: 'User', columns: ['userID', 'Fname', 'Lname', 'Email', 'CreatedAt'] },
        { name: 'Project', columns: ['ProjectID', 'name', 'status', 'created_at', 'userID'] },
        { name: 'Agent', columns: ['AgentID', 'name', 'version', 'model', 'goal', 'ProjectID'] },
        { name: 'Run', columns: ['RunID', 'Status', 'time', 'notes', 'Parent_RunID', 'AgentID'] },
        { name: 'RunStep', columns: ['RunID', 'Step_No', 'Name', 'Status', 'Step_Type', 'Time'] },
        { name: 'RunMetric', columns: ['ID', 'RunID', 'Name', 'Value_Text', 'DataType', 'Value_Numeric'] },
        { name: 'Artifact', columns: ['ArtifactID', 'Type', 'URI', 'Checksum', 'Created_at', 'RunID'] },
        { name: 'Dataset', columns: ['DatasetID', 'name', 'version', 'URL', 'type', 'ProjectID'] },
        { name: 'Environment', columns: ['EnvironmentID', 'Name', 'Framework', 'Python_Version', 'GPU_Cores', 'CPU_Cores', 'RunID'] }
    ]

    const operators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN', 'IS NULL', 'IS NOT NULL']
    const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX']

    const getTableColumns = (tableName: string) => {
        return tables.find(t => t.name === tableName)?.columns || []
    }

    const addWhereCondition = () => {
        setWhereConditions([...whereConditions, { column: '', operator: '=', value: '' }])
    }

    const updateWhereCondition = (index: number, field: string, value: string) => {
        const updated = [...whereConditions]
        updated[index] = { ...updated[index], [field]: value }
        setWhereConditions(updated)
    }

    const removeWhereCondition = (index: number) => {
        setWhereConditions(whereConditions.filter((_, i) => i !== index))
    }

    useEffect(() => {
        generateQuery()
    }, [selectedTable, selectedColumns, whereConditions, orderBy, orderDirection, limit, joinTable, joinType, joinCondition, groupBy, havingCondition, aggregateFunction, aggregateColumn])

    const generateQuery = () => {
        if (!selectedTable) {
            setGeneratedQuery('')
            return
        }

        let query = 'SELECT '

        // Handle columns selection
        if (aggregateFunction && aggregateColumn) {
            query += `${aggregateFunction}(${aggregateColumn}) AS ${aggregateFunction}_${aggregateColumn}`
            if (selectedColumns.length > 0) {
                query += ', ' + selectedColumns.join(', ')
            }
        } else if (selectedColumns.length > 0) {
            query += selectedColumns.join(', ')
        } else {
            query += '*'
        }

        query += ` FROM \`${selectedTable}\``

        // Handle JOIN
        if (joinTable && joinCondition) {
            query += ` ${joinType} JOIN \`${joinTable}\` ON ${joinCondition}`
        }

        // Handle WHERE
        if (whereConditions.length > 0) {
            const conditions = whereConditions
                .filter(c => c.column)
                .map(c => {
                    if (c.operator === 'IS NULL' || c.operator === 'IS NOT NULL') {
                        return `${c.column} ${c.operator}`
                    }
                    if (c.operator === 'LIKE') {
                        return `${c.column} ${c.operator} '%${c.value}%'`
                    }
                    if (c.operator === 'IN') {
                        return `${c.column} ${c.operator} (${c.value})`
                    }
                    return `${c.column} ${c.operator} '${c.value}'`
                })
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ')
            }
        }

        // Handle GROUP BY
        if (groupBy) {
            query += ` GROUP BY ${groupBy}`
        }

        // Handle HAVING
        if (havingCondition && groupBy) {
            query += ` HAVING ${havingCondition}`
        }

        // Handle ORDER BY
        if (orderBy) {
            query += ` ORDER BY ${orderBy} ${orderDirection}`
        }

        // Handle LIMIT
        if (limit) {
            query += ` LIMIT ${limit}`
        }

        query += ';'
        setGeneratedQuery(query)
    }

    const executeQuery = async () => {
        if (!generatedQuery) {
            toast.error('No query to execute')
            return
        }

        setLoading(true)
        setResults(null)

        try {
            const response = await fetch(`${API_URL}/api/query/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: generatedQuery })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || 'Query execution failed')
                setResults({ error: data.error, details: data.details })
                return
            }

            setResults(data)
            toast.success('Query executed successfully!')
        } catch (err: any) {
            toast.error('Failed to execute query')
            setResults({ error: err.message })
        } finally {
            setLoading(false)
        }
    }

    const resetBuilder = () => {
        setSelectedTable('')
        setSelectedColumns([])
        setWhereConditions([])
        setOrderBy('')
        setOrderDirection('ASC')
        setLimit('')
        setJoinTable('')
        setJoinCondition('')
        setGroupBy('')
        setHavingCondition('')
        setAggregateFunction('')
        setAggregateColumn('')
        setResults(null)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Visual Query Builder</h1>
                <p className="text-gray-600">Build SQL queries visually by selecting options</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Query Builder Form */}
                <div className="space-y-4">
                    {/* Table Selection */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <span>📊</span> Select Table
                        </h3>
                        <select
                            value={selectedTable}
                            onChange={(e) => {
                                setSelectedTable(e.target.value)
                                setSelectedColumns([])
                                setJoinTable('')
                                setJoinCondition('')
                            }}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="">Choose a table...</option>
                            {tables.map(table => (
                                <option key={table.name} value={table.name}>{table.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Column Selection */}
                    {selectedTable && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <span>📋</span> Select Columns
                            </h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="checkbox"
                                        checked={selectedColumns.length === 0}
                                        onChange={() => setSelectedColumns([])}
                                    />
                                    <span className="font-medium">* (All columns)</span>
                                </label>
                                {getTableColumns(selectedTable).map(column => (
                                    <label key={column} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            checked={selectedColumns.includes(column)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedColumns([...selectedColumns, column])
                                                } else {
                                                    setSelectedColumns(selectedColumns.filter(c => c !== column))
                                                }
                                            }}
                                        />
                                        <span>{column}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Aggregate Function */}
                    {selectedTable && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <span>🔢</span> Aggregate Function (Optional)
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={aggregateFunction}
                                    onChange={(e) => setAggregateFunction(e.target.value)}
                                    className="p-2 border rounded-lg"
                                >
                                    <option value="">None</option>
                                    {aggregateFunctions.map(func => (
                                        <option key={func} value={func}>{func}</option>
                                    ))}
                                </select>
                                <select
                                    value={aggregateColumn}
                                    onChange={(e) => setAggregateColumn(e.target.value)}
                                    className="p-2 border rounded-lg"
                                    disabled={!aggregateFunction}
                                >
                                    <option value="">Select column...</option>
                                    {getTableColumns(selectedTable).map(column => (
                                        <option key={column} value={column}>{column}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* JOIN */}
                    {selectedTable && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <span>🔗</span> JOIN (Optional)
                            </h3>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        value={joinType}
                                        onChange={(e) => setJoinType(e.target.value as any)}
                                        className="p-2 border rounded-lg"
                                    >
                                        <option value="INNER">INNER JOIN</option>
                                        <option value="LEFT">LEFT JOIN</option>
                                        <option value="RIGHT">RIGHT JOIN</option>
                                    </select>
                                    <select
                                        value={joinTable}
                                        onChange={(e) => setJoinTable(e.target.value)}
                                        className="p-2 border rounded-lg"
                                    >
                                        <option value="">Select table...</option>
                                        {tables.filter(t => t.name !== selectedTable).map(table => (
                                            <option key={table.name} value={table.name}>{table.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    placeholder="ON condition (e.g., User.userID = Project.userID)"
                                    value={joinCondition}
                                    onChange={(e) => setJoinCondition(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                    disabled={!joinTable}
                                />
                            </div>
                        </div>
                    )}

                    {/* WHERE Conditions */}
                    {selectedTable && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <span>🔍</span> WHERE Conditions
                            </h3>
                            <div className="space-y-2">
                                {whereConditions.map((condition, index) => (
                                    <div key={index} className="flex gap-2">
                                        <select
                                            value={condition.column}
                                            onChange={(e) => updateWhereCondition(index, 'column', e.target.value)}
                                            className="flex-1 p-2 border rounded-lg text-sm"
                                        >
                                            <option value="">Column...</option>
                                            {getTableColumns(selectedTable).map(column => (
                                                <option key={column} value={column}>{column}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={condition.operator}
                                            onChange={(e) => updateWhereCondition(index, 'operator', e.target.value)}
                                            className="w-24 p-2 border rounded-lg text-sm"
                                        >
                                            {operators.map(op => (
                                                <option key={op} value={op}>{op}</option>
                                            ))}
                                        </select>
                                        {!['IS NULL', 'IS NOT NULL'].includes(condition.operator) && (
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                value={condition.value}
                                                onChange={(e) => updateWhereCondition(index, 'value', e.target.value)}
                                                className="flex-1 p-2 border rounded-lg text-sm"
                                            />
                                        )}
                                        <button
                                            onClick={() => removeWhereCondition(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addWhereCondition}
                                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                >
                                    + Add Condition
                                </button>
                            </div>
                        </div>
                    )}

                    {/* GROUP BY */}
                    {selectedTable && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <span>📊</span> GROUP BY (Optional)
                            </h3>
                            <select
                                value={groupBy}
                                onChange={(e) => setGroupBy(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="">None</option>
                                {getTableColumns(selectedTable).map(column => (
                                    <option key={column} value={column}>{column}</option>
                                ))}
                            </select>
                            {groupBy && (
                                <input
                                    type="text"
                                    placeholder="HAVING condition (e.g., COUNT(*) > 5)"
                                    value={havingCondition}
                                    onChange={(e) => setHavingCondition(e.target.value)}
                                    className="w-full p-2 border rounded-lg mt-2"
                                />
                            )}
                        </div>
                    )}

                    {/* ORDER BY and LIMIT */}
                    {selectedTable && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <span>⬆️</span> ORDER BY & LIMIT
                            </h3>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <select
                                    value={orderBy}
                                    onChange={(e) => setOrderBy(e.target.value)}
                                    className="col-span-2 p-2 border rounded-lg"
                                >
                                    <option value="">No ordering</option>
                                    {getTableColumns(selectedTable).map(column => (
                                        <option key={column} value={column}>{column}</option>
                                    ))}
                                </select>
                                <select
                                    value={orderDirection}
                                    onChange={(e) => setOrderDirection(e.target.value as any)}
                                    className="p-2 border rounded-lg"
                                    disabled={!orderBy}
                                >
                                    <option value="ASC">ASC</option>
                                    <option value="DESC">DESC</option>
                                </select>
                            </div>
                            <input
                                type="number"
                                placeholder="LIMIT (optional)"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    {selectedTable && (
                        <div className="flex gap-3">
                            <button
                                onClick={executeQuery}
                                disabled={loading || !generatedQuery}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Executing...' : 'Execute Query'}
                            </button>
                            <button
                                onClick={resetBuilder}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Reset
                            </button>
                        </div>
                    )}
                </div>

                {/* Generated Query and Results */}
                <div className="space-y-4">
                    {/* Generated Query */}
                    {generatedQuery && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3">Generated SQL Query</h3>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{generatedQuery}</code>
                            </pre>
                        </div>
                    )}

                    {/* Results */}
                    {results && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-3">Results</h3>
                            {results.error ? (
                                <div className="bg-red-50 border border-red-200 rounded p-4">
                                    <p className="text-red-800 font-medium">Error:</p>
                                    <p className="text-red-600 mt-1">{results.error}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-4 mb-3 text-sm">
                                        <span className="text-gray-600">
                                            Rows: <span className="font-medium">{results.rowCount || 0}</span>
                                        </span>
                                    </div>
                                    {results.data && Array.isArray(results.data) && results.data.length > 0 ? (
                                        <div className="overflow-auto max-h-96 border rounded">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 sticky top-0">
                                                    <tr>
                                                        {Object.keys(results.data[0]).map((key) => (
                                                            <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
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
                                    ) : (
                                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                            <p className="text-blue-800">No results found.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
