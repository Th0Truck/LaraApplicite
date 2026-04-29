import { useState, useMemo } from 'react';
import { X, UserPlus, Check, Clock, XCircle } from 'lucide-react';
import { fetchJson } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Attendee {
  id: number;
  user_id: number;
  status: 'attending' | 'maybe' | 'declined';
  user: {
    name: string;
    email: string;
  };
}

interface InviteAttendeesProps {
  eventId: number;
  currentAttendees: Attendee[];
  allUsers: User[];
  onClose: () => void;
  onInviteSent: (attendees: Attendee[]) => void;
}

export default function InviteAttendees({
  eventId,
  currentAttendees,
  allUsers,
  onClose,
  onInviteSent,
}: InviteAttendeesProps) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const attendeeIds = useMemo(() => 
    new Set(currentAttendees.map(a => a.id)), 
    [currentAttendees]
  );

  const availableUsers = useMemo(() => 
    allUsers
      .filter(u => !attendeeIds.has(u.id))
      .filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [allUsers, attendeeIds, searchTerm]
  );

  const handleToggleUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInvite = async () => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      const invitations = await Promise.all(
        selectedUsers.map(userId =>
          fetchJson('/event-attendees', {
            method: 'POST',
            body: {
              event_id: eventId,
              user_id: userId,
              status: 'maybe',
            },
          })
        )
      );

      onInviteSent([...currentAttendees, ...invitations]);
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error('Error sending invites:', error);
      alert('Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'attending':
        return <Check size={16} className="text-green-600" />;
      case 'maybe':
        return <Clock size={16} className="text-yellow-600" />;
      case 'declined':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Invite Attendees</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {currentAttendees.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Added Attendees</h3>
              <div className="space-y-2">
                {currentAttendees.map(attendee => (
                  <div key={attendee.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{attendee.user.name}</p>
                      <p className="text-xs text-gray-500">{attendee.user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(attendee.status)}
                      <span className="text-xs text-gray-600">
                        {attendee.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {availableUsers.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Users</h3>
              <div className="space-y-2">
                {availableUsers.map(user => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleToggleUser(user.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {availableUsers.length === 0 && currentAttendees.length === 0 && (
            <p className="text-center text-gray-500 py-4">No users available to invite</p>
          )}
        </div>

        <div className="flex gap-2 p-6 border-t border-gray-200">
          <button
            onClick={handleInvite}
            disabled={loading || selectedUsers.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            <UserPlus size={18} />
            {loading ? 'Sending...' : `Invite (${selectedUsers.length})`}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
