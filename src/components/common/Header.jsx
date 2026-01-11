import { Link } from 'react-router-dom';

const Header = ({ activeTab = 'dashboard', onLogout }) => {
    const navItems = [
        { label: 'Dashboard', path: '/dashboard', key: 'dashboard' },
        { label: 'Users', path: '/users', key: 'users' },
        { label: 'Schemas', path: '/schemas', key: 'schemas' },
    ];

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-background-dark px-10 py-3 sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 text-primary">
                    <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
                        <span className="material-symbols-outlined">account_balance</span>
                    </div>
                    <h2 className="text-[#0d121b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        BankSim Admin
                    </h2>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.key}
                            className={`text-sm font-medium transition-colors ${
                                activeTab === item.key
                                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                                    : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary'
                            }`}
                            to={item.path}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="h-8 w-[1px] bg-[#e7ebf3] dark:bg-gray-800 mx-2"></div>
                <button onClick={onLogout} className="flex items-center gap-2 group">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-[#e7ebf3] dark:border-gray-800"
                        style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDObRANjtnr_fyqWT5hxwdnmUKYfnxJtmCW_IcApWi9CejlVnapkcKFo74DFplgYvZMOSPEVBFQk-HZ9Im11ex_Ba-eOBaPrECBZg7gWaeHPAzgU_qVQuncC9PaL4R8yeBcegl-v8Pr01qYAwA4dykX8EoMOF8kf-2FmRsAcssV0UXDJgbw2JIZ9dCVFS7IxPHdujgjOxMvxsiB70z04-W_qhxZPgoa0h65AB-XxxKD_RcIZpSHCp-QY6j5Y4m_f62A-1QpGv_rzt4")'}}
                    ></div>
                </button>
            </div>
        </header>
    );
};

export default Header;
