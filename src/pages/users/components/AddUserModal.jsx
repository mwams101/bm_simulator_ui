// components/AddUserModal.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Check for authentication errors
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create user');
            }

            // Reset form
            setFormData({
                user_name: '',
                email: '',
                password: '',
                role: 'USER'
            });

            // Notify parent component
            onUserAdded();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            user_name: '',
            email: '',
            password: '',
            role: 'USER'
        });
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center py-12 px-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleClose}></div>

            <div className="relative z-10 w-full max-w-[560px] bg-white dark:bg-[#161e2e] rounded-2xl shadow-2xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden">
                <div className="px-8 pt-8 pb-6 border-b border-[#f0f2f5] dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-black text-[#0d121b] dark:text-white tracking-tight">Add New User</h1>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <p className="text-[#4c669a] dark:text-gray-400 text-sm">
                        Configure access for a new simulated bank administrator or operator.
                    </p>
                </div>

                {error && (
                    <div className="mx-8 mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">error</span>
                        <p className="text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="user_name">
                            Username
                        </label>
                        <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                person
              </span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                id="user_name"
                                name="user_name"
                                placeholder="e.g. amorgan_sim"
                                type="text"
                                value={formData.user_name}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                mail
              </span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                id="email"
                                name="email"
                                placeholder="alex.morgan@mockbank.sim"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="password">
                                Initial Password
                            </label>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  lock
                </span>
                                <input
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="role">
                                User Role
                            </label>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  badge
                </span>
                                <select
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none appearance-none"
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                >
                                    <option value="USER">Migration Operator</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    Creating...
                                </>
                            ) : (
                                'Create User'
                            )}
                        </button>
                    </div>
                </form>

                <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-4 border-t border-[#f0f2f5] dark:border-gray-800 flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">verified_user</span>
                    <p className="text-[11px] leading-relaxed text-[#4c669a] dark:text-gray-400 font-medium">
                        <span className="text-primary font-bold">Simulation Environment:</span> This form is for educational purposes only. Credentials entered are stored in a mock database and do not grant access to live banking systems. All data is pseudonymized.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;