import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import JobStatusBadge from './components/JobStatusBadge';
import SetupTab from './components/tabs/SetupTab';
import RecordsTab from './components/tabs/RecordsTab';
import ValidationTab from './components/tabs/ValidationTab';
import ReportsTab from './components/tabs/ReportsTab';

const API = 'http://localhost:8000';

const PIPELINE_STAGES = ['PENDING', 'MAPPING', 'VALIDATING', 'PREVIEWING', 'EXECUTING', 'COMPLETED'];

const TABS = [
    { key: 'setup',      label: 'Setup',      icon: 'settings'     },
    { key: 'records',    label: 'Records',    icon: 'table_rows'   },
    { key: 'validation', label: 'Validation', icon: 'rule'         },
    { key: 'reports',    label: 'Reports',    icon: 'summarize'    },
];

const MigrationJobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('setup');
    const [startMappingLoading, setStartMappingLoading] = useState(false);
    const [startValidationLoading, setStartValidationLoading] = useState(false);
    const [startExecutionLoading, setStartExecutionLoading] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

    const fetchJob = async () => {
        setLoading(true);
        setError('');
        try {
            const r = await fetch(`${API}/migration-jobs/${id}`, { headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) throw new Error('Migration job not found');
            setJob(await r.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJob(); }, [id]);

    const handleStartMapping = async () => {
        setStartMappingLoading(true);
        setError('');
        try {
            const r = await fetch(`${API}/migration-jobs/${id}/start-mapping`, { method: 'POST', headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to start mapping'); }
            await fetchJob();
            setActiveTab('records');
        } catch (err) {
            setError(err.message);
        } finally {
            setStartMappingLoading(false);
        }
    };

    const handleStartExecution = async () => {
        setStartExecutionLoading(true);
        setError('');
        setExecutionResult(null);
        try {
            const r = await fetch(`${API}/migration-jobs/${id}/start-execution`, { method: 'POST', headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to start execution'); }
            const result = await r.json();
            setExecutionResult(result);
            await fetchJob();
        } catch (err) {
            setError(err.message);
        } finally {
            setStartExecutionLoading(false);
        }
    };

    const handleStartValidation = async () => {
        setStartValidationLoading(true);
        setError('');
        try {
            const r = await fetch(`${API}/migration-jobs/${id}/start-validation`, { method: 'POST', headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to start validation'); }
            await fetchJob();
        } catch (err) {
            setError(err.message);
        } finally {
            setStartValidationLoading(false);
        }
    };

    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login', { replace: true }); };

    const stageIndex = job ? PIPELINE_STAGES.indexOf(job.status?.toUpperCase()) : -1;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <Header activeTab="migration-jobs" onLogout={handleLogout} />
                <main className="flex-1 flex flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">

                        {/* Back */}
                        <button onClick={() => navigate('/migration-jobs')} className="flex items-center gap-1 text-sm text-[#4c669a] dark:text-gray-400 hover:text-primary transition-colors w-fit">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>Back to Migration Jobs
                        </button>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-24">
                                <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
                            </div>
                        ) : job && (
                            <>
                                {/* Job header card */}
                                <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 p-6 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary">work</span>
                                            </div>
                                            <div>
                                                <h1 className="text-xl font-black text-[#0d121b] dark:text-white tracking-tight">{job.name}</h1>
                                                <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-0.5">
                                                Job #{job.id} · Created {new Date(job.created_at).toLocaleDateString()}
                                                {job.destination_schema_id && <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Schema #{job.destination_schema_id}</span>}
                                            </p>
                                            </div>
                                        </div>
                                        <JobStatusBadge status={job.status} />
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-[#e7ebf3] dark:border-gray-800">
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-[#0d121b] dark:text-white">{job.total_records.toLocaleString()}</p>
                                            <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-0.5">Total Records</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{job.successful_records.toLocaleString()}</p>
                                            <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-0.5">Successful</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-red-500 dark:text-red-400">{job.failed_records.toLocaleString()}</p>
                                            <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-0.5">Failed</p>
                                        </div>
                                    </div>

                                    {/* Pipeline progress */}
                                    <div className="mt-5 pt-5 border-t border-[#e7ebf3] dark:border-gray-800">
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Pipeline Progress</p>
                                        <div className="flex items-center gap-0">
                                            {PIPELINE_STAGES.map((stage, i) => {
                                                const done = i < stageIndex;
                                                const active = i === stageIndex;
                                                const failed = job.status?.toUpperCase() === 'FAILED' && i === stageIndex;
                                                return (
                                                    <div key={stage} className="flex items-center flex-1 min-w-0">
                                                        <div className="flex flex-col items-center flex-1">
                                                            <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                                                ${failed ? 'bg-red-500 text-white' :
                                                                  done ? 'bg-emerald-500 text-white' :
                                                                  active ? 'bg-primary text-white ring-4 ring-primary/20' :
                                                                  'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                                                {failed ? <span className="material-symbols-outlined text-sm">close</span> :
                                                                 done ? <span className="material-symbols-outlined text-sm">check</span> :
                                                                 i + 1}
                                                            </div>
                                                            <span className={`text-[10px] font-semibold mt-1 text-center ${active ? 'text-primary' : done ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                                                                {stage}
                                                            </span>
                                                        </div>
                                                        {i < PIPELINE_STAGES.length - 1 && (
                                                            <div className={`h-0.5 flex-1 mb-4 ${done ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {job.error_message && (
                                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                                            <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                                            <p className="text-xs text-red-600 dark:text-red-400">{job.error_message}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-[#cfd7e7] dark:border-gray-800">
                                    <nav className="flex gap-1">
                                        {TABS.map(tab => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                                                    activeTab === tab.key
                                                        ? 'border-primary text-primary'
                                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                                {tab.label}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Tab content */}
                                <div>
                                    {activeTab === 'setup' && <SetupTab job={job} onJobUpdated={fetchJob} onStartMapping={handleStartMapping} startMappingLoading={startMappingLoading} />}
                                    {activeTab === 'records' && <RecordsTab job={job} onStartExecution={handleStartExecution} startExecutionLoading={startExecutionLoading} executionResult={executionResult} />}
                                    {activeTab === 'validation' && <ValidationTab job={job} onStartValidation={handleStartValidation} startValidationLoading={startValidationLoading} />}
                                    {activeTab === 'reports' && <ReportsTab job={job} />}
                                </div>
                            </>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default MigrationJobDetailPage;