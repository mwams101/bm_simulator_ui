import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AddMigrationJobModal from './components/AddMigrationJobModal';
import JobStatusBadge from './components/JobStatusBadge';

const ITEMS_PER_PAGE = 10;

const MigrationJobsPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => { fetchJobs(); }, [searchTerm]);

    const fetchJobs = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/migration-jobs', {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch migration jobs');
            const data = await response.json();
            const filtered = searchTerm
                ? data.filter(j =>
                    j.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    j.status?.toLowerCase().includes(searchTerm.toLowerCase()))
                : data;
            setJobs(filtered);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedJob) return;
        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/migration-jobs/${selectedJob.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to delete job');
            }
            fetchJobs();
            setIsDeleteDialogOpen(false);
            setSelectedJob(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const paginated = jobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login', { replace: true }); };

    const formatDate = (dt) => dt ? new Date(dt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col pt-14 md:pt-0 md:pl-60">
                <Header activeTab="migration-jobs" onLogout={handleLogout} />
                <main className="flex-1 flex flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <PageHeader
                            title="Migration Jobs"
                            description="Manage and monitor your data migration pipeline jobs."
                            buttonText="New Migration Job"
                            buttonIcon="add_box"
                            onButtonClick={() => setIsAddModalOpen(true)}
                        />

                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={t => { setSearchTerm(t); setCurrentPage(1); }}
                            placeholder="Search by job name or status..."
                        />

                        <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                                                {['Job Name', 'Status', 'Records', 'Success', 'Failed', 'Created At', 'Actions'].map(h => (
                                                    <th key={h} className={`px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                                            {paginated.length > 0 ? paginated.map(job => (
                                                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => navigate(`/migration-jobs/${job.id}`)}
                                                            className="flex items-center gap-2 text-left group/name"
                                                        >
                                                            <span className="material-symbols-outlined text-primary">work</span>
                                                            <span className="text-sm font-bold text-[#0d121b] dark:text-white group-hover/name:text-primary transition-colors">{job.name}</span>
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4"><JobStatusBadge status={job.status} /></td>
                                                    <td className="px-6 py-4 text-sm text-[#4c669a] dark:text-gray-400">{job.total_records.toLocaleString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{job.successful_records.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-medium text-red-500 dark:text-red-400">{job.failed_records.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(job.created_at)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => navigate(`/migration-jobs/${job.id}`)}
                                                                className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                                title="View details"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">open_in_new</span>
                                                            </button>
                                                            <button
                                                                onClick={() => { setSelectedJob(job); setIsDeleteDialogOpen(true); }}
                                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                                title="Delete job"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No migration jobs found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {!loading && jobs.length > ITEMS_PER_PAGE && (
                            <Pagination currentPage={currentPage} totalItems={jobs.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
                        )}

                        <div className="border border-blue-100 dark:border-primary/20 bg-blue-50/50 dark:bg-primary/5 rounded-xl p-5 flex gap-4 items-start">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                                <span className="material-symbols-outlined">info</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#0d121b] dark:text-blue-100">Pipeline Stages</h4>
                                <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-1 leading-relaxed">
                                    Each job progresses through: <span className="font-bold text-primary">Pending → Mapping → Validating → Previewing → Executing → Completed</span>. Click a job name to manage its pipeline.
                                </p>
                            </div>
                        </div>

                    </div>
                </main>
                <Footer />
            </div>

            <AddMigrationJobModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onJobCreated={fetchJobs} />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Migration Job"
                message={`Are you sure you want to delete "${selectedJob?.name}"? All associated records will be lost.`}
                confirmText="Delete Job"
                cancelText="Cancel"
                variant="danger"
                loading={deleteLoading}
            />
        </div>
    );
};

export default MigrationJobsPage;