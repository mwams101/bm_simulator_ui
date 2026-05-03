import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8000';

const statusClasses = {
    SUCCESS: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    FAILED:  'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    PENDING: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    SKIPPED: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
};

const ITEMS_PER_PAGE = 10;

const RecordsTab = ({ job, onStartExecution, startExecutionLoading, executionResult }) => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const r = await fetch(`${API}/migration-records/by-job/${job.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
                if (r.ok) setRecords(await r.json());
            } finally { setLoading(false); }
        };
        fetchRecords();
    }, [job.id]);

    const paginated = records.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);

    return (
        <div className="space-y-4">
        <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#cfd7e7] dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">table_rows</span>
                    <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Migration Records</h3>
                    <span className="text-xs text-gray-400 ml-1">({records.length} total)</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><span className="material-symbols-outlined text-xs" style={{fontSize:13}}>check_circle</span>{job.successful_records} success</span>
                    <span className="text-red-500 dark:text-red-400 flex items-center gap-1"><span className="material-symbols-outlined text-xs" style={{fontSize:13}}>cancel</span>{job.failed_records} failed</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span></div>
            ) : records.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-gray-300 dark:text-gray-600">table_rows</span>
                    No migration records yet. Start mapping to generate records.
                </div>
            ) : (
                <>
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                            {['Row #', 'Status', 'Migrated At', 'Error', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                            {paginated.map(rec => (
                                <>
                                    <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                        <td className="px-4 py-3 font-mono text-[#0d121b] dark:text-white">#{rec.source_record_id}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClasses[rec.status?.toUpperCase()] ?? statusClasses.PENDING}`}>{rec.status}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{rec.migrated_at ? new Date(rec.migrated_at).toLocaleString() : '—'}</td>
                                        <td className="px-4 py-3 text-red-500 dark:text-red-400 max-w-[200px] truncate">{rec.error_message || '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => setExpanded(expanded === rec.id ? null : rec.id)} className="text-gray-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-sm">{expanded === rec.id ? 'expand_less' : 'expand_more'}</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {expanded === rec.id && (
                                        <tr key={`${rec.id}-exp`} className="bg-gray-50 dark:bg-gray-900/50">
                                            <td colSpan={5} className="px-4 py-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Source Data</p>
                                                        <pre className="text-xs font-mono bg-white dark:bg-gray-900 border border-[#e7ebf3] dark:border-gray-700 rounded-lg p-3 overflow-auto max-h-32 text-[#0d121b] dark:text-gray-300">
                                                            {JSON.stringify(rec.source_data, null, 2)}
                                                        </pre>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Transformed Data</p>
                                                        <pre className="text-xs font-mono bg-white dark:bg-gray-900 border border-[#e7ebf3] dark:border-gray-700 rounded-lg p-3 overflow-auto max-h-32 text-[#0d121b] dark:text-gray-300">
                                                            {JSON.stringify(rec.transformed_data, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-[#cfd7e7] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                            <span className="text-xs text-gray-500">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, records.length)} of {records.length}</span>
                            <div className="flex items-center gap-1">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1 rounded disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <span className="text-xs font-medium px-2">{currentPage} / {totalPages}</span>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1 rounded disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>

        {/* Execution result banner */}
        {executionResult && (
            <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <span className={`material-symbols-outlined ${executionResult.status === 'completed' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {executionResult.status === 'completed' ? 'check_circle' : 'error'}
                    </span>
                    <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">
                        Execution {executionResult.status === 'completed' ? 'Completed' : 'Failed'}
                    </h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center border border-emerald-100 dark:border-emerald-900/40">
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{executionResult.committed}</p>
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-1">Committed</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center border border-amber-100 dark:border-amber-900/30">
                        <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{executionResult.skipped_duplicates}</p>
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-1">Skipped (duplicates)</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center border border-red-100 dark:border-red-900/30">
                        <p className="text-2xl font-black text-red-500 dark:text-red-400">{executionResult.failed}</p>
                        <p className="text-xs font-semibold text-red-700 dark:text-red-300 mt-1">Failed</p>
                    </div>
                </div>
            </div>
        )}

        {/* Start Execution button — only shown in PREVIEWING status */}
        {job.status === 'previewing' && (
            <div className="flex items-center justify-between bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 p-5">
                <div>
                    <p className="text-sm font-bold text-[#0d121b] dark:text-white">Ready to Execute</p>
                    <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-0.5">
                        Review the transformed records above, then commit them to the destination tables.
                    </p>
                </div>
                <button
                    onClick={onStartExecution}
                    disabled={startExecutionLoading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-500/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {startExecutionLoading
                        ? <><span className="material-symbols-outlined animate-spin">progress_activity</span>Executing...</>
                        : <><span className="material-symbols-outlined">rocket_launch</span>Execute Migration</>}
                </button>
            </div>
        )}
        </div>
    );
};

export default RecordsTab;