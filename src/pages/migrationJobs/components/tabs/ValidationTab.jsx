import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8000';

const severityClasses = {
    ERROR:   'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    WARNING: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    INFO:    'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
};

const resolutionClasses = {
    SKIP:          'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    MERGE:         'bg-primary/10 text-primary',
    MANUAL_REVIEW: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
};

const ValidationTab = ({ job, onStartValidation, startValidationLoading }) => {
    const navigate = useNavigate();
    const [validations, setValidations] = useState([]);
    const [duplicates, setDuplicates] = useState([]);
    const [loadingV, setLoadingV] = useState(true);
    const [loadingD, setLoadingD] = useState(true);

    useEffect(() => {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

        const fetchValidations = async () => {
            setLoadingV(true);
            try {
                const r = await fetch(`${API}/validation-results/by-job/${job.id}`, { headers });
                if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
                if (r.ok) setValidations(await r.json());
            } finally { setLoadingV(false); }
        };

        const fetchDuplicates = async () => {
            setLoadingD(true);
            try {
                const r = await fetch(`${API}/duplicate-detections/by-job/${job.id}`, { headers });
                if (r.ok) setDuplicates(await r.json());
            } finally { setLoadingD(false); }
        };

        fetchValidations();
        fetchDuplicates();
    }, [job.id]);

    const updateResolution = async (dupId, resolution) => {
        const token = localStorage.getItem('token');
        await fetch(`${API}/duplicate-detections/${dupId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ resolution }),
        });
        setDuplicates(prev => prev.map(d => d.id === dupId ? { ...d, resolution } : d));
    };

    return (
        <div className="space-y-6">
            {/* Validation Results */}
            <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#cfd7e7] dark:border-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">rule</span>
                    <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Validation Results</h3>
                    <span className="text-xs text-gray-400 ml-1">({validations.length})</span>
                </div>
                {loadingV ? (
                    <div className="flex justify-center py-10"><span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span></div>
                ) : validations.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 text-sm">
                        <span className="material-symbols-outlined text-4xl block mb-2 text-gray-300 dark:text-gray-600">check_circle</span>
                        No validation issues found.
                    </div>
                ) : (
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                            {['Row #', 'Field', 'Type', 'Severity', 'Original Value', 'Suggested', 'Message'].map(h => (
                                <th key={h} className="px-4 py-3 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                            {validations.map(v => (
                                <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                    <td className="px-4 py-2.5 font-mono text-[#0d121b] dark:text-white">#{v.record_number}</td>
                                    <td className="px-4 py-2.5 font-mono text-primary">{v.field_name}</td>
                                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{v.validation_type}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severityClasses[v.severity?.toUpperCase()] ?? severityClasses.INFO}`}>{v.severity}</span>
                                    </td>
                                    <td className="px-4 py-2.5 font-mono text-red-500 dark:text-red-400 max-w-[120px] truncate">{v.original_value || '—'}</td>
                                    <td className="px-4 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 max-w-[120px] truncate">{v.suggested_value || '—'}</td>
                                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{v.error_message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Duplicate Detections */}
            <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#cfd7e7] dark:border-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500">content_copy</span>
                    <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Duplicate Detections</h3>
                    <span className="text-xs text-gray-400 ml-1">({duplicates.length})</span>
                </div>
                {loadingD ? (
                    <div className="flex justify-center py-10"><span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span></div>
                ) : duplicates.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 text-sm">
                        <span className="material-symbols-outlined text-4xl block mb-2 text-gray-300 dark:text-gray-600">content_copy</span>
                        No duplicates detected.
                    </div>
                ) : (
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                            {['Key Hash', 'Count', 'Record IDs', 'Detected At', 'Resolution'].map(h => (
                                <th key={h} className="px-4 py-3 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                            {duplicates.map(d => (
                                <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                    <td className="px-4 py-2.5 font-mono text-gray-500 dark:text-gray-400 max-w-[120px] truncate">{d.duplicate_key_hash}</td>
                                    <td className="px-4 py-2.5 font-bold text-[#0d121b] dark:text-white">{d.record_count}</td>
                                    <td className="px-4 py-2.5 font-mono text-gray-500 dark:text-gray-400 max-w-[150px] truncate">{d.record_ids}</td>
                                    <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{d.detected_at ? new Date(d.detected_at).toLocaleDateString() : '—'}</td>
                                    <td className="px-4 py-2.5">
                                        <select
                                            value={d.resolution}
                                            onChange={e => updateResolution(d.id, e.target.value)}
                                            className={`px-2 py-1 rounded-lg text-xs font-semibold border-0 outline-none cursor-pointer ${resolutionClasses[d.resolution?.toUpperCase()] ?? resolutionClasses.SKIP}`}
                                        >
                                            <option value="SKIP">Skip</option>
                                            <option value="MERGE">Merge</option>
                                            <option value="MANUAL_REVIEW">Manual Review</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {job.status === 'validating' && (
                <div className="flex justify-end">
                    <button
                        onClick={onStartValidation}
                        disabled={startValidationLoading}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/25 hover:bg-amber-500/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {startValidationLoading
                            ? <><span className="material-symbols-outlined animate-spin">progress_activity</span>Running Validation...</>
                            : <><span className="material-symbols-outlined">rule</span>Start Validation</>}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ValidationTab;