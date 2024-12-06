import React from 'react';
import { Search } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import LoadingScreen from '../LoadingScreen';

export default function EventsList() {
  const { events, loading } = useEvents();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'text-blue-600';
      case 'in_progress':
        return 'text-green-600';
      case 'completed':
        return 'text-gray-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search events"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1d4e74] focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Events list */}
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {event.images.length > 0 ? (
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.platform}</p>
                </div>
              </div>
              <span className={`text-sm ${getStatusColor(event.status)}`}>
                {event.status.replace('_', ' ').charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Event Date</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                </div>
                {event.requiresPayment && (
                  <div className="text-sm text-gray-900">
                    Payment required: ${event.paymentAmount}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View event
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}