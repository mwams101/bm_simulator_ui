import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ActionMenu from '../../components/common/ActionMenu';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AddAccountModal from './components/AddAccountModal';
import UpdateAccountModal from './components/UpdateAccountModal';

const ITEMS_PER_PAGE = 10;

const statusClasses = {
    ACTIVE: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    CLOSED: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    FROZEN: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
};

const typeIcon = { SAVINGS: 'savings', CHECKING: 'account_balance', CREDIT: 'credit_card', LOAN: 'payments' };

const AccountsPage = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

    const fetchAccounts = async () => {
        setLoading(true); setError('');
        try {
            const r = await fetch('http://localhost:8000/new-bank-accounts', { headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) throw new Error('Failed to fetch accounts');
            const data = await r.json();
            const filtered = searchTerm
                ? data.filter(a =>
                    String(a.account_number).includes(searchTerm) ||
                    a.account_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    a.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    a.currency?.toLowerCase().includes(searchTerm.toLowerCase()))
                : data;
            setAccounts(filtered);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAccounts(); }, [searchTerm]);

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            const r = await fetch(`http://localhost:8000/new-bank-accounts/${selected.id}`, { method: 'DELETE', headers: headers() });
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to delete'); }
            fetchAccounts(); setIsDeleteOpen(false); setSelected(null);
        } catch (err) { setError(err.message); }
        finally { setDeleteLoading(false); }
    };

    const paginated = accounts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login', { replace: true }); };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col pt-14 md:pt-0 md:pl-60">
                <Header activeTab="accounts" onLogout={handleLogout} />
                <main className="flex-1 flex flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">
                        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-red-600 dark:text-red-400">{error}</p></div>}

                        <PageHeader title="Migrated Accounts" description="Bank accounts linked to migrated customers." buttonText="Add Account" buttonIcon="add_card" onButtonClick={() => setIsAddOpen(true)} />
                        <SearchBar searchTerm={searchTerm} onSearchChange={t => { setSearchTerm(t); setCurrentPage(1); }} placeholder="Search by account number, type, status or currency..." />

                        <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                            {loading ? (
                                <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                                                {['Account', 'Customer ID', 'Balance', 'Open Date', 'Status', 'Actions'].map(h => (
                                                    <th key={h} className={`px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                                            {paginated.length > 0 ? paginated.map(a => (
                                                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                                <span className="material-symbols-outlined text-primary text-sm">{typeIcon[a.account_type] ?? 'account_balance'}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-[#0d121b] dark:text-white">#{a.account_number}</p>
                                                                <p className="text-xs text-[#4c669a] dark:text-gray-400">{a.account_type}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">Customer #{a.customer_id}</td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-bold text-[#0d121b] dark:text-white">{a.balance.toLocaleString('en-US', { style: 'currency', currency: a.currency })}</p>
                                                        <p className="text-xs text-[#4c669a] dark:text-gray-400">{a.currency}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">{a.account_open_date}</td>
                                                    <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusClasses[a.status] ?? statusClasses.CLOSED}`}>{a.status}</span></td>
                                                    <td className="px-6 py-4 text-right">
                                                        <ActionMenu
                                                            onEdit={() => { setSelected(a); setIsUpdateOpen(true); }}
                                                            onDelete={() => { setSelected(a); setIsDeleteOpen(true); }}
                                                        />
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No accounts found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {!loading && accounts.length > ITEMS_PER_PAGE && (
                            <Pagination currentPage={currentPage} totalItems={accounts.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
                        )}
                    </div>
                </main>
                <Footer />
            </div>

            <AddAccountModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onCreated={fetchAccounts} />
            <UpdateAccountModal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} onUpdated={fetchAccounts} account={selected} />
            <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete}
                title="Delete Account" message={`Delete account #${selected?.account_number}? This cannot be undone.`}
                confirmText="Delete Account" cancelText="Cancel" variant="danger" loading={deleteLoading} />
        </div>
    );
};

export default AccountsPage;
