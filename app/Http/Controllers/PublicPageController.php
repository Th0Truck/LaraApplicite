<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicPageController extends Controller
{
    public function show($slug)
    {
        $page = Page::where('slug', $slug)
            ->whereNotNull('published_at')
            ->with('paragraphs.comments.user')
            ->firstOrFail();

        return Inertia::render('page', [
            'page' => $page,
        ]);
    }
}
