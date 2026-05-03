import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';

const API = 'http://localhost:8000';

const reportTypeIcon = { SUMMARY: 'summarize', DETAILED: 'article', VALIDATION: 'rule' };
const formatIcon = { PDF: 'picture_as_pdf', CSV: 'table_chart', JSON: 'data_object' };

const ReportsTab = ({ job }) => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ report_type: 'SUMMARY', format: 'PDF', report_file_path: '', file_size: 0 });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

    const fetchReports = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/migration-reports/by-job/${job.id}`, { headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (r.ok) setReports(await r.json());
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchReports(); }, [job.id]);

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setFormError('');
        try {
            const r = await fetch(`${API}/migration-reports`, {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ ...form, migration_job_id: job.id, file_size: Number(form.file_size) }),
            });
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to create report'); }
            setShowForm(false);
            setForm({ report_type: 'SUMMARY', format: 'PDF', report_file_path: '', file_size: 0 });
            fetchReports();
        } catch (err) { setFormError(err.message); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await fetch(`${API}/migration-reports/${deleteTarget.id}`, { method: 'DELETE', headers: headers() });
            setDeleteTarget(null); fetchReports();
        } finally { setDeleteLoading(false); }
    };

    return (
        <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#cfd7e7] dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">summarize</span>
                    <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Migration Reports</h3>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>Generate Report
                </button>
            </div>

            {showForm && (
                <div className="p-5 border-b border-[#cfd7e7] dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {formError && <p className="text-xs text-red-500">{formError}</p>}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Report Type</label>
                                <select required className="w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm outline-none focus:border-primary" value={form.report_type} onChange={e => setForm(p => ({ ...p, report_type: e.target.value }))}>
                                    <option value="SUMMARY">Summary</option>
                                    <option value="DETAILED">Detailed</option>
                                    <option value="VALIDATION">Validation</option>
                                </select></div>
                            <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Format</label>
                                <select required className="w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm outline-none focus:border-primary" value={form.format} onChange={e => setForm(p => ({ ...p, format: e.target.value }))}>
                                    <option value="PDF">PDF</option>
                                    <option value="CSV">CSV</option>
                                    <option value="JSON">JSON</option>
                                </select></div>
                            <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">File Path</label>
                                <input required className="w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm outline-none focus:border-primary" placeholder="/reports/job_1_summary.pdf" value={form.report_file_path} onChange={e => setForm(p => ({ ...p, report_file_path: e.target.value }))} /></div>
                            <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">File Size (bytes)</label>
                                <input type="number" min="0" className="w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm outline-none focus:border-primary" value={form.file_size} onChange={e => setForm(p => ({ ...p, file_size: e.target.value }))} /></div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => { setShowForm(false); setFormError(''); }} className="px-4 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                            <button type="submit" disabled={submitting} className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1">
                                {submitting && <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>}Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12"><span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span></div>
            ) : reports.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-gray-300 dark:text-gray-600">summarize</span>
                    No reports generated yet.
                </div>
            ) : (
                <table className="w-full text-left text-xs">
                    <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                        {['Type', 'Format', 'File Path', 'Size', 'Generated', ''].map(h => (
                            <th key={h} className="px-4 py-3 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                        {reports.map(rp => (
                            <tr key={rp.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-primary text-sm">{reportTypeIcon[rp.report_type] ?? 'description'}</span>
                                        <span className="font-medium text-[#0d121b] dark:text-white">{rp.report_type}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-gray-400 text-sm">{formatIcon[rp.format] ?? 'description'}</span>
                                        <span className="text-gray-500 dark:text-gray-400">{rp.format}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{rp.report_file_path}</td>
                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{(rp.file_size / 1024).toFixed(1)} KB</td>
                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{rp.datetime ? new Date(rp.datetime).toLocaleDateString() : '—'}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => setDeleteTarget(rp)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Delete Report" message={`Delete the ${deleteTarget?.report_type} report?`}
                confirmText="Delete" cancelText="Cancel" variant="danger" loading={deleteLoading} />
        </div>
    );
};

export default ReportsTab;