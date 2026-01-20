// components/mappingTemplates/ViewMappingTemplateModal.jsx
import Modal from '../../../components/common/Modal';

const ViewMappingTemplateModal = ({ isOpen, onClose, template }) => {
    if (!template) return null;

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
                This is a read-only view of the mapping template. Use the Edit option to make changes.
            </p>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Mapping Template Details"
            description="View complete information about this mapping template"
            footer={footer}
            size="md"
        >
            <div className="p-8 space-y-6">
                {/* Template Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Template Name
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-[#e7ebf3] dark:border-gray-700">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <span className="text-[#0d121b] dark:text-white font-semibold">
                            {template.template_name}
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
                            {template.description || 'No description provided'}
                        </p>
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Template Status
                    </label>
                    <div className={`p-3 rounded-lg border ${
                        template.is_active
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                            : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                    }`}>
                        <div className="flex items-center gap-2">
                            {template.is_active ? (
                                <>
                                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                        Active
                                    </span>
                                    <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                        - Available for migrations
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-gray-400">cancel</span>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Inactive
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                        - Not available for new migrations
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#e7ebf3] dark:border-gray-700">
                    {/* Template ID */}
                    {template.id && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Template ID
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400 text-sm">tag</span>
                                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                    #{template.id}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Created By */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Created By
                        </label>
                        <div className="flex items-center gap-2">
                            <div
                                className="size-8 rounded-full bg-cover bg-center border border-gray-200"
                                style={{
                                    backgroundImage: `url('https://ui-avatars.com/api/?name=${encodeURIComponent(template.user_name || `User ${template.user_id}`)}&background=135bec&color=fff&size=128')`
                                }}
                            ></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {template.user_name || `User #${template.user_id}`}
                            </span>
                        </div>
                    </div>

                    {/* Created At */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Created At
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {formatDate(template.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewMappingTemplateModal;