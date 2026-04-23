import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { create, show, edit } from '@/routes/pages';

interface Page {
    id: number;
    title: string;
    slug: string;
    published_at: string | null;
}

interface Props {
    pages: Page[];
}

export default function Index({ pages }: Props) {
    return (
        <AuthLayout
            title="Pages"
            description="Manage your pages"
        >
            <Head title="Pages" />

            <div className="flex items-center justify-between">
                <div />
                <Button asChild>
                    <Link href={create().url}>Create Page</Link>
                </Button>
            </div>

            <div className="mt-12 space-y-4">
                {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <h3 className="font-semibold">{page.title}</h3>
                            <p className="text-sm text-muted-foreground">/{page.slug}</p>
                            <p className="text-xs text-muted-foreground">
                                {page.published_at ? 'Published' : 'Draft'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={show(page.id).url}>View</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={edit(page.id).url}>Edit</Link>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </AuthLayout>
    );
}