import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const statCards = [
    {
        label: 'Migrations Today',
        value: '14',
        meta: '+2% vs yesterday',
        metaIcon: 'arrow_upward',
        metaClass: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        label: 'Pending Validations',
        value: '3',
        meta: 'Awaiting manual review',
        metaIcon: 'hourglass_empty',
        metaClass: 'text-amber-500 dark:text-amber-400',
    },
    {
        label: 'Last Run Status',
        value: 'Completed',
        meta: 'Today at 11:42 AM',
        metaIcon: 'check_circle',
        metaClass: 'text-emerald-600 dark:text-emerald-400',
    },
];

const activityItems = [
    {
        icon: 'play_arrow',
        iconBg: 'bg-primary/10 text-primary',
        text: (<>Migration Job <span className="font-bold">#M4821</span> started.</>),
        time: '2 minutes ago',
        badge: 'Running',
        badgeClass: 'text-primary bg-primary/10',
    },
    {
        icon: 'error_outline',
        iconBg: 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400',
        text: (<>Validation failed for Batch <span className="font-bold">#B991</span>.</>),
        time: '15 minutes ago',
        badge: 'Failed',
        badgeClass: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
    },
    {
        icon: 'check_circle',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        text: (<>Migration Job <span className="font-bold">#M4820</span> completed successfully.</>),
        time: '1 hour ago',
        badge: 'Success',
        badgeClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
        icon: 'manage_accounts',
        iconBg: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
        text: (<>User <span className="font-bold">Pat Summers</span> switched to Admin role.</>),
        time: '3 hours ago',
        badge: 'System',
        badgeClass: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
    },
    {
        icon: 'warning',
        iconBg: 'bg-amber-100 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400',
        text: (<>Pre-flight check for Job <span className="font-bold">#M4822</span> has a warning.</>),
        time: '5 hours ago',
        badge: 'Warning',
        badgeClass: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20',
    },
];

const DashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <Header activeTab="dashboard" onLogout={handleLogout} />

                <main className="flex-1 flex flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">

                        {/* Page header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-[#0d121b] dark:text-white tracking-tight">Dashboard</h1>
                                <p className="text-sm text-[#4c669a] dark:text-gray-400 mt-1">
                                    Overview of your migration activity and system status.
                                </p>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#cfd7e7] dark:border-gray-700 text-sm font-bold text-[#0d121b] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <span className="material-symbols-outlined text-base">refresh</span>
                                    Run Validator
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#cfd7e7] dark:border-gray-700 text-sm font-bold text-[#0d121b] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <span className="material-symbols-outlined text-base">view_list</span>
                                    View All Jobs
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all">
                                    <span className="material-symbols-outlined text-base">add</span>
                                    Start New Migration
                                </button>
                            </div>
                        </div>

                        {/* Stat cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {statCards.map((card, i) => (
                                <div key={i} className="flex flex-col gap-2 rounded-xl p-6 border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                                    <p className="text-sm font-medium text-[#4c669a] dark:text-gray-400">{card.label}</p>
                                    <p className="text-4xl font-black text-primary tracking-tight">{card.value}</p>
                                    <p className={`text-xs font-semibold flex items-center gap-1 ${card.metaClass}`}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{card.metaIcon}</span>
                                        {card.meta}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Recent activity */}
                        <div>
                            <h2 className="text-lg font-bold text-[#0d121b] dark:text-white mb-3">Recent Activity</h2>
                            <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                                <ul className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                                    {activityItems.map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                            <div className={`flex items-center justify-center size-9 rounded-full shrink-0 ${item.iconBg}`}>
                                                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[#0d121b] dark:text-white">{item.text}</p>
                                                <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-0.5">{item.time}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${item.badgeClass}`}>
                                                {item.badge}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Info banner */}
                        <div className="border border-blue-100 dark:border-primary/20 bg-blue-50/50 dark:bg-primary/5 rounded-xl p-5 flex gap-4 items-start">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                                <span className="material-symbols-outlined">security</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#0d121b] dark:text-blue-100">Simulation Environment</h4>
                                <p className="text-xs text-[#4c669a] dark:text-gray-400 mt-1 leading-relaxed">
                                    This application uses <span className="font-bold text-primary dark:text-blue-400">mock/pseudonymized data</span> for demonstration purposes only. No real banking data is stored or accessed.
                                </p>
                            </div>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default DashboardPage;