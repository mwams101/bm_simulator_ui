import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL = {
    first_name: '', last_name: '', date_of_birth: '', email: '', phone_masked: '',
    address_line_1: '', address_line_2: '', city: '', state: '', postal_code: '', country: '',
    customer_type: 'INDIVIDUAL', status: 'ACTIVE', migration_job_id: '',
};

const Field = ({ label, children }) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-[#0d121b] dark:text-gray-200">{label}</label>
        {children}
    </div>
);

const inp = "w-full px-3 py-2 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none";

const AddCustomerModal = ({ isOpen, onClose, onCreated }) => {
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
            const r = await fetch('http://localhost:8000/new-bank-customers', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    migration_job_id: form.migration_job_id ? Number(form.migration_job_id) : null,
                    created_at: now, updated_at: now,
                }),
            });
            if (r.status === 401 || r.status === 403) { localStorage.removeItem('token'); navigate('/login', { replace: true }); return; }
            if (!r.ok) { const d = await r.json(); throw new Error(d.detail || 'Failed to create customer'); }
            setForm(INITIAL); onCreated(); onClose();
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleClose = () => { setForm(INITIAL); setError(''); onClose(); };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center py-6 px-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative z-10 w-full max-w-[680px] bg-white dark:bg-[#161e2e] rounded-2xl shadow-2xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-8 pt-8 pb-5 border-b border-[#f0f2f5] dark:border-gray-800 flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-xl font-black text-[#0d121b] dark:text-white tracking-tight">Add New Customer</h1>
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm mt-0.5">Register a migrated bank customer.</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>

                <div className="overflow-y-auto flex-1">
                    {error && (
                        <div className="mx-8 mt-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                            <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="First Name"><input className={inp} required value={form.first_name} onChange={e => set('first_name', e.target.value)} disabled={loading} /></Field>
                            <Field label="Last Name"><input className={inp} required value={form.last_name} onChange={e => set('last_name', e.target.value)} disabled={loading} /></Field>
                            <Field label="Date of Birth"><input type="date" className={inp} required value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} disabled={loading} /></Field>
                            <Field label="Email"><input type="email" className={inp} required value={form.email} onChange={e => set('email', e.target.value)} disabled={loading} /></Field>
                            <Field label="Phone (masked)"><input className={inp} placeholder="***-***-1234" required value={form.phone_masked} onChange={e => set('phone_masked', e.target.value)} disabled={loading} /></Field>
                            <Field label="Migration Job ID (optional)"><input type="number" className={inp} value={form.migration_job_id} onChange={e => set('migration_job_id', e.target.value)} disabled={loading} /></Field>
                        </div>
                        <Field label="Address Line 1"><input className={inp} required value={form.address_line_1} onChange={e => set('address_line_1', e.target.value)} disabled={loading} /></Field>
                        <Field label="Address Line 2"><input className={inp} value={form.address_line_2} onChange={e => set('address_line_2', e.target.value)} disabled={loading} /></Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="City"><input className={inp} required value={form.city} onChange={e => set('city', e.target.value)} disabled={loading} /></Field>
                            <Field label="State"><input className={inp} required value={form.state} onChange={e => set('state', e.target.value)} disabled={loading} /></Field>
                            <Field label="Postal Code"><input className={inp} required value={form.postal_code} onChange={e => set('postal_code', e.target.value)} disabled={loading} /></Field>
                            <Field label="Country"><input className={inp} required value={form.country} onChange={e => set('country', e.target.value)} disabled={loading} /></Field>
                            <Field label="Customer Type">
                                <select className={inp} value={form.customer_type} onChange={e => set('customer_type', e.target.value)} disabled={loading}>
                                    <option value="INDIVIDUAL">Individual</option>
                                    <option value="BUSINESS">Business</option>
                                </select>
                            </Field>
                            <Field label="Status">
                                <select className={inp} value={form.status} onChange={e => set('status', e.target.value)} disabled={loading}>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="SUSPENDED">Suspended</option>
                                </select>
                            </Field>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button type="button" onClick={handleClose} disabled={loading} className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                            <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2">
                                {loading ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>Saving...</> : <><span className="material-symbols-outlined text-sm">person_add</span>Add Customer</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCustomerModal;
