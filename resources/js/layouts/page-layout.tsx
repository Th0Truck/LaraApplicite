import type { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell';
import TopBar from '@/components/top-bar';
import Footer from '@/components/footer';

type NavItem = {
    href: string;
    label: string;
};

type PageLayoutProps = {
    children: ReactNode;
    title?: string;
    brand?: ReactNode;
    navItems?: NavItem[];
};

export default function PageLayout({
    children,
    title = 'Applicite',
    brand,
    navItems,
}: PageLayoutProps) {
    return (
        <AppShell>
            <TopBar title={title} brand={brand} navItems={navItems} />

            <main className="flex-1 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    {children}
                </div>
            </main>
        </AppShell>
    );
}
