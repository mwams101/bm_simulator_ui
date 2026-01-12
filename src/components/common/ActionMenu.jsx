import { useState, useRef, useEffect } from 'react';

const ActionMenu = ({ onView, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleAction = (action) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-primary transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <span className="material-symbols-outlined">more_vert</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[#e7ebf3] dark:border-gray-700 py-1 z-50">
                    <button
                        onClick={() => handleAction(onView)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                        View Details
                    </button>
                    <button
                        onClick={() => handleAction(onEdit)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit
                    </button>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                    <button
                        onClick={() => handleAction(onDelete)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActionMenu;