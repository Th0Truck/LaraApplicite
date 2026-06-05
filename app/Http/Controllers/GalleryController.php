<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        return Inertia::render('gallery/index', [
            'items' => GalleryItem::orderBy('sort_order')
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('gallery/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|max:5120',
            'alt_text' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_published' => 'nullable|boolean',
        ]);

        $validated['image_path'] = $request->file('image')->store('gallery', 'public');
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_published'] = $request->boolean('is_published');
        unset($validated['image']);

        GalleryItem::create($validated);

        return redirect()->route('gallery.index');
    }

    public function edit(GalleryItem $gallery)
    {
        return Inertia::render('gallery/edit', [
            'item' => $gallery,
        ]);
    }

    public function update(Request $request, GalleryItem $gallery)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'alt_text' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_published' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($gallery->image_path);
            $validated['image_path'] = $request->file('image')->store('gallery', 'public');
        }

        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_published'] = $request->boolean('is_published');
        unset($validated['image']);

        $gallery->update($validated);

        return redirect()->route('gallery.index');
    }

    public function destroy(GalleryItem $gallery)
    {
        Storage::disk('public')->delete($gallery->image_path);
        $gallery->delete();

        return redirect()->route('gallery.index');
    }

    public function publicIndex()
    {
        return Inertia::render('gallery', [
            'items' => GalleryItem::where('is_published', true)
                ->orderBy('sort_order')
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }
}
