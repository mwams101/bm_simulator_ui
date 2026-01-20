
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
import AddSchemaFieldModal from "./components/AddSchemaFieldModal.jsx";
import ViewSchemaFieldModal from "./components/ViewSchemaFieldModal.jsx";
import UpdateSchemaFieldModal from "./components/UpdateSchemaFieldModal.jsx";

const SchemasFieldsPage = () => {
    const navigate = useNavigate();
    const [schemaFields, setSchemaFields] = useState([]);
    const [schemas, setSchemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalSchemaFields, setTotalSchemaFields] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSchemaField, setSelectedSchemaField] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchSchemas();
        fetchSchemaFields();
    }, [searchTerm]);


    const fetchSchemas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/destination-schemas', {
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
                throw new Error('Failed to fetch schemas');
            }

            const data = await response.json();
            setSchemas(data);
        } catch (err) {
            console.error('Error fetching schemas:', err);
        }
    };

    const fetchSchemaFields = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/schema-fields', {
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
                throw new Error('Failed to fetch schema fields.');
            }

            const data = await response.json();

            // FIXED: Filter logic
            let filteredSchemaFields = data;
            if (searchTerm) {
                filteredSchemaFields = data.filter(field =>
                        field.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        field.destination_schema?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        field.data_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        field.validation_rule?.toLowerCase().includes(searchTerm.toLowerCase())
                    // Removed boolean and number fields from string search
                );
            }

            setSchemaFields(filteredSchemaFields);
            setTotalSchemaFields(filteredSchemaFields.length);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching schema fields:', err);
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

    const handleCreateSchemaField = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    // FIXED: Changed from handleSchemaFieldCreated to match modal prop
    const handleFieldCreated = () => {
        fetchSchemaFields();
    };

    const handleViewSchemaField = (schemaField) => {
        setSelectedSchemaField(schemaField);
        setIsViewModalOpen(true);
    };

    const handleEditSchemaField = (schemaField) => {
        setSelectedSchemaField(schemaField);
        setIsUpdateModalOpen(true);
    };

    const handleDeleteSchemaField = (schemaField) => {
        setSelectedSchemaField(schemaField);
        setIsDeleteDialogOpen(true);
    };

    const handleFieldUpdated = () => {
        fetchSchemaFields();
    };

    const confirmDelete = async () => {
        if (!selectedSchemaField) return;

        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/schema-fields/${selectedSchemaField.id}`, {
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
                throw new Error(data.message || 'Failed to delete schema field');
            }

            fetchSchemaFields();
            setIsDeleteDialogOpen(false);
            setSelectedSchemaField(null);
        } catch (err) {
            setError(err.message);
            console.error('Error deleting schema field:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSchemaAction = (schemaField) => {
        console.log('Action for schema field:', schemaField);
    };

    // Table columns configuration
    const columns = [
        { header: 'Field Name', key: 'name' },
        { header: 'Schema', key: 'destination_schema' },
        { header: 'Data Type', key: 'data_type' },
        { header: 'Required', key: 'is_required' },
        { header: 'Unique', key: 'is_unique' },
        { header: 'Validation', key: 'validation_rule' },
        { header: 'Max Length', key: 'max_length' },
        { header: 'Default', key: 'default_value' },
        { header: 'Order', key: 'field_order' },
        { header: 'Actions', key: 'actions', align: 'right' }
    ];

    const filters = [
        {
            label: 'Data Type',
            icon: 'category',
            onClick: () => console.log('Filter by data type')
        },
        {
            label: 'Sort By',
            icon: 'sort',
            onClick: () => console.log('Sort')
        }
    ];

    // Custom cell renderer (your existing code is good)
    const renderCell = (row, key, column) => {
        switch (key) {
            case 'name':
                return (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">data_object</span>
                        <span className="text-[#0d121b] dark:text-white text-sm font-bold">
                            {row.name}
                        </span>
                    </div>
                );

            case 'destination_schema':
                return (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">database</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {row.destination_schema_id || 'N/A'}
                        </span>
                    </div>
                );

            case 'data_type':
                { const typeColors = {
                    'string': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
                    'varchar': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
                    'text': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
                    'integer': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
                    'int': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
                    'bigint': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
                    'decimal': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
                    'float': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
                    'boolean': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
                    'date': 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
                    'datetime': 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
                    'timestamp': 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
                    'json': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                };

                const dataType = row.data_type?.toLowerCase() || 'string';
                const colorClass = typeColors[dataType] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700';

                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase ${colorClass}`}>
                        {row.data_type || 'N/A'}
                    </span>
                ); }

            case 'is_required':
                return (
                    <div className="flex items-center gap-1.5">
                        {row.is_required ? (
                            <>
                                <span className="size-2 rounded-full bg-red-500"></span>
                                <span className="text-xs font-bold text-red-600 dark:text-red-400">Required</span>
                            </>
                        ) : (
                            <>
                                <span className="size-2 rounded-full bg-gray-400"></span>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Optional</span>
                            </>
                        )}
                    </div>
                );

            case 'is_unique':
                return (
                    <div className="flex items-center justify-center">
                        {row.is_unique ? (
                            <span className="material-symbols-outlined text-primary text-lg" title="Unique">
                                check_circle
                            </span>
                        ) : (
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-700 text-lg" title="Not unique">
                                cancel
                            </span>
                        )}
                    </div>
                );

            case 'validation_rule':
                return (
                    <div className="max-w-[200px]">
                        {row.validation_rule ? (
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 font-mono text-gray-700 dark:text-gray-300 block truncate" title={row.validation_rule}>
                                {row.validation_rule}
                            </code>
                        ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">None</span>
                        )}
                    </div>
                );

            case 'max_length':
                return (
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {row.max_length ? (
                            <span className="font-mono">{row.max_length}</span>
                        ) : (
                            <span className="text-gray-400 dark:text-gray-500">∞</span>
                        )}
                    </span>
                );

            case 'default_value':
                return (
                    <div className="max-w-[150px]">
                        {row.default_value ? (
                            <code className="text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 font-mono text-blue-700 dark:text-blue-300 block truncate" title={row.default_value}>
                                {row.default_value}
                            </code>
                        ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">NULL</span>
                        )}
                    </div>
                );

            case 'field_order':
                return (
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-gray-400 text-sm">sort</span>
                        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {row.field_order || 0}
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
                        onView={() => handleViewSchemaField(row)}
                        onEdit={() => handleEditSchemaField(row)}
                        onDelete={() => handleDeleteSchemaField(row)}
                    />
                );

            default:
                return row[key] || 'N/A';
        }
    };

    // Paginate data
    const paginatedSchemas = schemaFields.slice(
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
                            title="Schema Fields"
                            description="Define and manage field definitions for your destination schemas."
                            buttonText="Add New Field"
                            buttonIcon="add"
                            onButtonClick={handleCreateSchemaField}
                        />

                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            placeholder="Search fields by name, schema, or data type..."
                            filters={filters}
                        />

                        <div>
                            <DataTable
                                columns={columns}
                                data={paginatedSchemas}
                                loading={loading}
                                onRowAction={handleSchemaAction}
                                emptyMessage="No schema fields found"
                                renderCell={renderCell}
                            />

                            {!loading && schemaFields.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={totalSchemaFields}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>

                        <InfoBanner
                            icon="security"
                            title="Security Note & Compliance"
                            description="These field definitions are for mock data mapping only. No real banking data structures are modified."
                        />
                    </div>
                </main>

                <Footer />
            </div>


            <AddSchemaFieldModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onFieldCreated={handleFieldCreated}
                schemas={schemas}
            />

            <ViewSchemaFieldModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                field={selectedSchemaField}
            />

            <UpdateSchemaFieldModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onFieldUpdated={handleFieldUpdated}
                field={selectedSchemaField}
                schemas={schemas}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Schema Field"
                message={`Are you sure you want to delete the field "${selectedSchemaField?.name}"? This action cannot be undone.`}
                confirmText="Delete Field"
                cancelText="Cancel"
                variant="danger"
                loading={deleteLoading}
            />
        </div>
    );
};


export default SchemasFieldsPage;