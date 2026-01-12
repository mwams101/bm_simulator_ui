import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/common/Modal';

const UpdateSchemaModal = ({ isOpen, onClose, onSchemaUpdated, schema }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        schema_name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Initialize form with schema data when modal opens
    useEffect(() => {
        if (schema) {
            setFormData({
                schema_name: schema.schema_name || '',
                description: schema.description || '',
            });
        }
    }, [schema]);

    console.log("schema", schema);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/destination-schemas/${schema.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Check for authentication errors
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update schema');
            }

            // Notify parent and close
            onSchemaUpdated();
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
                <span className="text-primary font-bold">Edit Mode:</span> Changes will be saved to the schema template.
                This will not affect existing migrations using this schema.
            </p>
        </div>
    );

    if (!schema) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Update Schema"
            description={`Editing: ${schema.schema_name}`}
            footer={footer}
        >
            <div className="p-8">
                {error && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">error</span>
                        <p className="text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Schema Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="schema_name">
                            Schema Name
                        </label>
                        <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                database
              </span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                id="schema_name"
                                name="schema_name"
                                placeholder="e.g. Standard_Retail_v2"
                                type="text"
                                value={formData.schema_name}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="description">
                            Description
                        </label>
                        <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-xl">
                description
              </span>
                            <textarea
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none resize-none"
                                id="description"
                                name="description"
                                placeholder="Core retail banking entities including accounts and balances..."
                                rows="3"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
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
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
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

export default UpdateSchemaModal;