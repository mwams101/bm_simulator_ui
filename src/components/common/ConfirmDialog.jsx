const ConfirmDialog = ({
                           isOpen,
                           onClose,
                           onConfirm,
                           title = "Confirm Action",
                           message = "Are you sure you want to proceed?",
                           confirmText = "Confirm",
                           cancelText = "Cancel",
                           variant = "danger",
                           loading = false
                       }) => {
    if (!isOpen) return null;

    const variants = {
        danger: {
            button: "bg-red-600 hover:bg-red-700 text-white",
            icon: "warning",
            iconColor: "text-red-600 dark:text-red-400"
        },
        warning: {
            button: "bg-yellow-600 hover:bg-yellow-700 text-white",
            icon: "warning",
            iconColor: "text-yellow-600 dark:text-yellow-400"
        },
        info: {
            button: "bg-primary hover:bg-primary/90 text-white",
            icon: "info",
            iconColor: "text-primary"
        }
    };

    const config = variants[variant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center py-12 px-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#161e2e] rounded-2xl shadow-2xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full bg-${variant === 'danger' ? 'red' : variant === 'warning' ? 'yellow' : 'primary'}-50 dark:bg-${variant === 'danger' ? 'red' : variant === 'warning' ? 'yellow' : 'primary'}-900/20`}>
              <span className={`material-symbols-outlined text-2xl ${config.iconColor}`}>
                {config.icon}
              </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#0d121b] dark:text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-[#4c669a] dark:text-gray-400">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${config.button}`}
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    Processing...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;