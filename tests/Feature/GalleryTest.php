<?php

use App\Models\GalleryItem;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests cannot manage gallery items', function () {
    $this->get(route('gallery.index'))->assertRedirect(route('login'));
});

test('public gallery only shows published items', function () {
    GalleryItem::create([
        'title' => 'Published image',
        'image_path' => 'gallery/published.jpg',
        'is_published' => true,
    ]);

    GalleryItem::create([
        'title' => 'Draft image',
        'image_path' => 'gallery/draft.jpg',
        'is_published' => false,
    ]);

    $response = $this->get(route('gallery.public'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('gallery')
        ->has('items', 1)
        ->where('items.0.title', 'Published image')
    );
});

test('authenticated users can upload gallery images', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('gallery.store'), [
            'title' => 'Launch party',
            'description' => 'People gathered at the venue.',
            'alt_text' => 'Guests at a launch party',
            'sort_order' => 3,
            'is_published' => '1',
            'image' => UploadedFile::fake()->image('launch.jpg'),
        ]);

    $response->assertRedirect(route('gallery.index'));

    $item = GalleryItem::first();

    expect($item)->not->toBeNull()
        ->and($item->title)->toBe('Launch party')
        ->and($item->is_published)->toBeTrue();

    Storage::disk('public')->assertExists($item->image_path);
});

test('updating a gallery image replaces the stored file', function () {
    Storage::fake('public');

    $oldPath = UploadedFile::fake()->image('old.jpg')->store('gallery', 'public');
    $item = GalleryItem::create([
        'title' => 'Old title',
        'image_path' => $oldPath,
        'is_published' => true,
    ]);

    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('gallery.update', $item), [
            '_method' => 'PATCH',
            'title' => 'New title',
            'sort_order' => 1,
            'image' => UploadedFile::fake()->image('new.jpg'),
        ]);

    $response->assertRedirect(route('gallery.index'));

    $item->refresh();

    expect($item->title)->toBe('New title')
        ->and($item->image_path)->not->toBe($oldPath)
        ->and($item->is_published)->toBeFalse();

    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($item->image_path);
});

test('deleting a gallery item removes its image', function () {
    Storage::fake('public');

    $path = UploadedFile::fake()->image('image.jpg')->store('gallery', 'public');
    $item = GalleryItem::create([
        'title' => 'Image',
        'image_path' => $path,
    ]);

    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->delete(route('gallery.destroy', $item))
        ->assertRedirect(route('gallery.index'));

    $this->assertDatabaseMissing('gallery_items', ['id' => $item->id]);
    Storage::disk('public')->assertMissing($path);
});
