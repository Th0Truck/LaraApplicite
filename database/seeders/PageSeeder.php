<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Page::where('slug', 'sample-page')->exists()) {
            return;
        }

        $page = Page::create([
            'title' => 'Sample Page',
            'slug' => 'sample-page',
            'content' => 'This is a sample page with some content.',
            'published_at' => now(),
        ]);

        $page->paragraphs()->create([
            'content' => 'This is the first paragraph. You can comment on it.',
            'order' => 1,
        ]);

        $page->paragraphs()->create([
            'content' => 'This is the second paragraph. Feel free to add your thoughts.',
            'order' => 2,
        ]);
    }
}
