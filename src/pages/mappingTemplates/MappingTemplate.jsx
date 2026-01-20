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
import AddMappingTemplateModal from './components/AddMappingTemplateModal';
import ViewMappingTemplateModal from './components/ViewMappingTemplateModal';
import UpdateMappingTemplateModal from './components/UpdateMappingTemplateModal';

const MappingTemplatesPage = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTemplates, setTotalTemplates] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTemplates();
    }, [searchTerm]);

    const fetchTemplates = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/mapping-templates', {
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
                throw new Error('Failed to fetch mapping templates');
            }

            const data = await response.json();

            // Filter templates based on search term
            let filteredTemplates = data;
            if (searchTerm) {
                filteredTemplates = data.filter(template =>
                    template.template_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setTemplates(filteredTemplates);
            setTotalTemplates(filteredTemplates.length);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching templates:', err);
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

    const handleCreateTemplate = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleTemplateCreated = () => {
        fetchTemplates();
    };

    const handleViewTemplate = (template) => {
        setSelectedTemplate(template);
        setIsViewModalOpen(true);
    };

    const handleEditTemplate = (template) => {
        setSelectedTemplate(template);
        setIsUpdateModalOpen(true);
    };

    const handleDeleteTemplate = (template) => {
        setSelectedTemplate(template);
        setIsDeleteDialogOpen(true);
    };

    const handleTemplateUpdated = () => {
        fetchTemplates();
    };

    const handleToggleActive = async (template) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/mapping-templates/${template.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...template,
                    is_active: !template.is_active
                })
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to update template status');
            }

            fetchTemplates();
        } catch (err) {
            setError(err.message);
            console.error('Error toggling template status:', err);
        }
    };

    const confirmDelete = async () => {
        if (!selectedTemplate) return;

        setDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/mapping-templates/${selectedTemplate.id}`, {
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
                throw new Error(data.message || 'Failed to delete template');
            }

            fetchTemplates();
            setIsDeleteDialogOpen(false);
            setSelectedTemplate(null);
        } catch (err) {
            setError(err.message);
            console.error('Error deleting template:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    // Table columns
    const columns = [
        { header: 'Template Name', key: 'template_name' },
        { header: 'Description', key: 'description' },
        { header: 'Status', key: 'is_active' },
        { header: 'Created At', key: 'created_at' },
        { header: 'Created By', key: 'user_id' },
        { header: 'Actions', key: 'actions', align: 'right' }
    ];

    // Filters
    const filters = [
        {
            label: 'Status',
            icon: 'toggle_on',
            onClick: () => console.log('Filter by status')
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
            case 'template_name':
                return (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <span className="text-[#0d121b] dark:text-white text-sm font-bold">
                            {row.template_name}
                        </span>
                    </div>
                );

            case 'description':
                return (
                    <span className="text-sm text-[#4c669a] dark:text-gray-400 line-clamp-2">
                        {row.description || 'No description provided'}
                    </span>
                );

            case 'is_active':
                return (
                    <button
                        onClick={() => handleToggleActive(row)}
                        className="flex items-center gap-1.5 group"
                    >
                        {row.is_active ? (
                            <>
                                <span className="size-2 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                                    Active
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="size-2 rounded-full bg-gray-400"></span>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:underline">
                                    Inactive
                                </span>
                            </>
                        )}
                    </button>
                );

            case 'created_at':
                return (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {row.created_at ? new Date(row.created_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : 'N/A'}
                    </span>
                );

            case 'user_id':
                { const userName = row.user_name || `User #${row.user_id}`;
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=135bec&color=fff&size=128`;
                return (
                    <div className="flex items-center gap-2">
                        <div
                            className="size-6 rounded-full bg-cover bg-center border border-gray-200"
                            style={{ backgroundImage: `url('${avatarUrl}')` }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {userName}
                        </span>
                    </div>
                ); }

            case 'actions':
                return (
                    <ActionMenu
                        onView={() => handleViewTemplate(row)}
                        onEdit={() => handleEditTemplate(row)}
                        onDelete={() => handleDeleteTemplate(row)}
                    />
                );

            default:
                return row[key] || 'N/A';
        }
    };

    // Paginate data
    const paginatedTemplates = templates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <Header activeTab="migrations" onLogout={handleLogout} />

                <main className="flex-1 flex flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] w-full px-4 md:px-10 py-8 gap-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <PageHeader
                            title="Mapping Templates"
                            description="Create and manage reusable data mapping templates for your migration workflows."
                            buttonText="Create Template"
                            buttonIcon="add"
                            onButtonClick={handleCreateTemplate}
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
                                data={paginatedTemplates}
                                loading={loading}
                                emptyMessage="No mapping templates found"
                                renderCell={renderCell}
                            />

                            {!loading && templates.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={totalTemplates}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>

                        <InfoBanner
                            icon="security"
                            title="Template Management"
                            description="Mapping templates are reusable configurations for data transformations. Templates can be activated or deactivated without deletion to preserve migration history."
                        />
                    </div>
                </main>

                <Footer />
            </div>

            <AddMappingTemplateModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onTemplateCreated={handleTemplateCreated}
            />

            <ViewMappingTemplateModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                template={selectedTemplate}
            />

            <UpdateMappingTemplateModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onTemplateUpdated={handleTemplateUpdated}
                template={selectedTemplate}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Mapping Template"
                message={`Are you sure you want to delete "${selectedTemplate?.template_name}"? This action cannot be undone and may affect existing migrations.`}
                confirmText="Delete Template"
                cancelText="Cancel"
                variant="danger"
                loading={deleteLoading}
            />
        </div>
    );
};

export default MappingTemplatesPage;