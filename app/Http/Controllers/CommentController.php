<?php

namespace App\Http\Controllers;

use App\Models\Paragraph;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Paragraph $paragraph)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $paragraph->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return back();
    }
}
