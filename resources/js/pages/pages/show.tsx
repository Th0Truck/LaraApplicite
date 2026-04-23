import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { edit } from '@/routes/pages';
import { store as storeParagraph, update as updateParagraph, destroy as destroyParagraph } from '@/routes/pages/paragraphs';
import { Textarea } from '@/components/ui/textarea';

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

export default function Show({ page }: Props) {
    return (
        <AuthLayout
            title={page.title}
            description="Page details"
        >
            <Head title={page.title} />

            <div className="flex items-center justify-between">
                <div />
                <Button variant="outline" asChild>
                    <Link href={edit(page.id).url}>Edit Page</Link>
                </Button>
            </div>

            <div className="mt-6">
                <h1 className="text-2xl font-bold">{page.title}</h1>
                <p className="text-muted-foreground">/{page.slug}</p>

                {page.content && (
                    <div className="mt-4 prose">
                        {page.content}
                    </div>
                )}

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Paragraphs</h2>

                    <Form
                        {...storeParagraph.form(page.id)}
                        className="mb-6 space-y-2"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">Add Paragraph</Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        placeholder="Enter paragraph content..."
                                        required
                                    />
                                    <InputError message={errors.content} />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    Add Paragraph
                                </Button>
                            </>
                        )}
                    </Form>

                    <div className="space-y-6">
                        {page.paragraphs.map((paragraph) => (
                            <div key={paragraph.id} className="rounded-lg border p-4">
                                <Form
                                    {...updateParagraph.form({ page: page.id, paragraph: paragraph.id })}
                                    className="space-y-2"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <Textarea
                                                name="content"
                                                defaultValue={paragraph.content}
                                                required
                                            />
                                            <InputError message={errors.content} />
                                            <div className="flex gap-2">
                                                <Button type="submit" size="sm" disabled={processing}>
                                                    Update
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('Delete this paragraph?')) {
                                                            destroyParagraph({ page: page.id, paragraph: paragraph.id });
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>

                                <div className="mt-4 space-y-2">
                                    {paragraph.comments.map((comment) => (
                                        <div key={comment.id} className="rounded bg-muted p-2">
                                            <p className="text-sm">{comment.content}</p>
                                            <p className="text-xs text-muted-foreground">by {comment.user.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}