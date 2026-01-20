import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/common/Modal';

const AddSchemaFieldModal = ({ isOpen, onClose, onFieldCreated = [] }) => {
    const navigate = useNavigate();
    const [destinationSchemas, setDestinationSchemas] = useState([]);
    const [formData, setFormData] = useState({
        destination_schema_id: '',
        name: '',
        data_type: 'varchar',
        is_required: false,
        is_unique: false,
        validation_rule: '',
        max_length: '',
        default_value: '',
        field_order: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
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

            // Convert empty strings to null for optional fields
            const payload = {
                ...formData,
                max_length: formData.max_length ? parseInt(formData.max_length) : null,
                field_order: formData.field_order ? parseInt(formData.field_order) : null,
                validation_rule: formData.validation_rule || null,
                default_value: formData.default_value || null
            };

            const response = await fetch('http://localhost:8000/schema-fields', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // Check for authentication errors
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create schema field');
            }

            // Reset form
            setFormData({
                destination_schema_id: '',
                name: '',
                data_type: 'varchar',
                is_required: false,
                is_unique: false,
                validation_rule: '',
                max_length: '',
                default_value: '',
                field_order: ''
            });

            // Notify parent and close
            onFieldCreated();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            destination_schema_id: '',
            name: '',
            data_type: 'varchar',
            is_required: false,
            is_unique: false,
            validation_rule: '',
            max_length: '',
            default_value: '',
            field_order: ''
        });
        setError('');
        onClose();
    };

    const fetchSchemas = async () => {
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:8000/destination-schemas', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        setDestinationSchemas(data);
    };

    useEffect(() => {
        fetchSchemas();
    }, []);

    const footer = (
        <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5">security</span>
            <p className="text-[11px] leading-relaxed text-[#4c669a] dark:text-gray-400 font-medium">
                <span className="text-primary font-bold">Simulation Environment:</span> This field is for mock data mapping only.
                No real banking data structures are modified.
            </p>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Schema Field"
            description="Define a new field for your destination schema template."onFieldCreated
            footer={footer}
            size="lg"
        >
            <div className="p-8">
                {error && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">error</span>
                        <p className="text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Destination Schema & Field Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Destination Schema */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="destination_schema">
                                Destination Schema <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  database
                </span>
                                <select
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none appearance-none"
                                    id="destination_schema"
                                    name="destination_schema_id"
                                    value={formData.destination_schema_id}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select Schema</option>
                                    {destinationSchemas.map((schema) => (
                                        <option key={schema.id} value={schema.id}>
                                            {schema.schema_name}
                                        </option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
                            </div>
                        </div>

                        {/* Field Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="name">
                                Field Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  data_object
                </span>
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                    id="name"
                                    name="name"
                                    placeholder="e.g. account_number"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Type, Max Length & Field Order Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Data Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="data_type">
                                Data Type <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  category
                </span>
                                <select
                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none appearance-none"
                                    id="data_type"
                                    name="data_type"
                                    value={formData.data_type}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                >
                                    <option value="varchar">VARCHAR</option>
                                    <option value="text">TEXT</option>
                                    <option value="integer">INTEGER</option>
                                    <option value="bigint">BIGINT</option>
                                    <option value="decimal">DECIMAL</option>
                                    <option value="float">FLOAT</option>
                                    <option value="boolean">BOOLEAN</option>
                                    <option value="date">DATE</option>
                                    <option value="datetime">DATETIME</option>
                                    <option value="timestamp">TIMESTAMP</option>
                                    <option value="json">JSON</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
                            </div>
                        </div>

                        {/* Max Length */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="max_length">
                                Max Length
                            </label>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  straighten
                </span>
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                    id="max_length"
                                    name="max_length"
                                    placeholder="255"
                                    type="number"
                                    min="1"
                                    value={formData.max_length}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Field Order */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="field_order">
                                Field Order
                            </label>
                            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  sort
                </span>
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                    id="field_order"
                                    name="field_order"
                                    placeholder="1"
                                    type="number"
                                    min="0"
                                    value={formData.field_order}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Validation Rule */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="validation_rule">
                            Validation Rule
                        </label>
                        <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-xl">
                rule
              </span>
                            <textarea
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none resize-none font-mono"
                                id="validation_rule"
                                name="validation_rule"
                                placeholder="e.g. regex:/^[A-Z0-9]+$/ or min:10,max:100"
                                rows="2"
                                value={formData.validation_rule}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Default Value */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0d121b] dark:text-gray-200" htmlFor="default_value">
                            Default Value
                        </label>
                        <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                settings
              </span>
                            <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e7ebf3] dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none font-mono"
                                id="default_value"
                                name="default_value"
                                placeholder="e.g. NULL or 0 or 'active'"
                                type="text"
                                value={formData.default_value}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                        {/* Is Required */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_required"
                                name="is_required"
                                checked={formData.is_required}
                                onChange={handleInputChange}
                                disabled={loading}
                                className="w-4 h-4 text-primary bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-primary focus:ring-2"
                            />
                            <label htmlFor="is_required" className="flex items-center gap-2 text-sm font-medium text-[#0d121b] dark:text-gray-200 cursor-pointer">
                                <span className="material-symbols-outlined text-red-500 text-lg">star</span>
                                Required Field
                            </label>
                        </div>

                        {/* Is Unique */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_unique"
                                name="is_unique"
                                checked={formData.is_unique}
                                onChange={handleInputChange}
                                disabled={loading}
                                className="w-4 h-4 text-primary bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-primary focus:ring-2"
                            />
                            <label htmlFor="is_unique" className="flex items-center gap-2 text-sm font-medium text-[#0d121b] dark:text-gray-200 cursor-pointer">
                                <span className="material-symbols-outlined text-primary text-lg">fingerprint</span>
                                Unique Constraint
                            </label>
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
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    Create Field
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddSchemaFieldModal;
