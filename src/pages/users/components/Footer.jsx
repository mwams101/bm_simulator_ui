const Footer = () => {
    return (
        <footer className="w-full py-3 px-10 border-t border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-background-dark/80 backdrop-blur-md">
            <div className="flex justify-between items-center max-w-[1200px] mx-auto text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                <p>© 2023 BankSim Data Migration Platform</p>
                <div className="flex gap-4">
                    <a className="hover:text-primary transition-colors" href="#">Documentation</a>
                    <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-primary transition-colors" href="#">System Status</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;