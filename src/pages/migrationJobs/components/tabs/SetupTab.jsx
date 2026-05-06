import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';

const API = 'http://localhost:8000';

const SectionHeader = ({ title, icon, onAdd, addLabel }) => (
    <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">{icon}</span>
            <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">{title}</h3>
        </div>
        {onAdd && (
            <button onClick={onAdd} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>{addLabel}
            </button>
        )}
    </div>
);

const EmptyRow = ({ cols, message }) => (
    <tr><td colSpan={cols} className="px-4 py-6 text-center text-xs text-gray-400">{message}</td></tr>
);

// ── Uploaded Files ──────────────────────────────────────────────────────────
const ACCEPTED = '.csv,.xlsx,.xls';

const UploadedFilesSection = ({ jobId }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const authHeader = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/uploaded-files`, { headers: authHeader() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            const data = await r.json();
            setFiles(data.filter(f => f.migration_job_id === jobId && !f.is_deleted));
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchFiles(); }, [jobId]);

    const uploadFile = async (file) => {
        setUploading(true); setUploadError('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            const r = await fetch(`${API}/uploaded-files/upload/${jobId}`, {
                method: 'POST',
                headers: authHeader(),
                body: formData,
            });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Upload failed'); }
            fetchFiles();
        } catch (err) { setUploadError(err.message); }
        finally { setUploading(false); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) uploadFile(file);
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await fetch(`${API}/uploaded-files/${deleteTarget.id}`, { method: 'DELETE', headers: authHeader() });
            setDeleteTarget(null); fetchFiles();
        } finally { setDeleteLoading(false); }
    };

    return (
        <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 p-5">
            <SectionHeader title="Source Files" icon="upload_file" />

            {/* Drop zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`mb-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 cursor-pointer transition-colors
                    ${dragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-[#cfd7e7] dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900/50'}`}
            >
                {uploading ? (
                    <>
                        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                        <p className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Uploading...</p>
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
                        <p className="text-sm font-bold text-[#0d121b] dark:text-white">Drop a file here or click to browse</p>
                        <p className="text-xs text-[#4c669a] dark:text-gray-400">Accepted formats: CSV, XLSX, XLS</p>
                    </>
                )}
            </div>

            <input ref={fileInputRef} type="file" accept={ACCEPTED} className="hidden" onChange={handleFileChange} />

            {uploadError && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                    <p className="text-xs text-red-600 dark:text-red-400">{uploadError}</p>
                </div>
            )}

            <table className="w-full text-left text-xs">
                <thead><tr className="border-b border-[#cfd7e7] dark:border-gray-700">
                    {['Filename', 'Type', 'Size', 'Uploaded', 'Expires', ''].map(h => (
                        <th key={h} className="px-3 py-2 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{h}</th>
                    ))}
                </tr></thead>
                <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                    {loading
                        ? <tr><td colSpan={6} className="px-3 py-4 text-center text-gray-400"><span className="material-symbols-outlined animate-spin">progress_activity</span></td></tr>
                        : files.length > 0 ? files.map(f => (
                            <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                <td className="px-3 py-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-primary text-sm">description</span>
                                        <span className="font-medium text-[#0d121b] dark:text-white">{f.original_filename}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">{f.file_type}</span></td>
                                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400">{(f.file_size / 1024).toFixed(1)} KB</td>
                                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400">{new Date(f.upload_timestamp).toLocaleDateString()}</td>
                                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400">{new Date(f.expiry_timestamp).toLocaleDateString()}</td>
                                <td className="px-3 py-2.5 text-right">
                                    <button onClick={() => setDeleteTarget(f)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </td>
                            </tr>
                        )) : <EmptyRow cols={6} message="No files uploaded yet. Drop a CSV or Excel file above." />}
                </tbody>
            </table>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Remove File" message={`Remove "${deleteTarget?.original_filename}" from this job? The file will be permanently deleted.`}
                confirmText="Remove" cancelText="Cancel" variant="danger" loading={deleteLoading} />
        </div>
    );
};

// ── Field Mappings ──────────────────────────────────────────────────────────
const FieldMappingsSection = ({ jobId }) => {
    const navigate = useNavigate();
    const [mappings, setMappings] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [form, setForm] = useState({ mapping_template_id: '', mapping_rules: '{"skip_empty_rows": true, "encoding": "utf-8"}' });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

    const fetchTemplates = async () => {
        try {
            const r = await fetch(`${API}/mapping-templates/`, { headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            const data = await r.json();
            if (Array.isArray(data)) setTemplates(data);
        } catch {}
    };

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/field-mappings/`, { headers: headers() });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            const data = await r.json();
            if (Array.isArray(data)) {
                const jobMappings = data.filter(m => m.migration_job_id === jobId);
                setMappings(jobMappings);
                if (jobMappings.length > 0 && !selected) setSelected(jobMappings[0]);
            }
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchTemplates(); }, []);
    useEffect(() => { fetch_(); }, [jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setFormError('');
        try {
            let rules;
            try { rules = JSON.parse(form.mapping_rules); } catch { throw new Error('Mapping rules must be valid JSON'); }
            const r = await fetch(`${API}/field-mappings`, {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ migration_job_id: jobId, mapping_template_id: Number(form.mapping_template_id), mapping_rules: rules }),
            });
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed'); }
            setShowForm(false);
            fetch_();
        } catch (err) { setFormError(err.message); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await fetch(`${API}/field-mappings/${deleteTarget.id}`, { method: 'DELETE', headers: headers() });
            setDeleteTarget(null);
            if (selected?.id === deleteTarget.id) setSelected(null);
            fetch_();
        } finally { setDeleteLoading(false); }
    };

    return (
        <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 p-5">
            <SectionHeader title="Field Mappings" icon="transform" onAdd={() => setShowForm(true)} addLabel="Add Mapping" />

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700 space-y-3">
                    {formError && <p className="text-xs text-red-500">{formError}</p>}
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Mapping Template</label>
                            <select required className="w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm outline-none focus:border-primary" value={form.mapping_template_id} onChange={e => setForm(p => ({ ...p, mapping_template_id: e.target.value }))}>
                                <option value="">Select template...</option>
                                {templates.map(t => <option key={t.id} value={t.id}>{t.template_name}</option>)}
                            </select></div>
                        <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Mapping Rules (JSON)</label>
                            <input className="w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm outline-none focus:border-primary font-mono" value={form.mapping_rules} onChange={e => setForm(p => ({ ...p, mapping_rules: e.target.value }))} /></div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => { setShowForm(false); setFormError(''); }} className="px-4 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1">
                            {submitting && <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>}Save
                        </button>
                    </div>
                </form>
            )}

            <table className="w-full text-left text-xs">
                <thead><tr className="border-b border-[#cfd7e7] dark:border-gray-700">
                    {['Template', 'Rules', 'Created', ''].map(h => <th key={h} className="px-3 py-2 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                    {loading ? <tr><td colSpan={4} className="px-3 py-4 text-center text-gray-400"><span className="material-symbols-outlined animate-spin">progress_activity</span></td></tr>
                        : mappings.length > 0 ? mappings.map(m => (
                            <tr key={m.id} className={`cursor-pointer transition-colors ${selected?.id === m.id ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-gray-900/30'}`} onClick={() => setSelected(m)}>
                                <td className="px-3 py-2.5"><span className="font-medium text-[#0d121b] dark:text-white">{templates.find(t => t.id === m.mapping_template_id)?.template_name ?? `Template #${m.mapping_template_id}`}</span></td>
                                <td className="px-3 py-2.5 font-mono text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{JSON.stringify(m.mapping_rules)}</td>
                                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400">{new Date(m.created_at).toLocaleDateString()}</td>
                                <td className="px-3 py-2.5 text-right"><button onClick={e => { e.stopPropagation(); setDeleteTarget(m); }} className="text-gray-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button></td>
                            </tr>
                        )) : <EmptyRow cols={4} message="No field mappings yet. Add one above." />}
                </tbody>
            </table>

            {selected && <FieldMappingDetailsSection mappingId={selected.id} />}

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Delete Field Mapping" message={`Delete field mapping #${deleteTarget?.id}? All associated field details will be lost.`}
                confirmText="Delete" cancelText="Cancel" variant="danger" loading={deleteLoading} />
        </div>
    );
};

