<?php

namespace App\Services;

use App\Models\Event;

class ICalService
{
    /**
     * Generate iCal format for a single event.
     */
    public static function generateEventIcal(Event $event): string
    {
        $start = $event->start_date->format('Ymd\THis');
        $end = $event->end_date->format('Ymd\THis');
        $created = $event->created_at->format('Ymd\THis');
        $modified = $event->updated_at->format('Ymd\THis');
        $uid = md5($event->id.$event->title);

        $attendees = '';
        foreach ($event->attendees as $attendee) {
            $attendees .= "ATTENDEE;CN={$attendee->user->name};PARTSTAT={$this->mapStatus($attendee->status)}:mailto:{$attendee->user->email}\r\n";
        }

        $ical = "BEGIN:VCALENDAR\r\n";
        $ical .= "VERSION:2.0\r\n";
        $ical .= "PRODID:-//Event Planner//EN\r\n";
        $ical .= "CALSCALE:GREGORIAN\r\n";
        $ical .= "BEGIN:VEVENT\r\n";
        $ical .= "UID:{$uid}\r\n";
        $ical .= "DTSTAMP:{$created}\r\n";
        $ical .= "DTSTART:{$start}\r\n";
        $ical .= "DTEND:{$end}\r\n";
        $ical .= "SUMMARY:{$event->title}\r\n";

        if ($event->description) {
            $description = preg_replace('/[\r\n]+/', '\n ', $event->description);
            $ical .= "DESCRIPTION:{$description}\r\n";
        }

        if ($event->location) {
            $ical .= "LOCATION:{$event->location}\r\n";
        }

        $ical .= "ORGANIZER;CN={$event->user->name}:mailto:{$event->user->email}\r\n";

        if ($attendees) {
            $ical .= $attendees;
        }

        $ical .= "LAST-MODIFIED:{$modified}\r\n";
        $ical .= "SEQUENCE:0\r\n";
        $ical .= "STATUS:CONFIRMED\r\n";
        $ical .= "TRANSP:OPAQUE\r\n";
        $ical .= "END:VEVENT\r\n";
        $ical .= "END:VCALENDAR\r\n";

        return $ical;
    }

    /**
     * Generate iCal format for multiple events.
     */
    public static function generateMultipleEventsIcal($events): string
    {
        $ical = "BEGIN:VCALENDAR\r\n";
        $ical .= "VERSION:2.0\r\n";
        $ical .= "PRODID:-//Event Planner//EN\r\n";
        $ical .= "CALSCALE:GREGORIAN\r\n";
        $ical .= "X-WR-CALNAME:My Events\r\n";

        foreach ($events as $event) {
            $start = $event->start_date->format('Ymd\THis');
            $end = $event->end_date->format('Ymd\THis');
            $created = $event->created_at->format('Ymd\THis');
            $modified = $event->updated_at->format('Ymd\THis');
            $uid = md5($event->id.$event->title);

            $ical .= "BEGIN:VEVENT\r\n";
            $ical .= "UID:{$uid}\r\n";
            $ical .= "DTSTAMP:{$created}\r\n";
            $ical .= "DTSTART:{$start}\r\n";
            $ical .= "DTEND:{$end}\r\n";
            $ical .= "SUMMARY:{$event->title}\r\n";

            if ($event->description) {
                $description = preg_replace('/[\r\n]+/', '\n ', $event->description);
                $ical .= "DESCRIPTION:{$description}\r\n";
            }

            if ($event->location) {
                $ical .= "LOCATION:{$event->location}\r\n";
            }

            $ical .= "ORGANIZER;CN={$event->user->name}:mailto:{$event->user->email}\r\n";
            $ical .= "LAST-MODIFIED:{$modified}\r\n";
            $ical .= "SEQUENCE:0\r\n";
            $ical .= "STATUS:CONFIRMED\r\n";
            $ical .= "TRANSP:OPAQUE\r\n";
            $ical .= "END:VEVENT\r\n";
        }

        $ical .= "END:VCALENDAR\r\n";

        return $ical;
    }

    /**
     * Map event attendance status to iCal PARTSTAT.
     */
    private static function mapStatus(string $status): string
    {
        return match ($status) {
            'attending' => 'ACCEPTED',
            'maybe' => 'TENTATIVE',
            'declined' => 'DECLINED',
            default => 'NEEDS-ACTION',
        };
    }
}
