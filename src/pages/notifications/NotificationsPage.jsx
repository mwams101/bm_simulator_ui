import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ITEMS_PER_PAGE = 10;

const statusClasses = {
    PENDING: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    SENT:    'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    FAILED:  'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
};

const typeIcon = { EMAIL: 'mail', SMS: 'sms', IN_APP: 'notifications' };

const NotificationsPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [markingId, setMarkingId] = useState(null);

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

    const fetchNotifications = async () => {
        setLoading(true); setError('');
        try {
            const r = await fetch('http://localhost:8000/notifications', { headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) throw new Error('Failed to fetch notifications');
            const data = await r.json();
            const filtered = searchTerm
                ? data.filter(n =>
                    n.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    n.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    n.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    n.notification_type?.toLowerCase().includes(searchTerm.toLowerCase()))
                : data;
            setNotifications(filtered);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchNotifications(); }, [searchTerm]);

    const markAsSent = async (n) => {
        setMarkingId(n.id);
        try {
            const r = await fetch(`http://localhost:8000/notifications/${n.id}`, {
                method: 'PUT',
                headers: headers(),
                body: JSON.stringify({ status: 'SENT', sent_at: new Date().toISOString() }),
            });
            if (r.ok) fetchNotifications();
        } finally { setMarkingId(null); }
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await fetch(`http://localhost:8000/notifications/${deleteTarget.id}`, { method: 'DELETE', headers: headers() });
            fetchNotifications(); setDeleteTarget(null);
        } finally { setDeleteLoading(false); }
    };

    const paginated = notifications.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const pendingCount = notifications.filter(n => n.status === 'PENDING').length;
    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login', { replace: true }); };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <Header activeTab="notifications" onLogout={handleLogout} />
                <main className="flex-1 flex flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">
                        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-red-600 dark:text-red-400">{error}</p></div>}

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-[#0d121b] dark:text-white tracking-tight">Notifications</h1>
                                <p className="text-sm text-[#4c669a] dark:text-gray-400 mt-1">
                                    System alerts and migration status notifications.
                                    {pendingCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">{pendingCount} pending</span>}
                                </p>
                            </div>
                        </div>

                        <SearchBar searchTerm={searchTerm} onSearchChange={t => { setSearchTerm(t); setCurrentPage(1); }} placeholder="Search by subject, recipient, type or status..." />

                        <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                            {loading ? (
                                <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                                                {['Type', 'Subject', 'Recipient', 'Job', 'Status', 'Created', 'Actions'].map(h => (
                                                    <th key={h} className={`px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                                            {paginated.length > 0 ? paginated.map(n => (
                                                <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-primary text-lg">{typeIcon[n.notification_type] ?? 'notifications'}</span>
                                                            <span className="text-xs font-semibold text-[#4c669a] dark:text-gray-400">{n.notification_type}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-bold text-[#0d121b] dark:text-white max-w-[200px] truncate">{n.subject}</p>
                                                        <p className="text-xs text-[#4c669a] dark:text-gray-400 max-w-[200px] truncate">{n.message}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">{n.recipient}</td>
                                                    <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">{n.migration_job_id ? `#${n.migration_job_id}` : '—'}</td>
                                                    <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusClasses[n.status] ?? statusClasses.PENDING}`}>{n.status}</span></td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{n.created_at ? new Date(n.created_at).toLocaleDateString() : '—'}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {n.status === 'PENDING' && (
                                                                <button
                                                                    onClick={() => markAsSent(n)}
                                                                    disabled={markingId === n.id}
                                                                    title="Mark as sent"
                                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-40"
                                                                >
                                                                    {markingId === n.id
                                                                        ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                                                        : <span className="material-symbols-outlined text-lg">mark_email_read</span>}
                                                                </button>
                                                            )}
                                                            <button onClick={() => setDeleteTarget(n)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                                <span className="material-symbols-outlined text-lg">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No notifications found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {!loading && notifications.length > ITEMS_PER_PAGE && (
                            <Pagination currentPage={currentPage} totalItems={notifications.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
                        )}
                    </div>
                </main>
                <Footer />
            </div>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete}
                title="Delete Notification" message={`Delete notification "${deleteTarget?.subject}"?`}
                confirmText="Delete" cancelText="Cancel" variant="danger" loading={deleteLoading} />
        </div>
    );
};

export default NotificationsPage;
