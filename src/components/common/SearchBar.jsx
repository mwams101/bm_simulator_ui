const SearchBar = ({
                       searchTerm,
                       onSearchChange,
                       placeholder = "Search...",
                       filters = []
                   }) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-background-dark/50 p-4 rounded-xl border border-[#e7ebf3] dark:border-gray-800 shadow-sm">
            <div className="flex-1 w-full">
                <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-gray-400">search</span>
                    <input
                        className="flex w-full rounded-lg text-[#0d121b] dark:text-white focus:ring-2 focus:ring-primary/20 border border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-gray-900 h-10 pl-10 pr-4 text-sm"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
            {filters.length > 0 && (
                <div className="flex gap-2 w-full md:w-auto">
                    {filters.map((filter, index) => (
                        <button
                            key={index}
                            onClick={filter.onClick}
                            className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7ebf3] dark:bg-gray-800 px-4 border border-transparent hover:border-primary/30 transition-all"
                        >
                            <span className="material-symbols-outlined text-[20px]">{filter.icon}</span>
                            <p className="text-[#0d121b] dark:text-gray-200 text-sm font-medium">{filter.label}</p>
                            <span className="material-symbols-outlined text-[18px]">expand_more</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;