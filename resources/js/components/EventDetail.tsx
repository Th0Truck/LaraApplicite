import { useState, useEffect } from 'react';
import { Edit2, Trash2, MapPin, Clock, UserPlus, Download } from 'lucide-react';
import { format } from 'date-fns';
import InviteAttendees from '@/components/InviteAttendees';
import AttendeeRSVP from '@/components/AttendeeRSVP';

interface EventAttendee {
  id: number;
  user_id: number;
  status: 'attending' | 'maybe' | 'declined';
  user: {
    name: string;
    email: string;
  };
}

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  category?: string;
  user_id: number;
  user: {
    name: string;
  };
  attendees?: EventAttendee[];
}

interface EventDetailProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdate: (event: CalendarEvent) => void;
  onDelete: (eventId: number) => void;
}

export default function EventDetail({ event, onClose, onUpdate, onDelete }: EventDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [attendees, setAttendees] = useState<EventAttendee[]>(event.attendees || []);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/user');
      const user = await response.json();
      setCurrentUserId(user.id);
    } catch {
      console.error('Failed to fetch current user');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/users');
      const users = await response.json();
      setAllUsers(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/events/${event.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (!response.ok) throw new Error('Failed to delete event');

      onDelete(event.id);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAttendeeUpdate = (updatedAttendees: EventAttendee[]) => {
    setAttendees(updatedAttendees);
    setShowInvite(false);
  };

  const handleRSVPChange = (attendeeId: number, newStatus: string) => {
    setAttendees(attendees.map(a => 
      a.id === attendeeId ? { ...a, status: newStatus as any } : a
    ));
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  const isEventOwner = currentUserId === event.user_id;
  const currentUserAttendee = attendees.find(a => a.user_id === currentUserId);

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-white p-4 border-b border-gray-200">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              by {event.user.name}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = `/events/${event.id}/export`}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Export as iCal"
            >
              <Download size={18} className="text-green-600" />
            </button>
            <button
              onClick={() => {
                onUpdate(event);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Edit event"
            >
              <Edit2 size={18} className="text-blue-600" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              title="Delete event"
            >
              <Trash2 size={18} className="text-red-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {event.category && (
          <div className="flex gap-2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {event.category}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Start</p>
              <p className="font-medium text-gray-900">{formatDate(event.start_date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">End</p>
              <p className="font-medium text-gray-900">{formatDate(event.end_date)}</p>
            </div>
          </div>
        </div>

        {event.location && (
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{event.location}</p>
            </div>
          </div>
        )}

        {event.description && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Description</p>
            <p className="text-gray-900 leading-relaxed">{event.description}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Attendees</h3>
            {isEventOwner && (
              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <UserPlus size={16} />
                Invite
              </button>
            )}
          </div>

          <AttendeeRSVP
            attendees={attendees}
            isEventOwner={isEventOwner}
            currentUserId={currentUserId || 0}
            onStatusChange={handleRSVPChange}
          />
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>

      {showInvite && (
        <InviteAttendees
          eventId={event.id}
          currentAttendees={attendees}
          allUsers={allUsers}
          onClose={() => setShowInvite(false)}
          onInviteSent={handleAttendeeUpdate}
        />
      )}
    </div>
  );
}
