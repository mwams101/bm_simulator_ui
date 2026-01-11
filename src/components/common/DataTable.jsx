const DataTable = ({
                       columns,
                       data,
                       loading,
                       onRowAction,
                       emptyMessage = "No data found",
                       renderCell
                   }) => {
    if (loading) {
        return (
            <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[#cfd7e7] dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-[#cfd7e7] dark:border-gray-800">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-6 py-4 text-[#0d121b] dark:text-gray-300 text-xs font-bold uppercase tracking-wider ${
                                    column.align === 'right' ? 'text-right' : ''
                                }`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cfd7e7] dark:divide-gray-800">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group"
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 ${column.align === 'right' ? 'text-right' : ''}`}
                                    >
                                        {renderCell ? renderCell(row, column.key, column) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;