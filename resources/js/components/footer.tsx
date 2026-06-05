export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white dark:border-gray-900 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Applicite. All rights reserved.
            </div>
        </footer>
    );
}
