<?php

namespace App\Http\Controllers;

use App\Mail\EventInvitationMail;
use App\Models\Event;
use App\Models\EventAttendee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EventAttendeeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:attending,maybe,declined',
        ]);

        $attendee = EventAttendee::updateOrCreate(
            ['event_id' => $validated['event_id'], 'user_id' => $validated['user_id']],
            ['status' => $validated['status']]
        );

        // Send invitation email to the user
        $user = User::find($validated['user_id']);
        $event = Event::find($validated['event_id']);

        if ($user && $event) {
            Mail::queue(new EventInvitationMail($event, $user->name));
        }

        return response()->json($attendee, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EventAttendee $eventAttendee)
    {
        $validated = $request->validate([
            'status' => 'required|in:attending,maybe,declined',
        ]);

        $eventAttendee->update($validated);

        return response()->json($eventAttendee);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EventAttendee $eventAttendee)
    {
        $eventAttendee->delete();

        return response()->noContent();
    }
}
