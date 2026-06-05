import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';

export default function Create() {
    return (
        <AuthLayout title="Add Gallery Image" description="Upload a new image for the public gallery">
            <Head title="Add Gallery Image" />

            <Form action="/dashboard/gallery" method="post" encType="multipart/form-data" className="space-y-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required autoFocus />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="image">Image</Label>
                            <Input id="image" name="image" type="file" accept="image/*" required />
                            <InputError message={errors.image} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alt_text">Alt Text</Label>
                            <Input id="alt_text" name="alt_text" />
                            <InputError message={errors.alt_text} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" rows={4} />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input id="sort_order" name="sort_order" type="number" min="0" defaultValue="0" />
                            <InputError message={errors.sort_order} />
                        </div>

                        <label className="flex items-center gap-2 text-sm font-medium">
                            <input
                                type="checkbox"
                                name="is_published"
                                value="1"
                                defaultChecked
                                className="h-4 w-4 rounded border-input"
                            />
                            Published
                        </label>
                        <InputError message={errors.is_published} />

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Add Image
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/gallery">Cancel</Link>
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
