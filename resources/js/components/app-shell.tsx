import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import Footer from '@/components/footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { SharedData } from '@/types';

type Props = {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
};

const excludedFooterPages = ['Dashboard', 'EventPlanner'];

export function AppShell({ children, variant = 'header' }: Props) {
    const { component, props } = usePage<SharedData>();
    const isOpen = props.sidebarOpen;
    const showFooter = !excludedFooterPages.includes(component || '');

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                {children}
                {showFooter && <Footer />}
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <div className="min-h-screen flex flex-col">
                {children}
                {showFooter && <Footer />}
            </div>
        </SidebarProvider>
    );
}
