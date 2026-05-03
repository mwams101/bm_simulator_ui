const statusConfig = {
    PENDING:    { label: 'Pending',    classes: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',          icon: 'schedule' },
    MAPPING:    { label: 'Mapping',    classes: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',        icon: 'sync' },
    VALIDATING: { label: 'Validating', classes: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',    icon: 'rule' },
    PREVIEWING: { label: 'Previewing', classes: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',icon: 'preview' },
    EXECUTING:  { label: 'Executing',  classes: 'bg-primary/10 text-primary',                                              icon: 'play_arrow' },
    COMPLETED:  { label: 'Completed',  classes: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', icon: 'check_circle' },
    FAILED:     { label: 'Failed',     classes: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',            icon: 'error' },
};

const JobStatusBadge = ({ status }) => {
    const cfg = statusConfig[status?.toUpperCase()] ?? statusConfig.PENDING;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border-0 ${cfg.classes}`}>
            <span className="material-symbols-outlined text-xs" style={{ fontSize: 13 }}>{cfg.icon}</span>
            {cfg.label}
        </span>
    );
};

export default JobStatusBadge;