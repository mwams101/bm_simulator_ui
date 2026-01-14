import Modal from '../../../components/common/Modal';

const ViewSchemaFieldModal = ({ isOpen, onClose, field }) => {
    if (!field) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDataTypeBadge = (dataType) => {
        const typeColors = {
            'varchar': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200',
            'text': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200',
            'integer': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200',
            'bigint': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200',
            'decimal': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200',
            'float': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200',
            'boolean': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200',
            'date': 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200',
            'datetime': 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200',
            'timestamp': 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-200',
            'json': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200'
        };

        const type = dataType?.toLowerCase() || 'varchar';
        return typeColors[type] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 border-gray-200';
    };

    const footer = (
        <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
            <p className="text-[11px] leading-relaxed text-[#4c669a] dark:text-gray-400 font-medium">
                This is a read-only view of the schema field. Use the Edit option to make changes.
            </p>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Schema Field Details"
            description="View complete information about this field definition"
            footer={footer}
            size="md"
        >
            <div className="p-8 space-y-6">
                {/* Field Name & Schema */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Field Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Field Name
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                            <span className="material-symbols-outlined text-primary">data_object</span>
                            <span className="text-[#0d121b] dark:text-white font-semibold">
                {field.name}
              </span>
                        </div>
                    </div>

                    {/* Destination Schema */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Destination Schema
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                            <span className="material-symbols-outlined text-primary">database</span>
                            <span className="text-sm text-[#0d121b] dark:text-white font-medium">
                {field.destination_schema || 'N/A'}
              </span>
                        </div>
                    </div>
                </div>

                {/* Data Type & Properties */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Data Type
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border uppercase ${getDataTypeBadge(field.data_type)}`}>
              {field.data_type}
            </span>
                    </div>
                </div>

                {/* Constraints Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/50 dark:bg-primary/5 rounded-lg border border-blue-100 dark:border-primary/20">
                    {/* Is Required */}
                    <div className="flex items-center gap-2">
                        {field.is_required ? (
                            <>
                                <span className="material-symbols-outlined text-red-500 text-xl">star</span>
                                <span className="text-sm font-bold text-red-600 dark:text-red-400">Required</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-gray-400 text-xl">check_circle</span>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Optional</span>
                            </>
                        )}
                    </div>

                    {/* Is Unique */}
                    <div className="flex items-center gap-2">
                        {field.is_unique ? (
                            <>
                                <span className="material-symbols-outlined text-primary text-xl">fingerprint</span>
                                <span className="text-sm font-bold text-primary">Unique</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-gray-400 text-xl">content_copy</span>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Non-unique</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Technical Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Max Length */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Max Length
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                            <span className="material-symbols-outlined text-gray-400 text-sm">straighten</span>
                            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {field.max_length || '∞'}
              </span>
                        </div>
                    </div>

                    {/* Field Order */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Field Order
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                            <span className="material-symbols-outlined text-gray-400 text-sm">sort</span>
                            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {field.field_order || '0'}
              </span>
                        </div>
                    </div>

                    {/* Field ID */}
                    {field.id && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Field ID
                            </label>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                                <span className="material-symbols-outlined text-gray-400 text-sm">tag</span>
                                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  #{field.id}
                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Validation Rule */}
                {field.validation_rule && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Validation Rule
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                            <code className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                                {field.validation_rule}
                            </code>
                        </div>
                    </div>
                )}

                {/* Default Value */}
                {field.default_value && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Default Value
                        </label>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <code className="text-sm font-mono text-blue-700 dark:text-blue-300 break-all">
                                {field.default_value}
                            </code>
                        </div>
                    </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#e7ebf3] dark:border-gray-700">
                    {/* Created At */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Created At
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(field.created_at)}
              </span>
                        </div>
                    </div>

                    {/* Updated At */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Last Updated
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-sm">update</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(field.updated_at)}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewSchemaFieldModal;