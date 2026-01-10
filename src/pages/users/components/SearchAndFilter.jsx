const SearchAndFilter = ({ searchTerm, onSearchChange, onAddUser }) => {
    return (
        <>
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[#0d121b] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                        User Directory
                    </h1>
                    <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal">
                        Manage and monitor simulated bank personnel access and permissions.
                    </p>
                </div>
                <button
                    onClick={onAddUser}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    <span className="truncate">Add New User</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-background-dark/50 p-4 rounded-xl border border-[#e7ebf3] dark:border-gray-800 shadow-sm">
                <div className="flex-1 w-full">
                    <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-gray-400">search</span>
                        <input
                            className="flex w-full rounded-lg text-[#0d121b] dark:text-white focus:ring-2 focus:ring-primary/20 border-[#e7ebf3] dark:border-gray-700 bg-white dark:bg-gray-900 h-10 pl-10 pr-4 text-sm"
                            placeholder="Search by name, email or ID..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7ebf3] dark:bg-gray-800 px-4 border border-transparent hover:border-primary/30 transition-all">
                        <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        <p className="text-[#0d121b] dark:text-gray-200 text-sm font-medium">All Roles</p>
                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </button>
                    <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7ebf3] dark:bg-gray-800 px-4 border border-transparent hover:border-primary/30 transition-all">
                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                        <p className="text-[#0d121b] dark:text-gray-200 text-sm font-medium">Status</p>
                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SearchAndFilter;