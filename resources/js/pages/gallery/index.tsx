import { Form, Head, Link } from '@inertiajs/react';
import { Edit, ImagePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    items: GalleryItem[];
}

export default function Index({ items }: Props) {
    return (
        <AuthLayout title="Gallery" description="Manage gallery images">
            <Head title="Gallery" />

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        {items.length} {items.length === 1 ? 'image' : 'images'}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/gallery/create">
                        <ImagePlus className="h-4 w-4" />
                        Add Image
                    </Link>
                </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-lg border bg-background">
                        <div className="aspect-[4/3] bg-muted">
                            <img
                                src={`/storage/${item.image_path}`}
                                alt={item.alt_text || item.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="space-y-4 p-4">
                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <span className="text-xs text-muted-foreground">
                                        #{item.sort_order}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {item.is_published ? 'Published' : 'Draft'}
                                </p>
                                {item.description && (
                                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/gallery/${item.id}/edit`}>
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Form action={`/dashboard/gallery/${item.id}`} method="delete">
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            size="sm"
                                            disabled={processing}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    Add your first gallery image to publish it on the site.
                </div>
            )}
        </AuthLayout>
    );
}
