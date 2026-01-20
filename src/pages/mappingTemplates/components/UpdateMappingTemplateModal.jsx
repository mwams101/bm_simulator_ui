import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Modal from '../../../components/common/Modal';

const UpdateMappingTemplateModal = ({isOpen, onClose, onTemplateUpdated, template}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        template_name: '',
        description: '',
        is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (template) {
            setFormData({
                template_name: template.template_name || '',
                description: template.description || '',
                is_active: template.is_active || false
            });
        }
    }, [template]);

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/mapping-templates/${template.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', {replace: true});
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update template');
            }

            onTemplateUpdated();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        onClose();
    };

    const footer = (
        <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5">edit</span>
            <p className="text-[11px] leading-relaxed text-[#4c669a] dark:text-gray-400 font-medium">
                <span className="text-primary font-bold">Edit Mode:</span> Changes will be saved to the template. This
                will not affect migrations that are already using this template.
            </p>
        </div>
    );

    if (!template) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Update Mapping Template"
            description={`Editing: ${template.template_name}`}
            footer={footer}
        >
            <div className="p-8">
                {error && (
                    <div
                        className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">error</span>
                        <p className="text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Template Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="template_name">
                            Template Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span
                                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                description
                            </span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                id="template_name"
                                name="template_name"
                                placeholder="e.g. Standard Customer Migration"
                                type="text"
                                value={formData.template_name}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="description">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-xl">
                                subject
                            </span>
                            <textarea
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none resize-none"
                                id="description"
                                name="description"
                                placeholder="Describe the purpose and scope of this mapping template..."
                                rows="4"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Active Status Checkbox */}
                    <div
                        className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                disabled={loading}
                                className="w-4 h-4 text-primary bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-primary focus:ring-2"
                            />
                            <label htmlFor="is_active"
                                   className="flex items-center gap-2 text-sm font-medium text-[#0d121b] dark:text-gray-200 cursor-pointer">
                                <span className="material-symbols-outlined text-emerald-500 text-lg">toggle_on</span>
                                Template is active
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-7">
                            Active templates are available for use in migration workflows
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">save</span>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default UpdateMappingTemplateModal;