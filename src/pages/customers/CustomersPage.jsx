import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ActionMenu from '../../components/common/ActionMenu';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AddCustomerModal from './components/AddCustomerModal';
import UpdateCustomerModal from './components/UpdateCustomerModal';
import ViewCustomerModal from './components/ViewCustomerModal';

const ITEMS_PER_PAGE = 10;

const statusClasses = {
    ACTIVE:    'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    INACTIVE:  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    SUSPENDED: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
};

const CustomersPage = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

    const fetchCustomers = async () => {
        setLoading(true); setError('');
        try {
            const r = await fetch('http://localhost:8000/new-bank-customers', { headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) throw new Error('Failed to fetch customers');
            const data = await r.json();
            const filtered = searchTerm
                ? data.filter(c =>
                    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.city?.toLowerCase().includes(searchTerm.toLowerCase()))
                : data;
            setCustomers(filtered);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCustomers(); }, [searchTerm]);

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            const r = await fetch(`http://localhost:8000/new-bank-customers/${selected.id}`, { method: 'DELETE', headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to delete'); }
            fetchCustomers(); setIsDeleteOpen(false); setSelected(null);
        } catch (err) { setError(err.message); }
        finally { setDeleteLoading(false); }
    };

    const paginated = customers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login', { replace: true }); };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col pt-14 md:pt-0 md:pl-60">
                <Header activeTab="customers" onLogout={handleLogout} />
                <main className="flex-1 flex flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">
                        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-red-600 dark:text-red-400">{error}</p></div>}

                        <PageHeader title="Migrated Customers" description="Bank customers created through migration jobs." buttonText="Add Customer" buttonIcon="person_add" onButtonClick={() => setIsAddOpen(true)} />
                        <SearchBar searchTerm={searchTerm} onSearchChange={t => { setSearchTerm(t); setCurrentPage(1); }} placeholder="Search by name, email, city or status..." />

                        <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                            {loading ? (
                                <div className="flex items-center justify-center py-20"><span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                                                {['Customer', 'Contact', 'Location', 'Type', 'Status', 'Actions'].map(h => (
                                                    <th key={h} className={`px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                                            {paginated.length > 0 ? paginated.map(c => (
                                                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-9 rounded-full bg-cover bg-center shrink-0"
                                                                style={{ backgroundImage: `url('https://ui-avatars.com/api/?name=${encodeURIComponent(c.first_name + ' ' + c.last_name)}&background=135bec&color=fff&size=128')` }} />
                                                            <div>
                                                                <p className="text-sm font-bold text-[#0d121b] dark:text-white">{c.first_name} {c.last_name}</p>
                                                                <p className="text-xs text-[#4c669a] dark:text-gray-400">DOB: {c.date_of_birth}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-[#0d121b] dark:text-white">{c.email}</p>
                                                        <p className="text-xs text-[#4c669a] dark:text-gray-400">{c.phone_masked}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">{c.city}, {c.country}</td>
                                                    <td className="px-6 py-4"><span className="text-xs font-semibold text-[#4c669a] dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{c.customer_type}</span></td>
                                                    <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusClasses[c.status] ?? statusClasses.INACTIVE}`}>{c.status}</span></td>
                                                    <td className="px-6 py-4 text-right">
                                                        <ActionMenu
                                                            onView={() => { setSelected(c); setIsViewOpen(true); }}
                                                            onEdit={() => { setSelected(c); setIsUpdateOpen(true); }}
                                                            onDelete={() => { setSelected(c); setIsDeleteOpen(true); }}
                                                        />
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No customers found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {!loading && customers.length > ITEMS_PER_PAGE && (
                            <Pagination currentPage={currentPage} totalItems={customers.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
                        )}
                    </div>
                </main>
                <Footer />
            </div>

            <AddCustomerModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onCreated={fetchCustomers} />
            <UpdateCustomerModal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} onUpdated={fetchCustomers} customer={selected} />
            <ViewCustomerModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} customer={selected} />
            <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete}
                title="Delete Customer" message={`Delete "${selected?.first_name} ${selected?.last_name}"? Their accounts will also be removed.`}
                confirmText="Delete Customer" cancelText="Cancel" variant="danger" loading={deleteLoading} />
        </div>
    );
};

export default CustomersPage;
