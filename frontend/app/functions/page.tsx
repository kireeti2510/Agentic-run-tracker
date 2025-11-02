'use client'

export default function FunctionsProceduresPage() {
    const functions = [
        {
            name: 'count_agents_in_project',
            type: 'FUNCTION',
            description: 'Counts the number of agents in a specific project',
            parameters: [
                { name: 'p_project_id', type: 'BIGINT UNSIGNED', description: 'The project ID to count agents for' }
            ],
            returns: 'INT',
            example: 'SELECT ProjectID, count_agents_in_project(ProjectID) AS agent_count FROM Project;',
            definition: `CREATE FUNCTION count_agents_in_project(p_project_id BIGINT UNSIGNED) 
RETURNS INT 
DETERMINISTIC 
READS SQL DATA 
BEGIN 
  DECLARE agent_count INT; 
  SELECT COUNT(*) INTO agent_count 
  FROM \`Agent\` 
  WHERE ProjectID = p_project_id; 
  RETURN agent_count; 
END;`
        }
    ]

    const procedures = [
        {
            name: 'GetRunsByAgent',
            type: 'PROCEDURE',
            description: 'Retrieves all runs for a specific agent, ordered by time (most recent first)',
            parameters: [
                { name: 'p_agent_id', type: 'BIGINT UNSIGNED', description: 'The agent ID to fetch runs for' }
            ],
            returns: 'Result set with all columns from Run table',
            example: 'CALL GetRunsByAgent(1);',
            definition: `CREATE PROCEDURE GetRunsByAgent ( 
  IN p_agent_id BIGINT UNSIGNED 
) 
BEGIN 
  SELECT * FROM \`Run\` WHERE AgentID = p_agent_id ORDER BY \`time\` DESC; 
END;`
        },
        {
            name: 'GetRunMetrics',
            type: 'PROCEDURE',
            description: 'Retrieves all metrics for a specific run',
            parameters: [
                { name: 'p_run_id', type: 'BIGINT UNSIGNED', description: 'The run ID to fetch metrics for' }
            ],
            returns: 'Result set with Name, DataType, Value_Numeric, Value_Text columns',
            example: 'CALL GetRunMetrics(1);',
            definition: `CREATE PROCEDURE GetRunMetrics ( 
  IN p_run_id BIGINT UNSIGNED 
) 
BEGIN 
  SELECT Name, DataType, Value_Numeric, Value_Text 
  FROM \`RunMetric\` 
  WHERE RunID = p_run_id; 
END;`
        },
        {
            name: 'GetArtifactsForRun',
            type: 'PROCEDURE',
            description: 'Retrieves all artifacts associated with a specific run',
            parameters: [
                { name: 'p_run_id', type: 'BIGINT UNSIGNED', description: 'The run ID to fetch artifacts for' }
            ],
            returns: 'Result set with Type, URI, Checksum, Created_at columns',
            example: 'CALL GetArtifactsForRun(1);',
            definition: `CREATE PROCEDURE GetArtifactsForRun ( 
  IN p_run_id BIGINT UNSIGNED 
) 
BEGIN 
  SELECT Type, URI, Checksum, Created_at 
  FROM \`Artifact\` 
  WHERE RunID = p_run_id; 
END;`
        }
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Functions & Procedures</h1>
                <p className="text-gray-600">Database functions and stored procedures available in the system</p>
            </div>

            {/* Functions Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mr-3">FUNCTIONS</span>
                    Custom Functions
                </h2>

                <div className="space-y-6">
                    {functions.map((func, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-purple-50 border-b border-purple-100 p-4">
                                <h3 className="text-xl font-semibold text-purple-900">{func.name}</h3>
                                <p className="text-gray-700 mt-1">{func.description}</p>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Parameters */}
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Parameters:</h4>
                                    <div className="bg-gray-50 rounded p-3 space-y-1">
                                        {func.parameters.map((param, pidx) => (
                                            <div key={pidx} className="flex gap-2">
                                                <span className="font-mono text-sm text-blue-600">{param.name}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-sm text-gray-600">{param.type}</span>
                                                <span className="text-gray-400">-</span>
                                                <span className="text-sm text-gray-600">{param.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Returns */}
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Returns:</h4>
                                    <div className="bg-gray-50 rounded p-3">
                                        <span className="font-mono text-sm text-green-600">{func.returns}</span>
                                    </div>
                                </div>

                                {/* Example */}
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Example Usage:</h4>
                                    <div className="bg-gray-900 rounded p-3">
                                        <code className="text-green-400 text-sm">{func.example}</code>
                                    </div>
                                </div>

                                {/* Definition */}
                                <details className="group">
                                    <summary className="cursor-pointer font-semibold text-sm text-gray-700 hover:text-blue-600 flex items-center gap-2">
                                        <span className="transform transition-transform group-open:rotate-90">▶</span>
                                        View Full Definition
                                    </summary>
                                    <div className="mt-2 bg-gray-900 rounded p-3 overflow-auto">
                                        <pre className="text-green-400 text-xs">{func.definition}</pre>
                                    </div>
                                </details>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Procedures Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">PROCEDURES</span>
                    Stored Procedures
                </h2>

                <div className="space-y-6">
                    {procedures.map((proc, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-blue-50 border-b border-blue-100 p-4">
                                <h3 className="text-xl font-semibold text-blue-900">{proc.name}</h3>
                                <p className="text-gray-700 mt-1">{proc.description}</p>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Parameters */}
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Parameters:</h4>
                                    <div className="bg-gray-50 rounded p-3 space-y-1">
                                        {proc.parameters.map((param, pidx) => (
                                            <div key={pidx} className="flex gap-2">
                                                <span className="font-mono text-sm text-blue-600">{param.name}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-sm text-gray-600">{param.type}</span>
                                                <span className="text-gray-400">-</span>
                                                <span className="text-sm text-gray-600">{param.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Returns */}
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Returns:</h4>
                                    <div className="bg-gray-50 rounded p-3">
                                        <span className="text-sm text-gray-600">{proc.returns}</span>
                                    </div>
                                </div>

                                {/* Example */}
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Example Usage:</h4>
                                    <div className="bg-gray-900 rounded p-3">
                                        <code className="text-green-400 text-sm">{proc.example}</code>
                                    </div>
                                </div>

                                {/* Definition */}
                                <details className="group">
                                    <summary className="cursor-pointer font-semibold text-sm text-gray-700 hover:text-blue-600 flex items-center gap-2">
                                        <span className="transform transition-transform group-open:rotate-90">▶</span>
                                        View Full Definition
                                    </summary>
                                    <div className="mt-2 bg-gray-900 rounded p-3 overflow-auto">
                                        <pre className="text-green-400 text-xs">{proc.definition}</pre>
                                    </div>
                                </details>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-lg mb-3">💡 Quick Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Use functions in SELECT statements to calculate values on-the-fly</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Call procedures using the CALL statement to execute complex queries</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Try these in the SQL Query Executor page for immediate results</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>All functions and procedures are optimized for performance</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
