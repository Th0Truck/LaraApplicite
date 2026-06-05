import { Form, Head } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageLayout from '@/layouts/page-layout';
import { store } from '@/routes/comments';

interface Comment {
    id: number;
    content: string;
    user: {
        name: string;
    };
}

interface Paragraph {
    id: number;
    content: string;
    comments: Comment[];
}

interface Page {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    paragraphs: Paragraph[];
}

interface Props {
    page: Page;
}

export default function Page({ page }: Props) {
    const [openComments, setOpenComments] = useState<Set<number>>(new Set());

    const toggleCommentForm = (paragraphId: number) => {
        const newSet = new Set(openComments);
        if (newSet.has(paragraphId)) {
            newSet.delete(paragraphId);
        } else {
            newSet.add(paragraphId);
        }
        setOpenComments(newSet);
    };

    return (
        <PageLayout title={page.title}>
            <Head title={page.title} />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">{page.title}</h1>

                {page.content && (
                    <div className="mb-8 prose max-w-none">
                        {page.content}
                    </div>
                )}

                <div className="space-y-8">
                    {page.paragraphs.map((paragraph) => (
                        <div key={paragraph.id} className="border rounded-lg p-6 bg-white shadow-sm dark:bg-gray-800">
                            <p className="text-lg mb-4">{paragraph.content}</p>

                            <div className="space-y-4">
                                {paragraph.comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 rounded p-3 dark:bg-gray-900">
                                        <p className="text-sm">{comment.content}</p>
                                        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">by {comment.user.name}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 border-t pt-4">
                                <button
                                    type="button"
                                    onClick={() => toggleCommentForm(paragraph.id)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                                >
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-300 ${
                                            openComments.has(paragraph.id) ? 'rotate-180' : ''
                                        }`}
                                    />
                                    Add Comment
                                </button>
                            </div>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    openComments.has(paragraph.id)
                                        ? 'max-h-96 opacity-100 mt-4'
                                        : 'max-h-0 opacity-0'
                                }`}
                            >
                                <Form
                                    {...store.form(paragraph.id)}
                                    className="space-y-2"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor={`comment-${paragraph.id}`}>Your Comment</Label>
                                                <Input
                                                    id={`comment-${paragraph.id}`}
                                                    name="content"
                                                    placeholder="Write a comment..."
                                                    required
                                                />
                                                <InputError message={errors.content} />
                                            </div>
                                            <Button type="submit" size="sm" disabled={processing}>
                                                Comment
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}