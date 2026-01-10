const DashboardPage = () => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <header
                    className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-primary dark:text-white">
                            <div className="size-6">
                                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">MigrationSim</h2>
                        </div>
                        <div
                            className="hidden md:flex items-center gap-2 rounded-lg bg-background-light dark:bg-background-dark px-3 py-1.5 border border-transparent">
                            <span
                                className="text-sm font-semibold text-text-light-secondary dark:text-text-dark-secondary">Role:</span>
                            <select
                                className="form-select bg-transparent border-none text-text-light-primary dark:text-dark-primary font-bold p-0 focus:ring-0 focus:outline-none">
                                <option>Migration Operator</option>
                                <option>Administrator</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-4 lg:px-16">
                        <label className="w-full max-w-md">
                            <div className="relative flex w-full flex-1 items-stretch rounded-lg h-10">
                                <div
                                    className="text-text-light-secondary dark:text-text-dark-secondary absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-full placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary pl-10 pr-4 text-sm font-normal"
                                    placeholder="Search for jobs, batches, or users..." value=""/>
                            </div>
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 hover:bg-background-light dark:hover:bg-background-dark text-text-light-secondary dark:text-dark-secondary relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-background-dark">
                            <span className="material-symbols-outlined">notifications</span>
                            <div
                                className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-danger border-2 border-card-light dark:border-card-dark"></div>
                        </button>
                        <button
                            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 hover:bg-background-light dark:hover:bg-background-dark text-text-light-secondary dark:text-dark-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-background-dark">
                            <span className="material-symbols-outlined">help_outline</span>
                        </button>
                        <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                 data-alt="User avatar for Alex Johnson"
                                 style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUeeWvnYv87gi8xEJT_oj0166HeoOoWSKHvlam_U8q_sT8lkKUYw9RZiaHcdJTTfE0tPHgjoLuU7XHCC--ZY-sjgH7znV5YxV7spANiRbPXzxjm38zA3nx43zFDEqs5doS8cSjwRCYWKOze7QgbWpuQUYQD_7Lt4_tOzGgwysOvob_m3LyRsux4nzAplbasuZXek70DUypAanZxoyozz1va_VteveTeU4dY62rO0hOUBDI1wgtp4E6K1OHq8Uhvo5_NooB7QgFqvA")'}}></div>
                            <div className="hidden lg:flex flex-col text-left">
                                <p className="font-bold text-sm text-text-light-primary dark:text-dark-primary">Alex
                                    Johnson</p>
                                <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">Migration
                                    Operator</p>
                            </div>
                            <button
                                className="hidden lg:flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg text-text-light-secondary dark:text-text-dark-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-background-dark">
                                <span className="material-symbols-outlined">expand_more</span>
                            </button>
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 justify-center p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col w-full max-w-7xl">
                        <div className="flex flex-col md:flex-row flex-wrap justify-between items-start gap-3 mb-6">
                            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Dashboard</h1>
                            <div className="flex gap-3 flex-wrap justify-start">
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light-primary dark:text-dark-primary text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-background-dark">
                                    <span className="material-symbols-outlined mr-2">refresh</span>
                                    <span className="truncate">Run Validator</span>
                                </button>
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light-primary dark:text-dark-primary text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-background-dark">
                                    <span className="material-symbols-outlined mr-2">view_list</span>
                                    <span className="truncate">View All Jobs</span>
                                </button>
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-background-dark">
                                    <span className="material-symbols-outlined mr-2">add</span>
                                    <span className="truncate">Start New Migration</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 sm:gap-6">
                            <div
                                className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                                <p className="text-base font-medium leading-normal text-text-light-secondary dark:text-text-dark-secondary">Migrations
                                    Today</p>
                                <p className="text-primary dark:text-secondary tracking-light text-4xl font-bold leading-tight">14</p>
                                <p className="text-success text-sm font-medium leading-normal flex items-center gap-1">
                                    <span className="material-symbols-outlined"
                                          style={{fontSize: 16}}>arrow_upward</span>
                                    <span>+2% vs yesterday</span>
                                </p>
                            </div>
                            <div
                                className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                                <p className="text-base font-medium leading-normal text-text-light-secondary dark:text-text-dark-secondary">Pending
                                    Validations</p>
                                <p className="text-primary dark:text-secondary tracking-light text-4xl font-bold leading-tight">3</p>
                                <p className="text-warning text-sm font-medium leading-normal flex items-center gap-1">
                                    <span className="material-symbols-outlined"
                                          style={{fontSize: 16}}>hourglass_empty</span>
                                    <span>Awaiting manual review</span>
                                </p>
                            </div>
                            <div
                                className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                                <p className="text-base font-medium leading-normal text-text-light-secondary dark:text-text-dark-secondary">Last
                                    Run Status</p>
                                <p className="text-success tracking-light text-2xl font-bold leading-tight">Completed
                                    Successfully</p>
                                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-medium leading-normal">
                                    Today at 11:42 AM
                                </p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] px-1 pb-4">Recent
                                Activity</h2>
                            <div
                                className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden">
                                <ul className="divide-y divide-border-light dark:divide-border-dark">
                                    <li className="flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-150">
                                        <div
                                            className="flex items-center justify-center size-10 rounded-full bg-secondary/10 text-secondary">
                                            <span className="material-symbols-outlined">play_arrow</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-text-light-primary dark:text-dark-primary">Migration
                                                Job <span className="font-bold">#M4821</span> started.</p>
                                            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">2
                                                minutes ago</p>
                                        </div>
                                        <div
                                            className="text-sm font-medium text-secondary py-1 px-2.5 rounded-full bg-secondary/10">Running
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-150">
                                        <div
                                            className="flex items-center justify-center size-10 rounded-full bg-danger/10 text-danger">
                                            <span className="material-symbols-outlined">error_outline</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-text-light-primary dark:text-dark-primary">Validation
                                                failed for Batch <span className="font-bold">#B991</span>.</p>
                                            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">15
                                                minutes ago</p>
                                        </div>
                                        <div
                                            className="text-sm font-medium text-danger py-1 px-2.5 rounded-full bg-danger/10">Failed
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-150">
                                        <div
                                            className="flex items-center justify-center size-10 rounded-full bg-success/10 text-success">
                                            <span className="material-symbols-outlined">check_circle</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-text-light-primary dark:text-dark-primary">Migration
                                                Job <span className="font-bold">#M4820</span> completed successfully.
                                            </p>
                                            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">1
                                                hour ago</p>
                                        </div>
                                        <div
                                            className="text-sm font-medium text-success py-1 px-2.5 rounded-full bg-success/10">Success
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-150">
                                        <div
                                            className="flex items-center justify-center size-10 rounded-full bg-gray-500/10 text-gray-500 dark:text-gray-400">
                                            <span className="material-symbols-outlined">manage_accounts</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-text-light-primary dark:text-dark-primary">User <span
                                                className="font-bold">Pat Summers</span> switched to Admin role.</p>
                                            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">3
                                                hours ago</p>
                                        </div>
                                        <div
                                            className="text-sm font-medium text-gray-600 dark:text-gray-400 py-1 px-2.5 rounded-full bg-gray-500/10">System
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-150">
                                        <div
                                            className="flex items-center justify-center size-10 rounded-full bg-warning/10 text-warning">
                                            <span className="material-symbols-outlined">warning</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-text-light-primary dark:text-dark-primary">Pre-flight
                                                check for Job <span className="font-bold">#M4822</span> has a warning.
                                            </p>
                                            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">5
                                                hours ago</p>
                                        </div>
                                        <div
                                            className="text-sm font-medium text-warning py-1 px-2.5 rounded-full bg-warning/10">Warning
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="sticky bottom-0 z-10 p-2">
                    <div className="max-w-7xl mx-auto">
                        <div
                            className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-200 text-xs sm:text-sm text-center p-2 rounded-lg flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined" style={{fontSize: 18}}>security</span>
                            <span>This application uses mock/pseudonymized data for demonstration purposes only.</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default DashboardPage;