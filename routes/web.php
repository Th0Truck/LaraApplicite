<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventAttendeeController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ParagraphController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('pages', PageController::class)->middleware('auth');

Route::resource('pages.paragraphs', ParagraphController::class)->middleware('auth');

Route::get('p/{slug}', [PublicPageController::class, 'show'])->name('public.page');

Route::post('paragraphs/{paragraph}/comments', [CommentController::class, 'store'])->name('comments.store');

// Event Planner Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Page for calendar UI
    Route::get('calendar', function () {
        return Inertia::render('EventPlanner');
    })->name('events.calendar');

    // Users for invitations
    Route::get('users', [UserController::class, 'index'])->name('users.index');

    // API routes for event CRUD
    Route::get('events', [EventController::class, 'index'])->name('events.index');
    Route::post('events', [EventController::class, 'store'])->name('events.store');
    Route::get('events/{event}', [EventController::class, 'show'])->name('events.show');
    Route::put('events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('events/{event}', [EventController::class, 'destroy'])->name('events.destroy');
    
    // iCal export routes
    Route::get('events/{event}/export', [EventController::class, 'exportEvent'])->name('events.export');
    Route::get('events/export/all', [EventController::class, 'exportAllEvents'])->name('events.export-all');
    
    Route::post('event-attendees', [EventAttendeeController::class, 'store'])->name('event-attendees.store');
    Route::put('event-attendees/{eventAttendee}', [EventAttendeeController::class, 'update'])->name('event-attendees.update');
    Route::delete('event-attendees/{eventAttendee}', [EventAttendeeController::class, 'destroy'])->name('event-attendees.destroy');
});

require __DIR__.'/settings.php';
