import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            console.log(data);
            // Store the token (adjust based on your backend response)
            localStorage.setItem('token', data.access_token);

            // Navigate to dashboard or home page
            navigate('/users');

        } catch (err) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">
              swap_horiz
            </span>
                    </div>
                    <h1 className="text-2xl font-display font-bold text-brand-text-light dark:text-brand-text-dark mb-2">
                        Bank Data Migration Simulator
                    </h1>
                    <p className="text-brand-text-light/60 dark:text-brand-text-dark/60">
                        Test and validate your data migration workflows with confidence.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-brand-primary rounded-xl shadow-lg border border-brand-border-light dark:border-brand-border-dark p-8">
                    <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">
              swap_horiz
            </span>
                        <h2 className="text-xl font-display font-semibold text-brand-text-light dark:text-brand-text-dark">
                            Sign In
                        </h2>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">
                error
              </span>
                            <p className="text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-brand-text-light dark:text-brand-text-dark mb-2"
                            >
                                Username
                            </label>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-light/40 dark:text-brand-text-dark/40 text-xl">
                  mail
                </span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                    className="w-full pl-11 pr-4 py-3 bg-brand-subtle-bg-light dark:bg-brand-subtle-bg-dark border border-brand-border-light dark:border-brand-border-dark rounded-lg text-brand-text-light dark:text-brand-text-dark placeholder:text-brand-text-light/40 dark:placeholder:text-brand-text-dark/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-brand-text-light dark:text-brand-text-dark"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-light/40 dark:text-brand-text-dark/40 text-xl">
                  lock
                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                    className="w-full pl-11 pr-11 py-3 bg-brand-subtle-bg-light dark:bg-brand-subtle-bg-dark border border-brand-border-light dark:border-brand-border-dark rounded-lg text-brand-text-light dark:text-brand-text-dark placeholder:text-brand-text-light/40 dark:placeholder:text-brand-text-dark/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-light/40 dark:text-brand-text-dark/40 text-xl hover:text-brand-text-light dark:hover:text-brand-text-dark transition-colors disabled:opacity-50"
                                >
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                                    Signing in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-brand-subtle-bg-light dark:bg-brand-subtle-bg-dark border border-brand-border-light dark:border-brand-border-dark rounded-lg p-4">
                    <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">
              shield
            </span>
                        <div className="flex-1 text-sm text-brand-text-light/70 dark:text-brand-text-dark/70 space-y-1">
                            <p>This simulator uses mock data only. No live banking connections.</p>
                            <p>All uploaded files auto-delete after 24 hours by default. Sensitive fields are masked in logs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;