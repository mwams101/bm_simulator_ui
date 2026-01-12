import Modal from '../../../components/common/Modal';

const ViewSchemaModal = ({ isOpen, onClose, schema }) => {
    if (!schema) return null;

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

    const footer = (
        <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
            <p className="text-[11px] leading-relaxed text-[#4c669a] dark:text-gray-400 font-medium">
                This is a read-only view of the schema template. Use the Edit option to make changes.
            </p>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Schema Details"
            description="View complete information about this schema template"
            footer={footer}
            size="md"
        >
            <div className="p-8 space-y-6">
                {/* Schema Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Schema Name
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                        <span className="material-symbols-outlined text-primary">database</span>
                        <span className="text-[#0d121b] dark:text-white font-semibold">
              {schema.schema_name}
            </span>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                        <p className="text-sm text-[#4c669a] dark:text-gray-300">
                            {schema.description || 'No description provided'}
                        </p>
                    </div>
                </div>

                {/* Schema Type */}
                {schema.schema_type && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Schema Type
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                            <span className="material-symbols-outlined text-primary">category</span>
                            <span className="text-sm text-[#0d121b] dark:text-white capitalize">
                {schema.schema_type}
              </span>
                        </div>
                    </div>
                )}

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#e7ebf3] dark:border-gray-700">
                    {/* Created By */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Created By
                        </label>
                        <div className="flex items-center gap-2">
                            <div
                                className="size-8 rounded-full bg-cover bg-center border border-gray-200"
                                style={{
                                    backgroundImage: `url('https://ui-avatars.com/api/?name=${encodeURIComponent(schema.created_by || 'Unknown')}&background=135bec&color=fff&size=128')`
                                }}
                            ></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {schema.created_by || 'Unknown'}
              </span>
                        </div>
                    </div>

                    {/* Schema ID */}
                    {schema.id && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Schema ID
                            </label>
                            <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  #{schema.id}
                </span>
                            </div>
                        </div>
                    )}

                    {/* Created At */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Created At
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(schema.created_at)}
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
                {formatDate(schema.updated_at)}
              </span>
                        </div>
                    </div>
                </div>

                {/* Fields Count (if available) */}
                {schema.fields && schema.fields.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-[#e7ebf3] dark:border-gray-700">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Schema Fields
                        </label>
                        <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                            <p className="text-sm text-primary font-semibold">
                                {schema.fields.length} field{schema.fields.length !== 1 ? 's' : ''} defined
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ViewSchemaModal;