Hello {{ $recipientName }},

You have been invited to the following event:

**{{ $event->title }}**

<x-mail::panel>
**Date & Time:** {{ $event->start_date }} - {{ $event->end_date }}

@if($event->location)
**Location:** {{ $event->location }}
@endif

@if($event->description)
**Description:** {{ $event->description }}
@endif
</x-mail::panel>

<x-mail::button :url="route('events.calendar')">
View Event in Calendar
</x-mail::button>

Thanks,
{{ config('app.name') }}
