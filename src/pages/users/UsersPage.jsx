import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from './components/Footer';
import SearchAndFilter from './components/SearchAndFilter';
import UsersTable from './components/UsersTable';
import SecurityNotice from './components/SecurityNotice';
import AddUserModal from './components/AddUserModal';
import UpdateUserModal from './components/UpdateUserModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const UsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8000/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check for authentication errors
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', {replace: true});
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();

            // Filter users based on search term if provided
            let filteredUsers = data;
            if (searchTerm) {
                filteredUsers = data.filter(user =>
                    user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.role.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setUsers(filteredUsers);
            setTotalUsers(filteredUsers.length);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddUser = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUserAdded = () => {
        // Refresh the users list after adding a new user
        fetchUsers();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsUpdateModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;
        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/users/${selectedUser.user_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to delete user');
            }

            fetchUsers();
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div
            className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <Header activeTab="users" onLogout={handleLogout} />

                <main className="flex-1 flex flex-col items-center">
                    <div
                        className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">
                        {error && (
                            <div
                                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <SearchAndFilter
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            onAddUser={handleAddUser}
                        />

                        <UsersTable
                            users={users}
                            loading={loading}
                            currentPage={currentPage}
                            totalUsers={totalUsers}
                            onPageChange={handlePageChange}
                            onEditUser={handleEditUser}
                            onDeleteUser={handleDeleteUser}
                        />

                        <SecurityNotice/>
                    </div>
                </main>

                <Footer/>
            </div>

            <AddUserModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUserAdded={handleUserAdded}
            />

            <UpdateUserModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onUserUpdated={fetchUsers}
                user={selectedUser}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${selectedUser?.user_name}"? This action cannot be undone.`}
                confirmText="Delete User"
                cancelText="Cancel"
                variant="danger"
                loading={deleteLoading}
            />
        </div>
    );
};

export default UsersPage;