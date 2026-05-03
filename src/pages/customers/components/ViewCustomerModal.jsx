import { useState, useEffect } from 'react';

const statusClasses = {
    ACTIVE:    'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    INACTIVE:  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    SUSPENDED: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    CLOSED:    'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
    FROZEN:    'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
};

const accountTypeIcon = { SAVINGS: 'savings', CHECKING: 'account_balance', CREDIT: 'credit_card', LOAN: 'payments' };

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-xs font-bold text-[#4c669a] dark:text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm text-[#0d121b] dark:text-white font-medium">{value || '—'}</span>
    </div>
);

const ViewCustomerModal = ({ isOpen, onClose, customer }) => {
    const [accounts, setAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(false);

    useEffect(() => {
        if (!customer) return;
        const fetchAccounts = async () => {
            setLoadingAccounts(true);
            try {
                const token = localStorage.getItem('token');
                const r = await fetch(`http://localhost:8000/new-bank-accounts/by-customer/${customer.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (r.ok) setAccounts(await r.json());
            } finally { setLoadingAccounts(false); }
        };
        fetchAccounts();
    }, [customer]);

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center py-6 px-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-[680px] bg-white dark:bg-[#161e2e] rounded-2xl shadow-2xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-8 pt-8 pb-5 border-b border-[#f0f2f5] dark:border-gray-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-full bg-cover bg-center border border-gray-200"
                            style={{ backgroundImage: `url('https://ui-avatars.com/api/?name=${encodeURIComponent(customer.first_name + ' ' + customer.last_name)}&background=135bec&color=fff&size=128')` }} />
                        <div>
                            <h1 className="text-xl font-black text-[#0d121b] dark:text-white tracking-tight">{customer.first_name} {customer.last_name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClasses[customer.status] ?? statusClasses.INACTIVE}`}>{customer.status}</span>
                                <span className="text-xs text-[#4c669a] dark:text-gray-400">{customer.customer_type}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>

                <div className="overflow-y-auto flex-1 p-8 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                            <InfoRow label="Email" value={customer.email} />
                            <InfoRow label="Phone" value={customer.phone_masked} />
                            <InfoRow label="Date of Birth" value={customer.date_of_birth} />
                            <InfoRow label="Migration Job" value={customer.migration_job_id ? `#${customer.migration_job_id}` : 'N/A'} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Address</h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                            <div className="col-span-2"><InfoRow label="Address Line 1" value={customer.address_line_1} /></div>
                            {customer.address_line_2 && <div className="col-span-2"><InfoRow label="Address Line 2" value={customer.address_line_2} /></div>}
                            <InfoRow label="City" value={customer.city} />
                            <InfoRow label="State" value={customer.state} />
                            <InfoRow label="Postal Code" value={customer.postal_code} />
                            <InfoRow label="Country" value={customer.country} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Accounts ({accounts.length})</h3>
                        {loadingAccounts ? (
                            <div className="flex justify-center py-6"><span className="material-symbols-outlined animate-spin text-2xl text-primary">progress_activity</span></div>
                        ) : accounts.length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl">No accounts linked to this customer.</div>
                        ) : (
                            <div className="space-y-2">
                                {accounts.map(acc => (
                                    <div key={acc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-[#e7ebf3] dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-sm">{accountTypeIcon[acc.account_type] ?? 'account_balance'}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0d121b] dark:text-white">#{acc.account_number}</p>
                                                <p className="text-xs text-[#4c669a] dark:text-gray-400">{acc.account_type} · {acc.currency}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#0d121b] dark:text-white">{acc.balance.toLocaleString('en-US', { style: 'currency', currency: acc.currency })}</p>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusClasses[acc.status] ?? statusClasses.INACTIVE}`}>{acc.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCustomerModal;
