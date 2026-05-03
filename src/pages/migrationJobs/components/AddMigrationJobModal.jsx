import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const inp = "w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none";

const AddMigrationJobModal = ({ isOpen, onClose, onJobCreated }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [destinationSchemaId, setDestinationSchemaId] = useState('');
    const [schemas, setSchemas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        const fetchSchemas = async () => {
            try {
                const token = localStorage.getItem('token');
                const r = await fetch('http://localhost:8000/destination-schemas', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (r.ok) setSchemas(await r.json());
            } catch {}
        };
        fetchSchemas();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/migration-jobs', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    destination_schema_id: destinationSchemaId ? Number(destinationSchemaId) : null,
                    status: 'PENDING',
                    total_records: 0,
                    successful_records: 0,
                    failed_records: 0,
                }),
            });
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to create migration job');
            }
            setName('');
            setDestinationSchemaId('');
            onJobCreated();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => { setName(''); setDestinationSchemaId(''); setError(''); onClose(); };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center py-12 px-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative z-10 w-full max-w-[480px] bg-white dark:bg-[#161e2e] rounded-2xl shadow-2xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden">
                <div className="px-8 pt-8 pb-6 border-b border-[#f0f2f5] dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-[#0d121b] dark:text-white tracking-tight">New Migration Job</h1>
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm mt-1">Create a new data migration job.</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {error && (
                    <div className="mx-8 mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">error</span>
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="job_name">Job Name</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">work</span>
                            <input
                                id="job_name"
                                className={inp}
                                placeholder="e.g. Retail_Bank_Migration_Q2"
                                value={name}
                                onChange={e => { setName(e.target.value); if (error) setError(''); }}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="schema_id">
                            Destination Schema <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">database</span>
                            <select
                                id="schema_id"
                                className={inp}
                                value={destinationSchemaId}
                                onChange={e => setDestinationSchemaId(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">No schema selected</option>
                                {schemas.map(s => (
                                    <option key={s.id} value={s.id}>{s.schema_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={handleClose} disabled={loading}
                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2">
                            {loading ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Creating...</> : <><span className="material-symbols-outlined text-sm">add</span>Create Job</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMigrationJobModal;
