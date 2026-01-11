const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   description,
                   children,
                   footer,
                   size = 'md'
               }) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-[560px]',
        lg: 'max-w-[800px]',
        xl: 'max-w-[1000px]'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center py-12 px-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>

            <div
                className={`relative z-10 w-full ${sizes[size]} bg-white dark:bg-[#161e2e] rounded-2xl shadow-2xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden`}>
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-[#f0f2f5] dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-black text-[#0d121b] dark:text-white tracking-tight">
                            {title}
                        </h1>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    {description && (
                        <p className="text-[#4c669a] dark:text-gray-400 text-sm">
                            {description}
                        </p>
                    )}
                </div>

                {/* Content */}
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        className="bg-gray-50 dark:bg-gray-900/50 px-8 py-4 border-t border-[#f0f2f5] dark:border-gray-800">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;