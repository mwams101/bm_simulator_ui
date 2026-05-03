import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const inp = "w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none";
const Field = ({ label, children }) => <div className="space-y-1"><label className="text-xs font-bold text-[#0d121b] dark:text-gray-200">{label}</label>{children}</div>;

const INITIAL = { customer_id: '', migration_job_id: '', account_number: '', account_type: 'SAVINGS', balance: '0', currency: 'USD', account_open_date: '', status: 'ACTIVE' };

const AddAccountModal = ({ isOpen, onClose, onCreated }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState(INITIAL);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (error) setError(''); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        const now = new Date().toISOString();
        try {
            const token = localStorage.getItem('token');
            const r = await fetch('http://localhost:8000/new-bank-accounts', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    customer_id: Number(form.customer_id),
                    migration_job_id: form.migration_job_id ? Number(form.migration_job_id) : null,
                    account_number: Number(form.account_number),
                    balance: parseFloat(form.balance),
                    created_at: now, updated_at: now,
                }),
            });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to create account'); }
            setForm(INITIAL); onCreated(); onClose();
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleClose = () => { setForm(INITIAL); setError(''); onClose(); };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center py-6 px-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative z-10 w-full max-w-[560px] bg-white dark:bg-[#161e2e] rounded-2xl shadow-2xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden">
                <div className="px-8 pt-8 pb-5 border-b border-[#f0f2f5] dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-[#0d121b] dark:text-white tracking-tight">Add New Account</h1>
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm mt-0.5">Create a bank account for a migrated customer.</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>
                {error && <div className="mx-8 mt-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2"><span className="material-symbols-outlined text-red-500 text-sm">error</span><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>}
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Customer ID"><input type="number" className={inp} required value={form.customer_id} onChange={e => set('customer_id', e.target.value)} disabled={loading} /></Field>
                        <Field label="Account Number"><input type="number" className={inp} required value={form.account_number} onChange={e => set('account_number', e.target.value)} disabled={loading} /></Field>
                        <Field label="Account Type">
                            <select className={inp} value={form.account_type} onChange={e => set('account_type', e.target.value)} disabled={loading}>
                                <option value="SAVINGS">Savings</option>
                                <option value="CHECKING">Checking</option>
                                <option value="CREDIT">Credit</option>
                                <option value="LOAN">Loan</option>
                            </select>
                        </Field>
                        <Field label="Status">
                            <select className={inp} value={form.status} onChange={e => set('status', e.target.value)} disabled={loading}>
                                <option value="ACTIVE">Active</option>
                                <option value="CLOSED">Closed</option>
                                <option value="FROZEN">Frozen</option>
                            </select>
                        </Field>
                        <Field label="Balance"><input type="number" step="0.01" className={inp} required value={form.balance} onChange={e => set('balance', e.target.value)} disabled={loading} /></Field>
                        <Field label="Currency"><input className={inp} maxLength={3} required value={form.currency} onChange={e => set('currency', e.target.value.toUpperCase())} disabled={loading} /></Field>
                        <Field label="Open Date"><input type="date" className={inp} required value={form.account_open_date} onChange={e => set('account_open_date', e.target.value)} disabled={loading} /></Field>
                        <Field label="Migration Job ID (optional)"><input type="number" className={inp} value={form.migration_job_id} onChange={e => set('migration_job_id', e.target.value)} disabled={loading} /></Field>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={handleClose} disabled={loading} className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2">
                            {loading ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Saving...</> : <><span className="material-symbols-outlined text-sm">add</span>Add Account</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAccountModal;
