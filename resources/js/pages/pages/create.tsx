import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/pages';

export default function Create() {
    return (
        <AuthLayout
            title="Create Page"
            description="Create a new page"
        >
            <Head title="Create Page" />

            <Form
                {...store.form()}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
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
                                required
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
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
                            />
                            <InputError message={errors.published_at} />
                        </div>

                        <Button type="submit" disabled={processing}>
                            Create Page
                        </Button>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}