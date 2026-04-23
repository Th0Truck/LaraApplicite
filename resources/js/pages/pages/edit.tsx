import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/pages';

interface Page {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    published_at: string | null;
}

interface Props {
    page: Page;
}

export default function Edit({ page }: Props) {
    return (
        <AuthLayout
            title="Edit Page"
            description="Edit the page details"
        >
            <Head title="Edit Page" />

            <Form
                {...update.form(page.id)}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={page.title}
                                required
                                autoFocus
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                defaultValue={page.slug}
                                required
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                defaultValue={page.content || ''}
                                rows={4}
                            />
                            <InputError message={errors.content} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="published_at">Publish At (optional)</Label>
                            <Input
                                id="published_at"
                                name="published_at"
                                type="datetime-local"
                                defaultValue={page.published_at ? new Date(page.published_at).toISOString().slice(0, 16) : ''}
                            />
                            <InputError message={errors.published_at} />
                        </div>

                        <Button type="submit" disabled={processing}>
                            Update Page
                        </Button>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}