import { useState } from 'react';
import { Check, Clock, XCircle } from 'lucide-react';
import { fetchJson } from '@/lib/utils';

interface Attendee {
  id: number;
  user: {
    name: string;
  };
  status: 'attending' | 'maybe' | 'declined';
  pivot_id?: number;
}

interface AttendeeRSVPProps {
  attendees: Attendee[];
  isEventOwner: boolean;
  currentUserId: number;
  onStatusChange: (attendeeId: number, newStatus: 'attending' | 'maybe' | 'declined') => void;
}

export default function AttendeeRSVP({
  attendees,
  isEventOwner,
  currentUserId,
  onStatusChange,
}: AttendeeRSVPProps) {
  const [loading, setLoading] = useState<number | null>(null);

  const statusGroups = {
    attending: attendees.filter(a => a.status === 'attending'),
    maybe: attendees.filter(a => a.status === 'maybe'),
    declined: attendees.filter(a => a.status === 'declined'),
  };

  const handleStatusChange = async (attendeeId: number, newStatus: 'attending' | 'maybe' | 'declined') => {
    setLoading(attendeeId);
    try {
      await fetchJson(`/event-attendees/${attendeeId}`, {
        method: 'PUT',
        body: { status: newStatus },
      });
      onStatusChange(attendeeId, newStatus);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      alert('Failed to update RSVP status');
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attending':
        return 'text-green-700 bg-green-50';
      case 'maybe':
        return 'text-yellow-700 bg-yellow-50';
      case 'declined':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const StatusButton = ({ status, label, icon: Icon }: any) => (
    <button
      className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded hover:opacity-75 transition"
      disabled={loading !== null}
    >
      <Icon size={14} />
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 text-lg">Attendees</h3>

      {statusGroups.attending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Check size={18} className="text-green-600" />
            <h4 className="font-medium text-green-900">
              Attending ({statusGroups.attending.length})
            </h4>
          </div>
          <div className="space-y-2">
            {statusGroups.attending.map(attendee => (
              <AttendeeRow
                key={attendee.id}
                attendee={attendee}
                isEventOwner={isEventOwner}
                isCurrentUser={attendee.id === currentUserId}
                loading={loading === attendee.id}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {statusGroups.maybe.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-yellow-600" />
            <h4 className="font-medium text-yellow-900">
              Maybe ({statusGroups.maybe.length})
            </h4>
          </div>
          <div className="space-y-2">
            {statusGroups.maybe.map(attendee => (
              <AttendeeRow
                key={attendee.id}
                attendee={attendee}
                isEventOwner={isEventOwner}
                isCurrentUser={attendee.id === currentUserId}
                loading={loading === attendee.id}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {statusGroups.declined.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-red-600" />
            <h4 className="font-medium text-red-900">
              Declined ({statusGroups.declined.length})
            </h4>
          </div>
          <div className="space-y-2">
            {statusGroups.declined.map(attendee => (
              <AttendeeRow
                key={attendee.id}
                attendee={attendee}
                isEventOwner={isEventOwner}
                isCurrentUser={attendee.id === currentUserId}
                loading={loading === attendee.id}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {attendees.length === 0 && (
        <p className="text-center text-gray-500 py-4">No attendees yet</p>
      )}
    </div>
  );
}

function AttendeeRow({
  attendee,
  isEventOwner,
  isCurrentUser,
  loading,
  onStatusChange,
}: any) {
  return (
    <div className={`p-3 rounded-lg flex items-center justify-between ${getStatusBgColor(attendee.status)}`}>
      <p className="text-sm font-medium text-gray-900">{attendee.user.name}</p>
      {(isCurrentUser || isEventOwner) && (
        <div className="flex gap-1">
          {['attending', 'maybe', 'declined'].map(status => (
            <button
              key={status}
              onClick={() => onStatusChange(attendee.id, status as any)}
              className={`px-2 py-1 text-xs rounded transition ${getButtonClass(status as string, attendee.status, loading)}`}
              disabled={loading}
            >
              {status === 'attending' && <Check size={14} />}
              {status === 'maybe' && <Clock size={14} />}
              {status === 'declined' && <XCircle size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusBgColor(status: string): string {
  switch (status) {
    case 'attending':
      return 'bg-green-50';
    case 'maybe':
      return 'bg-yellow-50';
    case 'declined':
      return 'bg-red-50';
    default:
      return 'bg-gray-50';
  }
}

function getButtonClass(status: string, currentStatus: string, loading: boolean): string {
  const base = 'px-2 py-1 text-xs rounded transition disabled:opacity-50';
  const isActive = status === currentStatus;

  if (status === 'attending') {
    return `${base} ${isActive ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`;
  }
  if (status === 'maybe') {
    return `${base} ${isActive ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`;
  }
  if (status === 'declined') {
    return `${base} ${isActive ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`;
  }
  return base;
}
