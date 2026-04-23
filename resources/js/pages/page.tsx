import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
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
    return (
        <AppLayout>
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
                        <div key={paragraph.id} className="border rounded-lg p-6">
                            <p className="text-lg mb-4">{paragraph.content}</p>

                            <div className="space-y-4">
                                {paragraph.comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 rounded p-3">
                                        <p className="text-sm">{comment.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">by {comment.user.name}</p>
                                    </div>
                                ))}
                            </div>

                            <Form
                                {...store.form(paragraph.id)}
                                className="mt-4 space-y-2"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`comment-${paragraph.id}`}>Add Comment</Label>
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
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}