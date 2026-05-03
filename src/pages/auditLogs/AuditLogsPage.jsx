import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ITEMS_PER_PAGE = 15;

const actionConfig = {
    LOGIN:    { icon: 'login',        classes: 'bg-primary/10 text-primary' },
    LOGOUT:   { icon: 'logout',       classes: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' },
    UPLOAD:   { icon: 'upload_file',  classes: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    MAP:      { icon: 'transform',    classes: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
    VALIDATE: { icon: 'rule',         classes: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    EXECUTE:  { icon: 'play_arrow',   classes: 'bg-primary/10 text-primary' },
    DOWNLOAD: { icon: 'download',     classes: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
    DELETE:   { icon: 'delete',       classes: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
};

const AuditLogsPage = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

    const fetchLogs = async () => {
        setLoading(true); setError('');
        try {
            const r = await fetch('http://localhost:8000/audit-logs', { headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) throw new Error('Failed to fetch audit logs');
            const data = await r.json();
            const filtered = searchTerm
                ? data.filter(l =>
                    l.action_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    l.action_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    l.ip_address?.includes(searchTerm))
                : data;
            setLogs(filtered.slice().reverse());
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLogs(); }, [searchTerm]);

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await fetch(`http://localhost:8000/audit-logs/${deleteTarget.id}`, { method: 'DELETE', headers: headers() });
            fetchLogs(); setDeleteTarget(null);
        } finally { setDeleteLoading(false); }
    };

    const paginated = logs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login', { replace: true }); };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <Header activeTab="audit-logs" onLogout={handleLogout} />
                <main className="flex-1 flex flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">
                        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-red-600 dark:text-red-400">{error}</p></div>}

                        <div>
                            <h1 className="text-3xl font-black text-[#0d121b] dark:text-white tracking-tight">Audit Logs</h1>
                            <p className="text-sm text-[#4c669a] dark:text-gray-400 mt-1">Complete history of all system actions. Most recent first.</p>
                        </div>

                        <SearchBar searchTerm={searchTerm} onSearchChange={t => { setSearchTerm(t); setCurrentPage(1); }} placeholder="Search by action type, description or IP address..." />

                        <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                            {loading ? (
                                <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                                            {['Action', 'Description', 'User', 'Job', 'IP Address', 'Timestamp', ''].map(h => (
                                                <th key={h} className="px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                                        {paginated.length > 0 ? paginated.map(log => {
                                            const cfg = actionConfig[log.action_type?.toUpperCase()] ?? { icon: 'history', classes: 'bg-gray-100 dark:bg-gray-800 text-gray-500' };
                                            const isExpanded = expanded === log.id;
                                            return (
                                                <>
                                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.classes}`}>
                                                                <span className="material-symbols-outlined text-sm" style={{ fontSize: 14 }}>{cfg.icon}</span>
                                                                {log.action_type}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-[#0d121b] dark:text-white max-w-[220px] truncate">{log.action_description}</td>
                                                        <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">User #{log.user_id}</td>
                                                        <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">{log.migration_job_id ? `#${log.migration_job_id}` : '—'}</td>
                                                        <td className="px-6 py-4 text-sm font-mono text-[#4c669a] dark:text-gray-400">{log.ip_address || '—'}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1">
                                                                {(log.request_data || log.response_data) && (
                                                                    <button onClick={() => setExpanded(isExpanded ? null : log.id)} className="p-1 rounded text-gray-400 hover:text-primary transition-colors" title="Expand details">
                                                                        <span className="material-symbols-outlined text-sm">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                                                                    </button>
                                                                )}
                                                                <button onClick={() => setDeleteTarget(log)} className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors">
                                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {isExpanded && (
                                                        <tr key={`${log.id}-exp`} className="bg-gray-50 dark:bg-gray-900/50">
                                                            <td colSpan={7} className="px-6 py-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    {log.request_data && (
                                                                        <div>
                                                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Request Data</p>
                                                                            <pre className="text-xs font-mono bg-white dark:bg-gray-900 border border-[#e7ebf3] dark:border-gray-700 rounded-lg p-3 overflow-auto max-h-28 text-[#0d121b] dark:text-gray-300">{log.request_data}</pre>
                                                                        </div>
                                                                    )}
                                                                    {log.response_data && (
                                                                        <div>
                                                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Response Data</p>
                                                                            <pre className="text-xs font-mono bg-white dark:bg-gray-900 border border-[#e7ebf3] dark:border-gray-700 rounded-lg p-3 overflow-auto max-h-28 text-[#0d121b] dark:text-gray-300">{log.response_data}</pre>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            );
                                        }) : (
                                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No audit logs found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {!loading && logs.length > ITEMS_PER_PAGE && (
                            <Pagination currentPage={currentPage} totalItems={logs.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
                        )}
                    </div>
                </main>
                <Footer />
            </div>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete}
                title="Delete Audit Log" message="Delete this audit log entry? This action cannot be undone."
                confirmText="Delete" cancelText="Cancel" variant="danger" loading={deleteLoading} />
        </div>
    );
};

export default AuditLogsPage;
