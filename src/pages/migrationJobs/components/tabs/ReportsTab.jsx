import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';

const API = 'http://localhost:8000';

const typeIcon = { summary: 'summarize', detailed: 'article', validation: 'rule' };
const typeColor = {
    summary:    'text-primary bg-primary/10',
    detailed:   'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
    validation: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
};

const fmt = n => (n ?? 0).toLocaleString();

const ReportsTab = ({ job }) => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [generateError, setGenerateError] = useState('');
    const [generateResult, setGenerateResult] = useState(null);
    const [reportType, setReportType] = useState('summary');
    const [viewingId, setViewingId] = useState(null);
    const [viewContent, setViewContent] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

    const authCheck = r => {
        if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return false; }
        return true;
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/migration-reports/by-job/${job.id}`, { headers: headers() });
            if (!authCheck(r)) return;
            if (r.ok) setReports(await r.json());
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchReports(); }, [job.id]);

    const handleGenerate = async () => {
        setGenerating(true); setGenerateError(''); setGenerateResult(null);
        try {
            const r = await fetch(
                `${API}/migration-reports/generate/${job.id}?report_type=${reportType}&report_format=json`,
                { method: 'POST', headers: headers() }
            );
            if (!authCheck(r)) return;
            const data = await r.json();
            if (!r.ok) throw new Error(data.detail || 'Report generation failed');
            setGenerateResult(data);
            fetchReports();
        } catch (err) { setGenerateError(err.message); }
        finally { setGenerating(false); }
    };

    const handleView = async (id) => {
        if (viewingId === id) { setViewingId(null); setViewContent(null); return; }
        setViewingId(id); setViewContent(null); setViewLoading(true);
        try {
            const r = await fetch(`${API}/migration-reports/${id}/content`, { headers: headers() });
            if (!authCheck(r)) return;
            if (r.ok) setViewContent(await r.json());
            else { const d = await r.json(); setViewContent({ error: d.detail }); }
        } catch { setViewContent({ error: 'Failed to load report content' }); }
        finally { setViewLoading(false); }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await fetch(`${API}/migration-reports/${deleteTarget.id}`, { method: 'DELETE', headers: headers() });
            if (viewingId === deleteTarget.id) { setViewingId(null); setViewContent(null); }
            setDeleteTarget(null); fetchReports();
        } finally { setDeleteLoading(false); }
    };

    const canGenerate = job.status === 'completed' || job.status === 'failed';

    return (
        <div className="space-y-4">
            {/* Generate panel */}
            <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h3 className="text-sm font-bold text-[#0d121b] dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-base">summarize</span>
                            Generate Report
                        </h3>
                        <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-0.5">
                            {canGenerate
                                ? 'Job is finished — generate a report to capture the outcome.'
                                : `Reports are available after the job completes. Current status: ${job.status}.`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={reportType}
                            onChange={e => setReportType(e.target.value)}
                            disabled={!canGenerate || generating}
                            className="px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm outline-none focus:border-primary disabled:opacity-50"
                        >
                            <option value="summary">Summary</option>
                            <option value="detailed">Detailed</option>
                            <option value="validation">Validation</option>
                        </select>
                        <button
                            onClick={handleGenerate}
                            disabled={!canGenerate || generating}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {generating
                                ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Generating...</>
                                : <><span className="material-symbols-outlined text-sm">add_chart</span>Generate</>}
                        </button>
                    </div>
                </div>

                {generateError && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                        <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                        <p className="text-xs text-red-600 dark:text-red-400">{generateError}</p>
                    </div>
                )}

                {/* Generation result summary */}
                {generateResult && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                Report #{generateResult.report_id} generated ({generateResult.report_type})
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: 'Job Status', value: generateResult.job_status?.toUpperCase(), cls: 'text-primary' },
                                { label: 'Successful', value: fmt(generateResult.successful_records), cls: 'text-emerald-600 dark:text-emerald-400' },
                                { label: 'Failed', value: fmt(generateResult.failed_records), cls: 'text-red-500 dark:text-red-400' },
                                { label: 'Size', value: `${(generateResult.file_size_bytes / 1024).toFixed(1)} KB`, cls: 'text-gray-600 dark:text-gray-300' },
                            ].map(({ label, value, cls }) => (
                                <div key={label} className="text-center">
                                    <p className={`text-lg font-black ${cls}`}>{value}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Reports list */}
            <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#cfd7e7] dark:border-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">folder_open</span>
                    <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Generated Reports</h3>
                    <span className="text-xs text-gray-400 ml-1">({reports.length})</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-sm">
                        <span className="material-symbols-outlined text-4xl block mb-2 text-gray-300 dark:text-gray-600">summarize</span>
                        No reports yet. Generate one above once the job completes.
                    </div>
                ) : (
                    <div className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                        {reports.map(rp => {
                            const rtype = rp.report_type?.toLowerCase?.() ?? 'summary';
                            const isViewing = viewingId === rp.id;
                            return (
                                <div key={rp.id}>
                                    <div className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold ${typeColor[rtype] ?? typeColor.summary}`}>
                                            <span className="material-symbols-outlined text-sm">{typeIcon[rtype] ?? 'description'}</span>
                                            {rp.report_type}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">{rp.report_file_path}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {rp.format?.toUpperCase()} · {(rp.file_size / 1024).toFixed(1)} KB
                                                {rp.datetime ? ` · ${new Date(rp.datetime).toLocaleString()}` : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => handleView(rp.id)}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isViewing ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'}`}
                                            >
                                                <span className="material-symbols-outlined text-sm">{isViewing ? 'visibility_off' : 'visibility'}</span>
                                                {isViewing ? 'Hide' : 'View'}
                                            </button>
                                            <button onClick={() => setDeleteTarget(rp)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>

                                    {isViewing && (
                                        <div className="px-5 pb-5 bg-gray-50 dark:bg-gray-900/50">
                                            {viewLoading ? (
                                                <div className="flex items-center gap-2 py-4 text-xs text-gray-400">
                                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                                    Loading report content...
                                                </div>
                                            ) : viewContent?.error ? (
                                                <div className="py-3 text-xs text-red-500 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">error</span>
                                                    {viewContent.error}
                                                </div>
                                            ) : viewContent ? (
                                                <ReportContentViewer content={viewContent} />
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Delete Report" message={`Delete the ${deleteTarget?.report_type} report? The file on disk will remain.`}
                confirmText="Delete" cancelText="Cancel" variant="danger" loading={deleteLoading}
            />
        </div>
    );
};

const Stat = ({ label, value, cls = 'text-[#0d121b] dark:text-white' }) => (
    <div className="text-center bg-white dark:bg-gray-900 rounded-xl p-3 border border-[#e7ebf3] dark:border-gray-700">
        <p className={`text-xl font-black ${cls}`}>{(value ?? 0).toLocaleString()}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
);

const ReportContentViewer = ({ content }) => {
    const { job, counts, validation, duplicates, failed_records } = content;
    return (
        <div className="space-y-4 pt-4">
            {/* Job info */}
            {job && (
                <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Job</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-[#e7ebf3] dark:border-gray-700 col-span-2">
                            <p className="text-sm font-bold text-[#0d121b] dark:text-white truncate">{job.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">ID #{job.id} · Status: <span className="font-semibold uppercase">{job.status}</span></p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-[#e7ebf3] dark:border-gray-700">
                            <p className="text-xs text-gray-400">Started</p>
                            <p className="text-xs font-semibold text-[#0d121b] dark:text-white mt-0.5">{job.started_at ? new Date(job.started_at).toLocaleString() : '—'}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-[#e7ebf3] dark:border-gray-700">
                            <p className="text-xs text-gray-400">Completed</p>
                            <p className="text-xs font-semibold text-[#0d121b] dark:text-white mt-0.5">{job.completed_at ? new Date(job.completed_at).toLocaleString() : '—'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Record counts */}
            {counts && (
                <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Record Counts</p>
                    <div className="grid grid-cols-3 gap-3">
                        <Stat label="Total" value={counts.total_records} />
                        <Stat label="Successful" value={counts.successful_records} cls="text-emerald-600 dark:text-emerald-400" />
                        <Stat label="Failed" value={counts.failed_records} cls="text-red-500 dark:text-red-400" />
                    </div>
                </div>
            )}

            {/* Validation */}
            {validation && (
                <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Validation</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Stat label="Total Issues" value={validation.total_issues} />
                        <Stat label="Errors" value={validation.errors} cls="text-red-500 dark:text-red-400" />
                        <Stat label="Warnings" value={validation.warnings} cls="text-amber-600 dark:text-amber-400" />
                        <Stat label="Dup. Groups" value={duplicates?.groups_detected} />
                    </div>
                    {validation.by_type && Object.keys(validation.by_type).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {Object.entries(validation.by_type).map(([k, v]) => (
                                <span key={k} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                    {k}: {v}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Failed records (detailed/validation reports) */}
            {failed_records && failed_records.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Failed Records <span className="font-normal normal-case">(up to 100)</span>
                    </p>
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-[#e7ebf3] dark:border-gray-700 divide-y divide-[#e7ebf3] dark:divide-gray-700">
                        {failed_records.map(fr => (
                            <div key={fr.record_id} className="px-3 py-2 bg-white dark:bg-gray-900 flex gap-3 text-xs">
                                <span className="font-mono text-gray-400 shrink-0">#{fr.record_id}</span>
                                <span className="text-red-500 dark:text-red-400">{fr.error_message || '—'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsTab;
