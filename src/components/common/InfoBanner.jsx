const InfoBanner = ({ icon = "info", title, description, variant = "info" }) => {
    const variants = {
        info: "bg-blue-50/50 dark:bg-primary/5 border-blue-100 dark:border-primary/20",
        warning: "bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30",
        success: "bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30"
    };

    return (
        <div className={`mt-8 border rounded-xl p-5 flex gap-4 items-start ${variants[variant]}`}>
            <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div className="flex flex-col gap-1">
                <h4 className="text-[#0d121b] dark:text-blue-100 text-sm font-bold">{title}</h4>
                <p className="text-[#4c669a] dark:text-gray-400 text-xs leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default InfoBanner;