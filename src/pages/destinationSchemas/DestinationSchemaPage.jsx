
// pages/SchemasPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import InfoBanner from '../../components/common/InfoBanner';
import ActionMenu from '../../components/common/ActionMenu';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AddSchemaModal from './components/AddSchemaModal';
import ViewSchemaModal from './components/ViewSchemaModal';
import UpdateSchemaModal from './components/UpdateSchemaModal.jsx';

const SchemasPage = () => {
    const navigate = useNavigate();
    const [schemas, setSchemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalSchemas, setTotalSchemas] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSchema, setSelectedSchema] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchSchemas();
    }, [searchTerm]);

    const fetchSchemas = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/destination-schemas', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check for authentication errors
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch schemas');
            }

            const data = await response.json();

            // Filter schemas based on search term
            let filteredSchemas = data;
            if (searchTerm) {
                filteredSchemas = data.filter(schema =>
                    schema.schema_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    schema.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    schema.created_by?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setSchemas(filteredSchemas);
            setTotalSchemas(filteredSchemas.length);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching schemas:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCreateSchema = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleSchemaCreated = () => {
        fetchSchemas();
    };

    const handleViewSchema = (schema) => {
        setSelectedSchema(schema);
        setIsViewModalOpen(true);
    };

    const handleEditSchema = (schema) => {
        setSelectedSchema(schema);
        setIsUpdateModalOpen(true);
    };

    const handleDeleteSchema = (schema) => {
        setSelectedSchema(schema);
        setIsDeleteDialogOpen(true);
    };

    const handleSchemaUpdated = () => {
        fetchSchemas();
    };

    const confirmDelete = async () => {
        if (!selectedSchema) return;

        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/destination-schemas/${selectedSchema.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check for authentication errors
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete schema');
            }

            // Refresh the list and close dialog
            fetchSchemas();
            setIsDeleteDialogOpen(false);
            setSelectedSchema(null);
        } catch (err) {
            setError(err.message);
            console.error('Error deleting schema:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSchemaAction = (schema) => {
        console.log('Action for schema:', schema);
    };

    // Table columns configuration
    const columns = [
        { header: 'Schema Name', key: 'schema_name' },
        { header: 'Description', key: 'description' },
        { header: 'Created By', key: 'created_by' },
        { header: 'Created At', key: 'created_at' },
        { header: 'Updated At', key: 'updated_at' },
        { header: 'Actions', key: 'actions', align: 'right' }
    ];

    // Filter configuration
    const filters = [
        {
            label: 'Schema Type',
            icon: 'category',
            onClick: () => console.log('Filter by type')
        },
        {
            label: 'Sort By',
            icon: 'sort',
            onClick: () => console.log('Sort')
        }
    ];

    // Custom cell renderer
    const renderCell = (row, key, column) => {
        switch (key) {
            case 'schema_name':
                return (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">database</span>
                        <span className="text-[#0d121b] dark:text-white text-sm font-bold">
              {row.schema_name}
            </span>
                    </div>
                );

            case 'description':
                return (
                    <span className="text-sm text-[#4c669a] dark:text-gray-400">
            {row.description}
          </span>
                );

            case 'created_by':
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.created_by || 'Unknown')}&background=135bec&color=fff&size=128`;
                return (
                    <div className="flex items-center gap-2">
                        <div
                            className="size-6 rounded-full bg-cover bg-center border border-gray-200"
                            style={{ backgroundImage: `url('${avatarUrl}')` }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {row.created_by}
            </span>
                    </div>
                );

            case 'created_at':
            case 'updated_at':
                return (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
            {row[key] ? new Date(row[key]).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'N/A'}
          </span>
                );

            case 'actions':
                return (
                    <ActionMenu
                        onView={() => handleViewSchema(row)}
                        onEdit={() => handleEditSchema(row)}
                        onDelete={() => handleDeleteSchema(row)}
                    />
                );

            default:
                return row[key] || 'N/A';
        }
    };

    // Paginate data
    const paginatedSchemas = schemas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <Header activeTab="schemas" onLogout={handleLogout} />

                <main className="flex-1 flex flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <PageHeader
                            title="Destination Schema Templates"
                            description="Define and manage data structures for mock banking migration simulations."
                            buttonText="Create New Schema"
                            buttonIcon="add_box"
                            onButtonClick={handleCreateSchema}
                        />

                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            placeholder="Search templates by name or description..."
                            filters={filters}
                        />

                        <div>
                            <DataTable
                                columns={columns}
                                data={paginatedSchemas}
                                loading={loading}
                                onRowAction={handleSchemaAction}
                                emptyMessage="No schemas found"
                                renderCell={renderCell}
                            />

                            {!loading && schemas.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={totalSchemas}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>

                        <InfoBanner
                            icon="security"
                            title="Security Note & Compliance"
                            description={
                                <>
                                    These schemas are for <span className="font-bold text-primary dark:text-blue-400">mock data mapping only</span>.
                                    No real banking schemas are stored or accessed. All structures are designed for simulation and educational purposes only.
                                </>
                            }
                        />
                    </div>
                </main>

                <Footer />
            </div>

            <AddSchemaModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSchemaCreated={handleSchemaCreated}
            />

            <ViewSchemaModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                schema={selectedSchema}
            />

            <UpdateSchemaModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSchemaUpdated={handleSchemaUpdated}
                schema={selectedSchema}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Schema"
                message={`Are you sure you want to delete "${selectedSchema?.schema_name}"? This action cannot be undone.`}
                confirmText="Delete Schema"
                cancelText="Cancel"
                variant="danger"
                loading={deleteLoading}
            />
        </div>
    );
};

export default SchemasPage;