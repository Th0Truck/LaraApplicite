import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AuthLayout from '@/layouts/auth-layout';

interface GalleryItem {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
    alt_text: string | null;
    sort_order: number;
    is_published: boolean;
}

interface Props {
    item: GalleryItem;
}

export default function Edit({ item }: Props) {
    return (
        <AuthLayout title="Edit Gallery Image" description="Update gallery image details">
            <Head title="Edit Gallery Image" />

            <div className="mb-6 aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
                <img
                    src={`/storage/${item.image_path}`}
                    alt={item.alt_text || item.title}
                    className="h-full w-full object-cover"
                />
            </div>

            <Form
                action={`/dashboard/gallery/${item.id}`}
                method="post"
                encType="multipart/form-data"
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="_method" value="PATCH" />

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" defaultValue={item.title} required autoFocus />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="image">Replace Image</Label>
                            <Input id="image" name="image" type="file" accept="image/*" />
                            <InputError message={errors.image} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alt_text">Alt Text</Label>
                            <Input id="alt_text" name="alt_text" defaultValue={item.alt_text || ''} />
                            <InputError message={errors.alt_text} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" defaultValue={item.description || ''} rows={4} />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                min="0"
                                defaultValue={item.sort_order}
                            />
                            <InputError message={errors.sort_order} />
                        </div>

                        <label className="flex items-center gap-2 text-sm font-medium">
                            <input
                                type="checkbox"
                                name="is_published"
                                value="1"
                                defaultChecked={item.is_published}
                                className="h-4 w-4 rounded border-input"
                            />
                            Published
                        </label>
                        <InputError message={errors.is_published} />

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Update Image
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
