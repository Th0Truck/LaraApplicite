<?php

namespace App\Http\Controllers;

use App\Mail\EventCreatedMail;
use App\Mail\EventUpdatedMail;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $events = Event::where('user_id', $user->id)
            ->orWhereHas('attendees', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('user', 'attendees.user')
            ->get();

        return response()->json($events);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date_format:Y-m-d\TH:i:s',
            'end_date' => 'required|date_format:Y-m-d\TH:i:s|after:start_date',
            'location' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:50',
            'is_recurring' => 'boolean',
            'recurrence_pattern' => 'nullable|in:daily,weekly,monthly',
        ]);

        $event = Event::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        // Send notification email to all other users
        $otherUsers = \App\Models\User::where('id', '!=', auth()->id())->get();
        foreach ($otherUsers as $user) {
            Mail::queue(new EventCreatedMail($event));
        }

        return response()->json($event, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        $this->authorize('view', $event);

        return response()->json($event->load('user', 'attendees.user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'date_format:Y-m-d\TH:i:s',
            'end_date' => 'date_format:Y-m-d\TH:i:s',
            'location' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:50',
            'is_recurring' => 'boolean',
            'recurrence_pattern' => 'nullable|in:daily,weekly,monthly',
        ]);

        $event->update($validated);

        // Notify attendees of the update
        foreach ($event->attendees as $attendee) {
            Mail::queue(new EventUpdatedMail($event->fresh()));
        }

        return response()->json($event);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        $event->delete();

        return response()->noContent();
    }

    /**
     * Export a single event as iCal.
     */
    public function exportEvent(Event $event)
    {
        $this->authorize('view', $event);

        $ical = \App\Services\ICalService::generateEventIcal($event->load('attendees.user'));

        return response($ical)
            ->header('Content-Type', 'text/calendar; charset=utf-8')
            ->header('Content-Disposition', "attachment; filename=\"{$event->title}.ics\"");
    }

    /**
     * Export all user's events as iCal.
     */
    public function exportAllEvents()
    {
        $user = auth()->user();
        
        $events = Event::where('user_id', $user->id)
            ->orWhereHas('attendees', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('user', 'attendees.user')
            ->get();

        $ical = \App\Services\ICalService::generateMultipleEventsIcal($events);

        return response($ical)
            ->header('Content-Type', 'text/calendar; charset=utf-8')
            ->header('Content-Disposition', 'attachment; filename="calendar.ics"');
    }
}
