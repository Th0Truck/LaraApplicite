import { Link, usePage } from '@inertiajs/react';
import { type ReactNode, useState } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { SharedData } from '@/types';
import type { PageMenuItem } from '@/types/navigation';

type NavItem = {
    href: string;
    label: string;
};

type TopBarProps = {
    title?: string;
    brand?: ReactNode;
    navItems?: NavItem[];
};

export default function TopBar({
    title = 'App',
    brand,
    navItems = [
        { href: '/', label: 'Home' },
        { href: '/calendar', label: 'Calendar' },
    ],
}: TopBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { pages } = usePage<SharedData>().props;
    const { isCurrentUrl } = useCurrentUrl();

    const pageItems = (pages ?? []).map((page: PageMenuItem) => ({
        href: `/p/${page.slug}`,
        label: page.title,
    }));
    const combinedNavItems = [...navItems, ...pageItems];

    const linkBase = 'px-3 py-3 rounded-md text-sm font-medium my-2';
    const activeLink = 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white';
    const inactiveLink = 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300';

    const mobileBase = 'block px-3 py-2 rounded-md text-base font-medium';
    const activeMobile = 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white';
    const inactiveMobile = 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300';

    return (
        <header className="bg-white shadow dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {brand ? (
                            <div className="flex items-center gap-3">
                                {brand}
                                {title && <span className="sr-only">{title}</span>}
                            </div>
                        ) : (
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                        )}
                    </div>
                    <div className="hidden md:flex space-x-8">
                        {combinedNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${linkBase} ${isCurrentUrl(item.href) ? activeLink : inactiveLink}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:text-gray-700 dark:focus:text-gray-300"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 0 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                                    />
                                ) : (
                                    <path
                                        fillRule="evenodd"
                                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow">
                        {combinedNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${mobileBase} ${isCurrentUrl(item.href) ? activeMobile : inactiveMobile}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
