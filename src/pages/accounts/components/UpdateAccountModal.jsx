import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const inp = "w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none";

const UpdateAccountModal = ({ isOpen, onClose, onUpdated, account }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ balance: '', status: 'ACTIVE' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (account) setForm({ balance: account.balance ?? 0, status: account.status ?? 'ACTIVE' });
    }, [account]);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const token = localStorage.getItem('token');
            const r = await fetch(`http://localhost:8000/new-bank-accounts/${account.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ balance: parseFloat(form.balance), status: form.status, updated_at: new Date().toISOString() }),
            });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to update account'); }
            onUpdated(); onClose();
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    if (!isOpen || !account) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center py-6 px-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-[400px] bg-white dark:bg-[#161e2e] rounded-2xl shadow-2xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden">
                <div className="px-8 pt-8 pb-5 border-b border-[#f0f2f5] dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-[#0d121b] dark:text-white tracking-tight">Update Account</h1>
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm mt-0.5">Account #{account.account_number}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>
                {error && <div className="mx-8 mt-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>}
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#0d121b] dark:text-gray-200">Balance ({account.currency})</label>
                        <input type="number" step="0.01" className={inp} required value={form.balance} onChange={e => setForm(p => ({ ...p, balance: e.target.value }))} disabled={loading} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#0d121b] dark:text-gray-200">Status</label>
                        <select className={inp} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} disabled={loading}>
                            <option value="ACTIVE">Active</option>
                            <option value="CLOSED">Closed</option>
                            <option value="FROZEN">Frozen</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2">
                            {loading ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Saving...</> : <><span className="material-symbols-outlined text-sm">save</span>Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateAccountModal;
