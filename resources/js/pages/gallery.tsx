import { Head } from '@inertiajs/react';
import PageLayout from '@/layouts/page-layout';

interface GalleryItem {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
    alt_text: string | null;
}

interface Props {
    items: GalleryItem[];
}

export default function Gallery({ items }: Props) {
    return (
        <PageLayout title="Gallery">
            <Head title="Gallery" />

            <section className="py-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery</h1>
                    <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
                        Browse the latest published images.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <figure key={item.id} className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={`/storage/${item.image_path}`}
                                    alt={item.alt_text || item.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <figcaption className="p-4">
                                <h2 className="font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                                {item.description && (
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        {item.description}
                                    </p>
                                )}
                            </figcaption>
                        </figure>
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="rounded-lg border border-dashed bg-white p-8 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        The gallery is empty for now.
                    </div>
                )}
            </section>
        </PageLayout>
    );
}
