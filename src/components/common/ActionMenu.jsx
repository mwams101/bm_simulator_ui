import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ActionMenu = ({ onView, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => setIsOpen(false);

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPos({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right + window.scrollX - 192,
            });
        }
        setIsOpen(prev => !prev);
    };

    const handleAction = (action) => {
        action();
        setIsOpen(false);
    };

    const dropdown = isOpen && createPortal(
        <div
            ref={menuRef}
            style={{ position: 'absolute', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
            className="w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[#e7ebf3] dark:border-gray-700 py-1"
        >
            {onView && (
                <button
                    onClick={() => handleAction(onView)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    View Details
                </button>
            )}
            {onEdit && (
                <button
                    onClick={() => handleAction(onEdit)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Edit
                </button>
            )}
            {onDelete && (
                <>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                    <button
                        onClick={() => handleAction(onDelete)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                        Delete
                    </button>
                </>
            )}
        </div>,
        document.body
    );

    return (
        <div className="relative inline-block">
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="text-gray-400 hover:text-primary transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <span className="material-symbols-outlined">more_vert</span>
            </button>
            {dropdown}
        </div>
    );
};

export default ActionMenu;