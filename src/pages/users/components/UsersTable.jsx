import UserTableRow from './UserTableRow';

const UsersTable = ({ users, loading, currentPage, totalUsers, onPageChange, onUserAction }) => {
    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                <div className="flex items-center justify-center py-20">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                </div>
            </div>
        );
    }

    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalUsers);

    return (
        <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                        <th className="px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                            User Profile
                        </th>
                        <th className="px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                            Last Login
                        </th>
                        <th className="px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <UserTableRow key={user.id} user={user} onAction={onUserAction} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                No users found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#cfd7e7] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Showing {startItem} to {endItem} of {totalUsers} users
        </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex size-9 items-center justify-center rounded-lg border border-[#cfd7e7] dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>

                    {[...Array(Math.min(3, totalPages))].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => onPageChange(i + 1)}
                            className={`text-sm font-${currentPage === i + 1 ? 'bold' : 'medium'} flex size-9 items-center justify-center rounded-lg ${
                                currentPage === i + 1
                                    ? 'text-white bg-primary'
                                    : 'text-[#0d121b] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    {totalPages > 3 && (
                        <>
                            <span className="text-sm text-gray-400 flex size-9 items-center justify-center">...</span>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="text-sm font-medium flex size-9 items-center justify-center text-[#0d121b] dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex size-9 items-center justify-center rounded-lg border border-[#cfd7e7] dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsersTable;