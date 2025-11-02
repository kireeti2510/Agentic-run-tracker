'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

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
        { name: 'User', columns: ['userID', 'Fname', 'Lname', 'Email', 'CreatedAt'], color: 'from-blue-500 to-blue-600', accent: 'blue' },
        { name: 'Project', columns: ['ProjectID', 'name', 'status', 'created_at', 'userID'], color: 'from-purple-500 to-purple-600', accent: 'purple' },
        { name: 'Agent', columns: ['AgentID', 'name', 'version', 'model', 'goal', 'ProjectID'], color: 'from-green-500 to-green-600', accent: 'green' },
        { name: 'Run', columns: ['RunID', 'Status', 'time', 'notes', 'Parent_RunID', 'AgentID'], color: 'from-orange-500 to-orange-600', accent: 'orange' },
        { name: 'RunStep', columns: ['RunID', 'Step_No', 'Name', 'Status', 'Step_Type', 'Time'], color: 'from-pink-500 to-pink-600', accent: 'pink' },
        { name: 'RunMetric', columns: ['ID', 'RunID', 'Name', 'Value_Text', 'DataType', 'Value_Numeric'], color: 'from-teal-500 to-teal-600', accent: 'teal' },
        { name: 'Artifact', columns: ['ArtifactID', 'Type', 'URI', 'Checksum', 'Created_at', 'RunID'], color: 'from-yellow-500 to-yellow-600', accent: 'yellow' },
        { name: 'Dataset', columns: ['DatasetID', 'name', 'version', 'URL', 'type', 'ProjectID'], color: 'from-indigo-500 to-indigo-600', accent: 'indigo' },
        { name: 'Environment', columns: ['EnvironmentID', 'Name', 'Framework', 'Python_Version', 'GPU_Cores', 'CPU_Cores', 'RunID'], color: 'from-red-500 to-red-600', accent: 'red' }
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

    const selectedTableInfo = tables.find(t => t.name === selectedTable)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-5 border border-gray-200/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Query Builder
                                </h1>
                                <p className="text-gray-600 text-sm">Construct SQL queries visually</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Query Builder Form */}
                    <div className="space-y-3">
                        {/* Table Selection */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-4 border border-gray-200/50 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Table
                                </h3>
                            </div>
                            <select
                                value={selectedTable}
                                onChange={(e) => {
                                    setSelectedTable(e.target.value)
                                    setSelectedColumns([])
                                    setJoinTable('')
                                    setJoinCondition('')
                                }}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            >
                                <option value="">Select table...</option>
                                {tables.map(table => (
                                    <option key={table.name} value={table.name}>
                                        {table.name}
                                    </option>
                                ))}
                            </select>

                            {selectedTableInfo && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-2 px-3 py-2 rounded-md bg-gradient-to-r ${selectedTableInfo.color} text-white text-xs flex items-center justify-between`}
                                >
                                    <span className="font-medium">{selectedTableInfo.name}</span>
                                    <span className="opacity-90">{selectedTableInfo.columns.length} columns</span>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Column Selection */}
                        <AnimatePresence>
                            {selectedTable && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-xl shadow-md">
                                            ☑️
                                        </div>
                                        <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">Select Columns</h3>
                                        <span className="ml-auto text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                            {selectedColumns.length || 'All'} selected
                                        </span>
                                    </div>
                                    <div className="space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                                        <label className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg cursor-pointer transition-all group border-2 border-transparent hover:border-blue-200">
                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.length === 0}
                                                onChange={() => setSelectedColumns([])}
                                                className="w-5 h-5 accent-blue-600 cursor-pointer"
                                            />
                                            <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">✨ * (All columns)</span>
                                        </label>
                                        {getTableColumns(selectedTable).map(column => (
                                            <label key={column} className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg cursor-pointer transition-all group border-2 border-transparent hover:border-blue-200">
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
                                                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                                                />
                                                <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">{column}</span>
                                            </label>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Aggregate Function */}
                        <AnimatePresence>
                            {selectedTable && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-xl shadow-md">
                                            🔢
                                        </div>
                                        <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">Aggregate Function</h3>
                                        <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Optional</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            value={aggregateFunction}
                                            onChange={(e) => setAggregateFunction(e.target.value)}
                                            className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all font-medium"
                                        >
                                            <option value="">None</option>
                                            {aggregateFunctions.map(func => (
                                                <option key={func} value={func}>{func}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={aggregateColumn}
                                            onChange={(e) => setAggregateColumn(e.target.value)}
                                            className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            disabled={!aggregateFunction}
                                        >
                                            <option value="">Select column...</option>
                                            {getTableColumns(selectedTable).map(column => (
                                                <option key={column} value={column}>{column}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {aggregateFunction && aggregateColumn && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3 p-3 bg-purple-50 border-2 border-purple-200 rounded-lg"
                                        >
                                            <p className="text-sm text-purple-700 font-medium">
                                                📊 {aggregateFunction}({aggregateColumn})
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* JOIN */}
                        <AnimatePresence>
                            {selectedTable && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-xl shadow-md">
                                            🔗
                                        </div>
                                        <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">JOIN Tables</h3>
                                        <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Optional</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <select
                                                value={joinType}
                                                onChange={(e) => setJoinType(e.target.value as any)}
                                                className="p-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all font-medium"
                                            >
                                                <option value="INNER">⚡ INNER JOIN</option>
                                                <option value="LEFT">⬅️ LEFT JOIN</option>
                                                <option value="RIGHT">➡️ RIGHT JOIN</option>
                                            </select>
                                            <select
                                                value={joinTable}
                                                onChange={(e) => setJoinTable(e.target.value)}
                                                className="p-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all font-medium"
                                            >
                                                <option value="">Select table...</option>
                                                {tables.filter(t => t.name !== selectedTable).map(table => (
                                                    <option key={table.name} value={table.name}>{table.icon} {table.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="ON condition (e.g., User.userID = Project.userID)"
                                            value={joinCondition}
                                            onChange={(e) => setJoinCondition(e.target.value)}
                                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            disabled={!joinTable}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* WHERE Conditions */}
                        <AnimatePresence>
                            {selectedTable && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-xl shadow-md">
                                            🔍
                                        </div>
                                        <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">WHERE Conditions</h3>
                                        <span className="ml-auto text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">
                                            {whereConditions.length} filters
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {whereConditions.map((condition, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="flex gap-2"
                                                >
                                                    <select
                                                        value={condition.column}
                                                        onChange={(e) => updateWhereCondition(index, 'column', e.target.value)}
                                                        className="flex-1 p-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
                                                    >
                                                        <option value="">Column...</option>
                                                        {getTableColumns(selectedTable).map(column => (
                                                            <option key={column} value={column}>{column}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={condition.operator}
                                                        onChange={(e) => updateWhereCondition(index, 'operator', e.target.value)}
                                                        className="w-28 p-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
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
                                                            className="flex-1 p-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
                                                        />
                                                    )}
                                                    <button
                                                        onClick={() => removeWhereCondition(index)}
                                                        className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                                    >
                                                        ✕
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={addWhereCondition}
                                            className="w-full px-4 py-3 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 rounded-lg hover:from-teal-200 hover:to-blue-200 font-medium shadow-sm hover:shadow transition-all"
                                        >
                                            + Add Condition
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* GROUP BY */}
                        <AnimatePresence>
                            {selectedTable && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-md">
                                            📊
                                        </div>
                                        <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">GROUP BY</h3>
                                        <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Optional</span>
                                    </div>
                                    <select
                                        value={groupBy}
                                        onChange={(e) => setGroupBy(e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                                    >
                                        <option value="">None</option>
                                        {getTableColumns(selectedTable).map(column => (
                                            <option key={column} value={column}>{column}</option>
                                        ))}
                                    </select>
                                    <AnimatePresence>
                                        {groupBy && (
                                            <motion.input
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                type="text"
                                                placeholder="HAVING condition (e.g., COUNT(*) > 5)"
                                                value={havingCondition}
                                                onChange={(e) => setHavingCondition(e.target.value)}
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg mt-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ORDER BY and LIMIT */}
                        <AnimatePresence>
                            {selectedTable && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: 0.7 }}
                                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-xl shadow-md">
                                            ⬆️
                                        </div>
                                        <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">ORDER BY & LIMIT</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        <select
                                            value={orderBy}
                                            onChange={(e) => setOrderBy(e.target.value)}
                                            className="col-span-2 p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all font-medium"
                                        >
                                            <option value="">No ordering</option>
                                            {getTableColumns(selectedTable).map(column => (
                                                <option key={column} value={column}>{column}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={orderDirection}
                                            onChange={(e) => setOrderDirection(e.target.value as any)}
                                            className="p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            disabled={!orderBy}
                                        >
                                            <option value="ASC">↑ ASC</option>
                                            <option value="DESC">↓ DESC</option>
                                        </select>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="LIMIT (optional)"
                                        value={limit}
                                        onChange={(e) => setLimit(e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all font-medium"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <AnimatePresence>
                            {selectedTable && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex gap-4"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={executeQuery}
                                        disabled={loading || !generatedQuery}
                                        className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {loading ? '⏳ Executing...' : '🚀 Execute Query'}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={resetBuilder}
                                        className="px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 font-bold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        🔄
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Generated Query and Results */}
                    <div className="space-y-5">
                        {/* Generated Query */}
                        <AnimatePresence>
                            {generatedQuery && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="bg-white rounded-xl shadow-xl p-6 border border-gray-100"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-xl shadow-md">
                                            💻
                                        </div>
                                        <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">Generated SQL Query</h3>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedQuery)
                                                toast.success('Query copied to clipboard!')
                                            }}
                                            className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                        >
                                            📋 Copy
                                        </motion.button>
                                    </div>
                                    <div className="relative">
                                        <pre className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-green-400 p-5 rounded-xl overflow-x-auto text-sm font-mono shadow-inner border-2 border-gray-700">
                                            <code>{generatedQuery}</code>
                                        </pre>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Results */}
                        <AnimatePresence>
                            {results && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="bg-white rounded-xl shadow-xl p-6 border border-gray-100"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-xl shadow-md">
                                            📈
                                        </div>
                                        <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">Query Results</h3>
                                    </div>
                                    {results.error ? (
                                        <motion.div
                                            initial={{ scale: 0.95 }}
                                            animate={{ scale: 1 }}
                                            className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-5 shadow-md"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">⚠️</span>
                                                <div>
                                                    <p className="text-red-800 font-bold text-lg">Error:</p>
                                                    <p className="text-red-600 mt-2 font-medium">{results.error}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <div className="flex gap-4 mb-4">
                                                <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                                                    <span className="text-gray-700 font-medium">
                                                        📊 Rows: <span className="font-bold text-blue-600">{results.rowCount || 0}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            {results.data && Array.isArray(results.data) && results.data.length > 0 ? (
                                                <div className="overflow-auto max-h-[500px] border-2 border-gray-200 rounded-xl shadow-inner custom-scrollbar">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gradient-to-r from-gray-50 to-blue-50 sticky top-0 z-10">
                                                            <tr>
                                                                {Object.keys(results.data[0]).map((key) => (
                                                                    <th key={key} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                                                                        {key}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {results.data.map((row: any, idx: number) => (
                                                                <motion.tr
                                                                    key={idx}
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: idx * 0.02 }}
                                                                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors"
                                                                >
                                                                    {Object.values(row).map((val: any, cellIdx: number) => (
                                                                        <td key={cellIdx} className="px-6 py-3 text-sm text-gray-900 whitespace-nowrap">
                                                                            {val === null ? (
                                                                                <span className="text-gray-400 italic font-medium">null</span>
                                                                            ) : typeof val === 'object' ? (
                                                                                <span className="text-purple-600 font-mono text-xs">{JSON.stringify(val)}</span>
                                                                            ) : (
                                                                                <span className="font-medium">{String(val)}</span>
                                                                            )}
                                                                        </td>
                                                                    ))}
                                                                </motion.tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <motion.div
                                                    initial={{ scale: 0.95 }}
                                                    animate={{ scale: 1 }}
                                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 text-center shadow-md"
                                                >
                                                    <span className="text-4xl mb-2 block">🔍</span>
                                                    <p className="text-blue-800 font-bold text-lg">No results found.</p>
                                                    <p className="text-blue-600 text-sm mt-1">Try adjusting your query parameters</p>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Custom Scrollbar Styles */}
                <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #7c3aed);
                }
            `}</style>
            </div>
        </div>
    )
}
