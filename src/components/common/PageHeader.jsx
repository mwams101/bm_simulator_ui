const PageHeader = ({ title, description, buttonText, buttonIcon, onButtonClick }) => {
    return (
        <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-[#0d121b] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                    {title}
                </h1>
                <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal">
                    {description}
                </p>
            </div>
            {buttonText && (
                <button
                    onClick={onButtonClick}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">{buttonIcon || 'add'}</span>
                    <span className="truncate">{buttonText}</span>
                </button>
            )}
        </div>
    );
};

export default PageHeader;