// ── Field Mapping Details ───────────────────────────────────────────────────
const TRANSFORM_OPTIONS = ['none', 'uppercase', 'lowercase', 'strip', 'date_format:YYYY-MM-DD'];

const FieldMappingDetailsSection = ({ mappingId }) => {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showQuickMap, setShowQuickMap] = useState(false);
    const [quickMapHeaders, setQuickMapHeaders] = useState('');
    const [quickMapLoading, setQuickMapLoading] = useState(false);
    const [quickMapError, setQuickMapError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editError, setEditError] = useState('');
    const [form, setForm] = useState({ source_field: '', destination_field: '', field_order: 1, transformation_rule: 'none' });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

    const fetch_ = async () => {
        setLoading(true);
        try {
            const r = await fetch(`${API}/field-mapping-details`, { headers: headers() });
            const data = await r.json();
            setDetails(data.filter(d => d.field_mapping_id === mappingId).sort((a, b) => a.field_order - b.field_order));
        } finally { setLoading(false); }
    };

    useEffect(() => { fetch_(); }, [mappingId]);

    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setFormError('');
        try {
            const r = await fetch(`${API}/field-mapping-details`, {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ ...form, field_mapping_id: mappingId, field_order: Number(form.field_order) }),
            });
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed'); }
            setShowForm(false);
            setForm({ source_field: '', destination_field: '', field_order: details.length + 2, transformation_rule: 'none' });
            fetch_();
        } catch (err) { setFormError(err.message); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await fetch(`${API}/field-mapping-details/${deleteTarget.id}`, { method: 'DELETE', headers: headers() });
            setDeleteTarget(null); fetch_();
        } finally { setDeleteLoading(false); }
    };

    const startEdit = (d) => {
        setEditingId(d.id);
        setEditForm({ source_field: d.source_field, destination_field: d.destination_field, field_order: d.field_order, transformation_rule: d.transformation_rule });
        setEditError('');
        setShowForm(false);
        setShowQuickMap(false);
    };

    const cancelEdit = () => { setEditingId(null); setEditForm({}); setEditError(''); };

    const handleEditSave = async () => {
        setEditSubmitting(true); setEditError('');
        try {
            const r = await fetch(`${API}/field-mapping-details/${editingId}`, {
                method: 'PUT', headers: headers(),
                body: JSON.stringify({ field_mapping_id: mappingId, ...editForm, field_order: Number(editForm.field_order) }),
            });
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to save'); }
            cancelEdit(); fetch_();
        } catch (err) { setEditError(err.message); }
        finally { setEditSubmitting(false); }
    };

    const handleQuickMap = async () => {
        const cols = quickMapHeaders.split(',').map(c => c.trim()).filter(Boolean);
        if (cols.length === 0) { setQuickMapError('Paste at least one column name.'); return; }
        setQuickMapLoading(true); setQuickMapError('');
        const startOrder = details.length + 1;
        const results = await Promise.allSettled(
            cols.map((col, i) =>
                fetch(`${API}/field-mapping-details`, {
                    method: 'POST', headers: headers(),
                    body: JSON.stringify({
                        field_mapping_id: mappingId,
                        source_field: col,
                        destination_field: col,
                        field_order: startOrder + i,
                        transformation_rule: 'none',
                    }),
                })
            )
        );
        const failed = results.filter(r => r.status === 'rejected' || !r.value?.ok).length;
        setQuickMapLoading(false);
        if (failed > 0) setQuickMapError(`${failed} field(s) failed to create. They may already exist.`);
        else { setShowQuickMap(false); setQuickMapHeaders(''); }
        fetch_();
    };

    return (
        <div className="mt-4 ml-4 border-l-2 border-primary/20 pl-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">swap_horiz</span>
                    <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">Field Mapping Details</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => { setShowQuickMap(p => !p); setShowForm(false); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-bold hover:bg-primary/5 transition-colors">
                        <span className="material-symbols-outlined text-sm">auto_fix_high</span>Quick Map
                    </button>
                    <button onClick={() => { setShowForm(true); setShowQuickMap(false); setForm(p => ({ ...p, field_order: details.length + 1 })); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span>Add Field
                    </button>
                </div>
            </div>

            {showQuickMap && (
                <div className="mb-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 space-y-3">
                    <div>
                        <p className="text-xs font-bold text-[#0d121b] dark:text-white mb-1">Paste CSV column headers</p>
                        <p className="text-xs text-[#4c669a] dark:text-gray-400 mb-2">
                            Creates identity mappings (source = destination, no transformation) for every column you list. Use this when your CSV is already in the right format.
                        </p>
                        <textarea
                            className="w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-xs font-mono outline-none focus:border-primary resize-none"
                            rows={2}
                            placeholder="first_name,last_name,date_of_birth,email,phone_masked,address_line_1,..."
                            value={quickMapHeaders}
                            onChange={e => { setQuickMapHeaders(e.target.value); setQuickMapError(''); }}
                        />
                        {quickMapError && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{quickMapError}</p>}
                        <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-1">
                            {quickMapHeaders.split(',').filter(c => c.trim()).length} column(s) detected
                        </p>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => { setShowQuickMap(false); setQuickMapHeaders(''); setQuickMapError(''); }} className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                        <button type="button" onClick={handleQuickMap} disabled={quickMapLoading} className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1">
                            {quickMapLoading ? <><span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>Creating...</> : <><span className="material-symbols-outlined text-xs">auto_fix_high</span>Create All Mappings</>}
                        </button>
                    </div>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700 space-y-3">
                    {formError && <p className="text-xs text-red-500">{formError}</p>}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Source Field</label>
                            <input required className="w-full px-2 py-1.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-xs outline-none focus:border-primary" value={form.source_field} onChange={e => setForm(p => ({ ...p, source_field: e.target.value }))} placeholder="e.g. cust_name" /></div>
                        <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Destination Field</label>
                            <input required className="w-full px-2 py-1.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-xs outline-none focus:border-primary" value={form.destination_field} onChange={e => setForm(p => ({ ...p, destination_field: e.target.value }))} placeholder="e.g. first_name" /></div>
                        <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Order</label>
                            <input type="number" min="1" required className="w-full px-2 py-1.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-xs outline-none focus:border-primary" value={form.field_order} onChange={e => setForm(p => ({ ...p, field_order: e.target.value }))} /></div>
                        <div><label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Transformation</label>
                            <select className="w-full px-2 py-1.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-xs outline-none focus:border-primary" value={form.transformation_rule} onChange={e => setForm(p => ({ ...p, transformation_rule: e.target.value }))}>
                                {TRANSFORM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select></div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => { setShowForm(false); setFormError(''); }} className="px-3 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-3 py-1 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">Save</button>
                    </div>
                </form>
            )}

            <table className="w-full text-left text-xs">
                <thead><tr className="border-b border-[#cfd7e7] dark:border-gray-700">
                    {['#', 'Source Field', 'Destination Field', 'Transformation', ''].map(h => <th key={h} className="px-3 py-2 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                    {loading
                        ? <tr><td colSpan={5} className="px-3 py-4 text-center text-gray-400"><span className="material-symbols-outlined animate-spin">progress_activity</span></td></tr>
                        : details.length > 0 ? details.map(d => editingId === d.id ? (
                            <tr key={d.id} className="bg-primary/5 dark:bg-primary/10">
                                <td className="px-2 py-2">
                                    <input type="number" min="1" className="w-14 px-2 py-1 rounded border border-[#e7ebf3] dark:border-gray-600 dark:bg-gray-900 dark:text-white text-xs outline-none focus:border-primary" value={editForm.field_order} onChange={e => setEditForm(p => ({ ...p, field_order: e.target.value }))} />
                                </td>
                                <td className="px-2 py-2">
                                    <input className="w-full px-2 py-1 rounded border border-[#e7ebf3] dark:border-gray-600 dark:bg-gray-900 dark:text-white font-mono text-xs outline-none focus:border-primary" value={editForm.source_field} onChange={e => setEditForm(p => ({ ...p, source_field: e.target.value }))} />
                                </td>
                                <td className="px-2 py-2">
                                    <input className="w-full px-2 py-1 rounded border border-[#e7ebf3] dark:border-gray-600 dark:bg-gray-900 dark:text-white font-mono text-xs outline-none focus:border-primary" value={editForm.destination_field} onChange={e => setEditForm(p => ({ ...p, destination_field: e.target.value }))} />
                                </td>
                                <td className="px-2 py-2">
                                    <select className="w-full px-2 py-1 rounded border border-[#e7ebf3] dark:border-gray-600 dark:bg-gray-900 dark:text-white text-xs outline-none focus:border-primary" value={editForm.transformation_rule} onChange={e => setEditForm(p => ({ ...p, transformation_rule: e.target.value }))}>
                                        {TRANSFORM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </td>
                                <td className="px-2 py-2">
                                    <div className="flex items-center justify-end gap-1">
                                        {editError && <span className="text-red-500 text-xs mr-1 truncate max-w-[120px]" title={editError}>{editError}</span>}
                                        <button onClick={handleEditSave} disabled={editSubmitting} className="flex items-center gap-0.5 px-2 py-1 rounded bg-primary text-white text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
                                            {editSubmitting ? <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span> : <span className="material-symbols-outlined text-xs">check</span>}Save
                                        </button>
                                        <button onClick={cancelEdit} className="px-2 py-1 rounded text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                <td className="px-3 py-2 text-gray-400">{d.field_order}</td>
                                <td className="px-3 py-2 font-mono text-[#0d121b] dark:text-white">{d.source_field}</td>
                                <td className="px-3 py-2 font-mono text-primary">{d.destination_field}</td>
                                <td className="px-3 py-2"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{d.transformation_rule}</span></td>
                                <td className="px-3 py-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => startEdit(d)} className="text-gray-400 hover:text-primary transition-colors" title="Edit">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button onClick={() => setDeleteTarget(d)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : <EmptyRow cols={5} message="No field details yet." />}
                </tbody>
            </table>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Remove Field" message={`Remove mapping for "${deleteTarget?.source_field} → ${deleteTarget?.destination_field}"?`}
                confirmText="Remove" cancelText="Cancel" variant="danger" loading={deleteLoading} />
        </div>
    );
};

// ── Job Settings ────────────────────────────────────────────────────────────
const JobSettingsSection = ({ job, onJobUpdated, onJobDirectUpdate }) => {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [schemas, setSchemas] = useState([]);
    const [schemasError, setSchemasError] = useState('');
    const [form, setForm] = useState({ name: job.name, destination_schema_id: job.destination_schema_id ?? '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

    useEffect(() => {
        const fetchSchemas = async () => {
            try {
                const r = await fetch(`${API}/destination-schemas/`, { headers: headers() });
                if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
                if (r.ok) {
                    const data = await r.json();
                    console.log('Schemas loaded:', data);
                    setSchemas(Array.isArray(data) ? data : []);
                } else {
                    const text = await r.text();
                    console.error('Schemas fetch failed:', r.status, text);
                    setSchemasError(`Failed to load schemas (${r.status})`);
                }
            } catch (e) {
                console.error('Schemas fetch error:', e);
                setSchemasError('Could not load schemas');
            }
        };
        fetchSchemas();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const startEdit = () => {
        setForm({ name: job.name, destination_schema_id: job.destination_schema_id ?? '' });
        setError('');
        setEditing(true);
    };

    const handleSave = async () => {
        setSaving(true); setError('');
        try {
            const payload = {
                ...job,
                name: form.name,
                destination_schema_id: form.destination_schema_id !== '' ? Number(form.destination_schema_id) : null,
            };
            console.log('PUT payload:', payload);
            const r = await fetch(`${API}/migration-jobs/${job.id}`, {
                method: 'PUT', headers: headers(),
                body: JSON.stringify(payload),
            });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            const responseData = await r.json();
            console.log('PUT response:', responseData);
            if (!r.ok) { throw new Error(responseData.detail || JSON.stringify(responseData) || 'Failed to save'); }
            setEditing(false);
            onJobDirectUpdate?.(responseData);
        } catch (err) { console.error('Save job error:', err); setError(err.message); }
        finally { setSaving(false); }
    };

    const currentSchema = schemas.find(s => s.id === job.destination_schema_id);

    return (
        <div className="bg-white dark:bg-background-dark rounded-xl border border-[#cfd7e7] dark:border-gray-800 p-5">
            <SectionHeader title="Job Settings" icon="tune" />

            {editing ? (
                <div className="space-y-4">
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Job Name</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm outline-none focus:border-primary"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Destination Schema</label>
                            {schemasError ? (
                                <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{schemasError}</p>
                            ) : (
                                <select
                                    className="w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm outline-none focus:border-primary"
                                    value={form.destination_schema_id}
                                    onChange={e => setForm(p => ({ ...p, destination_schema_id: e.target.value }))}
                                >
                                    <option value="">No schema selected</option>
                                    {schemas.map(s => <option key={s.id} value={s.id}>{s.schema_name}</option>)}
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => { setEditing(false); setError(''); }} className="px-4 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                        <button type="button" onClick={handleSave} disabled={saving || !form.name.trim()} className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1">
                            {saving && <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>}Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 flex-1">
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Job Name</p>
                            <p className="text-sm font-semibold text-[#0d121b] dark:text-white">{job.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Destination Schema</p>
                            {job.destination_schema_id ? (
                                <p className="text-sm font-semibold text-[#0d121b] dark:text-white">
                                    {currentSchema ? currentSchema.schema_name : `Schema #${job.destination_schema_id}`}
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-semibold">#{job.destination_schema_id}</span>
                                </p>
                            ) : (
                                <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">warning</span>Not set — required for validation
                                </p>
                            )}
                        </div>
                    </div>
                    <button onClick={startEdit} className="ml-4 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>Edit
                    </button>
                </div>
            )}
        </div>
    );
};

// ── Main SetupTab ───────────────────────────────────────────────────────────
const SetupTab = ({ job, onJobUpdated, onJobDirectUpdate, onStartMapping, startMappingLoading }) => (
    <div className="space-y-6">
        <JobSettingsSection job={job} onJobUpdated={onJobUpdated} onJobDirectUpdate={onJobDirectUpdate} />
        <UploadedFilesSection jobId={job.id} />
        <FieldMappingsSection jobId={job.id} />

        {job.status === 'pending' && (
            <div className="flex justify-end">
                <button
                    onClick={onStartMapping}
                    disabled={startMappingLoading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {startMappingLoading
                        ? <><span className="material-symbols-outlined animate-spin">progress_activity</span>Starting Mapping...</>
                        : <><span className="material-symbols-outlined">play_arrow</span>Start Mapping</>}
                </button>
            </div>
        )}
    </div>
);

export default SetupTab;