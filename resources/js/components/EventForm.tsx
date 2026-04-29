import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { fetchJson } from '@/lib/utils';
import { store, update } from '@/routes/events';

interface EventFormEvent {
  id?: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  category?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  start?: Date;
  end?: Date;
}

interface EventFormProps {
  event?: EventFormEvent | null;
  onClose: () => void;
  onSave: (event: any) => void;
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const formatTime = (date: Date) => date.toISOString().slice(11, 16);
const buildDateTime = (date: string, time: string) => `${date}T${time}:00`;

export default function EventForm({ event, onClose, onSave }: EventFormProps) {
  const startDateRef = useRef<HTMLInputElement & { showPicker?: () => void } | null>(null);
  const endDateRef = useRef<HTMLInputElement & { showPicker?: () => void } | null>(null);
  const startTimeRef = useRef<HTMLInputElement & { showPicker?: () => void } | null>(null);
  const endTimeRef = useRef<HTMLInputElement & { showPicker?: () => void } | null>(null);

  const [formData, setFormData] = useState<EventFormEvent>({
    title: '',
    description: '',
    start_date: formatDate(new Date()),
    start_time: formatTime(new Date()),
    end_date: formatDate(new Date(Date.now() + 3600000)),
    end_time: formatTime(new Date(Date.now() + 3600000)),
    location: '',
    category: 'general',
    is_recurring: false,
    recurrence_pattern: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);

      setFormData({
        ...event,
        start_date: formatDate(start),
        start_time: formatTime(start),
        end_date: formatDate(end),
        end_time: formatTime(end),
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const route = event?.id ? update(event.id) : store();
      const { start_time, end_time, ...rest } = formData;
      const payload = {
        ...rest,
        start_date: buildDateTime(formData.start_date, start_time ?? '00:00'),
        end_date: buildDateTime(formData.end_date, end_time ?? '00:00'),
      };

      const savedEvent = await fetchJson(route.url, {
        method: route.method,
        body: payload,
      });
      onSave(savedEvent);
      onClose();
    } catch (error: any) {
      console.error('Error saving event:', error);
      setErrorMessage(error?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">{event ? 'Edit Event' : 'New Event'}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 event-form">
        {errorMessage && (
          <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {errorMessage}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Event title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Event description"
          />
        </div>

        <hr className="block" />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <div className="relative">
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                ref={startDateRef}
                required
                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => startDateRef.current?.showPicker?.() ?? startDateRef.current?.focus()}
                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                aria-label="Open start date picker"
              >
                <Calendar size={18} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
            <div className="relative">
              <input
                type="time"
                name="start_time"
                value={formData.start_time ?? ''}
                onChange={handleChange}
                ref={startTimeRef}
                required
                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => startTimeRef.current?.showPicker?.() ?? startTimeRef.current?.focus()}
                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                aria-label="Open start time picker"
              >
                <Clock size={18} />
              </button>
            </div>
          </div>
        </div>

        <hr className="block" />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
            <div className="relative">
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                ref={endDateRef}
                required
                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => endDateRef.current?.showPicker?.() ?? endDateRef.current?.focus()}
                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                aria-label="Open end date picker"
              >
                <Calendar size={18} />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
            <div className="relative">
              <input
                type="time"
                name="end_time"
                value={formData.end_time ?? ''}
                onChange={handleChange}
                ref={endTimeRef}
                required
                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => endTimeRef.current?.showPicker?.() ?? endTimeRef.current?.focus()}
                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-700"
                aria-label="Open end time picker"
              >
                <Clock size={18} />
              </button>
            </div>
          </div>
        </div>
        <hr className="block" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Event location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category || 'general'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="general">General</option>
            <option value="meeting">Meeting</option>
            <option value="workshop">Workshop</option>
            <option value="social">Social</option>
            <option value="conference">Conference</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              name="is_recurring"
              checked={formData.is_recurring || false}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">Recurring Event</span>
          </label>

          {formData.is_recurring && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
              <select
                name="recurrence_pattern"
                value={formData.recurrence_pattern || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select pattern...</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Saving...' : 'Save Event'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
