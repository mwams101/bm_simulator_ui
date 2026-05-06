import { useState } from 'react';
import { Link } from 'react-router-dom';

const navItems = [
    { label: 'Dashboard',          path: '/',                  key: 'dashboard',          icon: 'dashboard'              },
    { label: 'Users',              path: '/users',             key: 'users',              icon: 'people'                 },
    { label: 'Schemas',            path: '/schemas',           key: 'schemas',            icon: 'schema'                 },
    { label: 'Schema Fields',      path: '/schema-fields',     key: 'schema-fields',      icon: 'view_column'            },
    { label: 'Mapping Templates',  path: '/mapping-templates', key: 'mapping-templates',  icon: 'transform'              },
    { label: 'Migration Jobs',     path: '/migration-jobs',    key: 'migration-jobs',     icon: 'work'                   },
    { label: 'Customers',          path: '/customers',         key: 'customers',          icon: 'person'                 },
    { label: 'Accounts',           path: '/accounts',          key: 'accounts',           icon: 'account_balance_wallet' },
    { label: 'Notifications',      path: '/notifications',     key: 'notifications',      icon: 'notifications'          },
    { label: 'Audit Logs',         path: '/audit-logs',        key: 'audit-logs',         icon: 'history'                },
];

const NavLink = ({ item, activeTab, onClick }) => (
    <Link
        to={item.path}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === item.key
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0d121b] dark:hover:text-white'
        }`}
    >
        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
        {item.label}
    </Link>
);

const Header = ({ activeTab = 'dashboard', onLogout }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* ── Desktop sidebar ─────────────────────────────────────── */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 flex-col bg-white dark:bg-background-dark border-r border-[#e7ebf3] dark:border-gray-800 z-50">
                <div className="flex items-center gap-3 px-5 py-5 border-b border-[#e7ebf3] dark:border-gray-800 shrink-0">
                    <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary shrink-0">
                        <span className="material-symbols-outlined">account_balance</span>
                    </div>
                    <h2 className="text-[#0d121b] dark:text-white text-base font-bold leading-tight tracking-tight truncate">
                        BankSim Admin
                    </h2>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                    {navItems.map(item => (
                        <NavLink key={item.key} item={item} activeTab={activeTab} />
                    ))}
                </nav>

                <div className="shrink-0 border-t border-[#e7ebf3] dark:border-gray-800 p-3">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0d121b] dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* ── Mobile top bar ───────────────────────────────────────── */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-white dark:bg-background-dark border-b border-[#e7ebf3] dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                    <div className="size-7 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-[18px]">account_balance</span>
                    </div>
                    <h2 className="text-[#0d121b] dark:text-white text-base font-bold leading-tight">BankSim Admin</h2>
                </div>
                <button
                    onClick={() => setMobileOpen(p => !p)}
                    className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
                </button>
            </header>

            {/* ── Mobile slide-out menu ────────────────────────────────── */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 pt-14">
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setMobileOpen(false)}
                    />
                    <nav className="relative w-64 h-full bg-white dark:bg-background-dark border-r border-[#e7ebf3] dark:border-gray-800 py-4 px-3 space-y-0.5 overflow-y-auto">
                        {navItems.map(item => (
                            <NavLink
                                key={item.key}
                                item={item}
                                activeTab={activeTab}
                                onClick={() => setMobileOpen(false)}
                            />
                        ))}
                        <div className="pt-4 mt-4 border-t border-[#e7ebf3] dark:border-gray-700">
                            <button
                                onClick={() => { setMobileOpen(false); onLogout?.(); }}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default Header;
