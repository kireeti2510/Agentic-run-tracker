'use client'

export default function TriggersPage() {
    const triggers = [
        {
            name: 'trg_run_parent_not_self',
            type: 'BEFORE INSERT',
            table: 'Run',
            description: 'Prevents a run from being set as its own parent. Ensures data integrity by checking that Parent_RunID is not equal to RunID.',
            timing: 'BEFORE INSERT',
            event: 'INSERT',
            definition: `CREATE TRIGGER trg_run_parent_not_self 
BEFORE INSERT ON \`Run\` 
FOR EACH ROW 
BEGIN 
  IF NEW.Parent_RunID IS NOT NULL AND NEW.Parent_RunID = NEW.RunID THEN 
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Run cannot parent itself'; 
  END IF; 
END;`,
            example: 'INSERT INTO Run (RunID, Parent_RunID, AgentID, Status) VALUES (5, 5, 1, "queued"); -- This will fail'
        },
        {
            name: 'trg_artifact_checksum_default',
            type: 'BEFORE INSERT',
            table: 'Artifact',
            description: 'Automatically generates a SHA-256 checksum for an artifact if one is not provided. Uses the URI as input for the hash.',
            timing: 'BEFORE INSERT',
            event: 'INSERT',
            definition: `CREATE TRIGGER trg_artifact_checksum_default 
BEFORE INSERT ON \`Artifact\` 
FOR EACH ROW 
BEGIN 
  IF NEW.Checksum IS NULL THEN 
    SET NEW.Checksum = SHA2(NEW.URI, 256); 
  END IF; 
END;`,
            example: 'INSERT INTO Artifact (Type, URI, RunID) VALUES ("log", "https://example.com/log.txt", 1); -- Checksum auto-generated'
        }
    ]

    const getColorByType = (type: string) => {
        if (type.includes('INSERT')) return 'bg-green-100 text-green-800 border-green-200'
        if (type.includes('UPDATE')) return 'bg-blue-100 text-blue-800 border-blue-200'
        if (type.includes('DELETE')) return 'bg-red-100 text-red-800 border-red-200'
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }

    const getIconByType = (type: string) => {
        if (type.includes('INSERT')) return '➕'
        if (type.includes('UPDATE')) return '🔄'
        if (type.includes('DELETE')) return '🗑️'
        return '⚡'
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Database Triggers</h1>
                <p className="text-gray-600">
                    Automatic database actions that fire on INSERT, UPDATE, or DELETE operations
                </p>
                <div className="mt-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {triggers.filter(t => t.event === 'INSERT').length} INSERT
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                            {triggers.filter(t => t.event === 'UPDATE').length} UPDATE
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                            {triggers.filter(t => t.event === 'DELETE').length} DELETE
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                            {triggers.length} Total
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {triggers.map((trigger, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        {/* Header */}
                        <div className={`border-b p-4 ${getColorByType(trigger.type)}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getIconByType(trigger.type)}</span>
                                    <div>
                                        <h3 className="text-xl font-bold font-mono">{trigger.name}</h3>
                                        <p className="text-sm mt-1">
                                            <span className="font-semibold">Table:</span> {trigger.table}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getColorByType(trigger.type)}`}>
                                        {trigger.timing}
                                    </span>
                                    <div className="text-xs mt-1 font-semibold">
                                        {trigger.event}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Description */}
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                                <p className="text-gray-700 leading-relaxed">{trigger.description}</p>
                            </div>

                            {/* Definition */}
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Trigger Definition</h4>
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                    <code>{trigger.definition}</code>
                                </pre>
                            </div>

                            {/* Example */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Example Usage</h4>
                                <pre className="bg-blue-50 text-blue-900 p-4 rounded-lg overflow-x-auto text-sm border border-blue-200">
                                    <code>{trigger.example}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span>ℹ️</span>
                    About Database Triggers
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <p>
                        <strong>Triggers</strong> are special stored procedures that automatically execute when specific events occur on a table.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>BEFORE triggers:</strong> Execute before the triggering event (INSERT, UPDATE, DELETE)</li>
                        <li><strong>AFTER triggers:</strong> Execute after the triggering event completes</li>
                        <li><strong>Benefits:</strong> Enforce business rules, maintain data integrity, automate logging</li>
                        <li><strong>Use cases:</strong> Validation, auto-calculation, auditing, cascading updates</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
