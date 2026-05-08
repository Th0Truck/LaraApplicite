import { Head } from '@inertiajs/react';
import PageLayout from '@/layouts/page-layout';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <PageLayout
                title="Welcome"
                brand={<span className="text-xl font-bold text-gray-900 dark:text-white">Applicite</span>}
                navItems={[
                    { href: '/', label: 'Home' },
                    { href: '/calendar', label: 'Calendar' },
                ]}
            >
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Our App</h1>
                <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                    This is some placeholder text for the welcome page. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    More placeholder text here. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </PageLayout>
        </>
    );
}
