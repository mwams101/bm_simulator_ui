// components/SecurityNotice.jsx
const SecurityNotice = () => {
    return (
        <div className="mt-8 bg-blue-50/50 dark:bg-primary/5 border border-blue-100 dark:border-primary/20 rounded-xl p-5 flex gap-4 items-start">
            <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                <span className="material-symbols-outlined">verified_user</span>
            </div>
            <div className="flex flex-col gap-1">
                <h4 className="text-[#0d121b] dark:text-blue-100 text-sm font-bold">
                    Security Note & Compliance
                </h4>
                <p className="text-[#4c669a] dark:text-gray-400 text-xs leading-relaxed">
                    Mock data only. No live banking connections are active in this simulation environment.
                    <span className="font-bold text-primary dark:text-blue-400"> All sensitive user data is pseudonymized for simulation purposes</span> in
                    accordance with internal training protocols. User activity is logged for auditing.
                </p>
            </div>
        </div>
    );
};

export default SecurityNotice;