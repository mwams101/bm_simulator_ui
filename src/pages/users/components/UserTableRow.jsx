const UserTableRow = ({ user, onAction }) => {
    const getRoleBadgeClass = (role) => {
        switch (role.toLowerCase()) {
            case 'admin':
            case 'administrator':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'auditor':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800';
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    // Generate avatar placeholder based on user name
    const getAvatarUrl = (name) => {
        const initial = name ? name.charAt(0).toUpperCase() : 'U';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=135bec&color=fff&size=128`;
    };

    // Format role for display
    const formatRole = (role) => {
        if (role === 'admin') return 'Administrator';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div
                        className="size-10 rounded-full bg-cover bg-center border border-gray-200"
                        style={{backgroundImage: `url('${getAvatarUrl(user.user_name)}')`}}
                    ></div>
                    <div className="flex flex-col">
                        <span className="text-[#0d121b] dark:text-white text-sm font-bold">{user.user_name}</span>
                        <span className="text-[#4c669a] dark:text-gray-400 text-xs">{user.email}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadgeClass(user.role)}`}>
          {formatRole(user.role)}
        </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="size-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold">Active</span>
                </div>
            </td>
            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                {user.last_login || 'Never'}
            </td>
            <td className="px-6 py-4 text-right">
                <button
                    onClick={() => onAction(user)}
                    className="text-gray-400 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </td>
        </tr>
    );
};

export default UserTableRow;