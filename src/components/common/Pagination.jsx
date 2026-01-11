
const Pagination = ({
                        currentPage,
                        totalItems,
                        itemsPerPage = 10,
                        onPageChange
                    }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const showPages = 3;

        for (let i = 1; i <= Math.min(showPages, totalPages); i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#cfd7e7] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        Showing {startItem} to {endItem} of {totalItems} items
      </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex size-9 items-center justify-center rounded-lg border border-[#cfd7e7] dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`text-sm font-${currentPage === page ? 'bold' : 'medium'} flex size-9 items-center justify-center rounded-lg ${
                            currentPage === page
                                ? 'text-white bg-primary'
                                : 'text-[#0d121b] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                        }`}
                    >
                        {page}
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
    );
};

export default Pagination;