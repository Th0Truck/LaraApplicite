import { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchJson } from '@/lib/utils';
import EventForm from '@/components/EventForm';
import EventDetail from '@/components/EventDetail';
import SearchFilter from '@/components/SearchFilter';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  category?: string;
  user_id: number;
  user?: any;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  attendees?: any[];
}

export default function EventPlanner() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(events
      .filter(e => e.category)
      .map(e => e.category!)
    );
    return Array.from(cats).sort();
  }, [events]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await fetchJson('/events');
      const formattedEvents = data.map((event: any) => ({
        ...event,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowForm(false);
  };

  const normalizeEvent = (event: any): CalendarEvent => ({
    ...event,
    start: event.start ? new Date(event.start) : new Date(event.start_date),
    end: event.end ? new Date(event.end) : new Date(event.end_date),
  });

  const handleEventCreated = (newEvent: any) => {
    setEvents([...events, normalizeEvent(newEvent)]);
    setShowForm(false);
  };

  const handleEventUpdated = (updatedEvent: any) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? normalizeEvent(updatedEvent) : e));
    setSelectedEvent(null);
  };

  const handleEventDeleted = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
    setSelectedEvent(null);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading events...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Event Planner</h1>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Event
          </button>
        </div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={null}
        onStatusChange={() => {}}
        categories={categories}
        statuses={['attending', 'maybe', 'declined']}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onNavigate={setCurrentDate}
            onView={(view: any) => setCurrentView(view as 'month' | 'week' | 'day' | 'agenda')}
            view={currentView}
            date={currentDate}
            views={['month', 'week', 'day', 'agenda']}
            selectable
            popup
          />
        </div>

        <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
          {showForm ? (
            <EventForm
              event={selectedEvent}
              onClose={() => setShowForm(false)}
              onSave={selectedEvent ? handleEventUpdated : handleEventCreated}
            />
          ) : selectedEvent ? (
            <EventDetail
              event={selectedEvent as any}
              onClose={() => setSelectedEvent(null)}
              onUpdate={handleEventUpdated}
              onDelete={handleEventDeleted}
            />
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>Select an event to view details</p>
              <p className="text-sm mt-2">or create a new event</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
