<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Paragraph;
use Illuminate\Http\Request;

class ParagraphController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Page $page)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $page->paragraphs()->create([
            'content' => $request->content,
            'order' => $page->paragraphs()->max('order') + 1,
        ]);

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page, Paragraph $paragraph)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $paragraph->update($request->only('content'));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page, Paragraph $paragraph)
    {
        $paragraph->delete();

        return back();
    }
}
