import React from 'react';

interface CalendarEvent {
  date: number;
  events: { title: string; type: 'brand' | 'event' }[];
}

const currentMonth = 'August 2024';

const calendarData: CalendarEvent[] = [
  { date: 1, events: [{ title: 'Brand awareness pa', type: 'brand' }] },
  { date: 2, events: [{ title: 'Grand opening ev', type: 'event' }] },
  { date: 7, events: [{ title: 'Open house', type: 'event' }] },
];

const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT'];

export default function Calendar() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{currentMonth}</h2>
      <div className="grid grid-cols-7 gap-4">
        {/* Days of week header */}
        {daysOfWeek.map(day => (
          <div key={day} className="text-sm font-medium text-gray-500 text-center">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {daysInMonth.map(day => {
          const dayEvents = calendarData.find(d => d.date === day)?.events || [];
          
          return (
            <div
              key={day}
              className="min-h-[100px] border border-gray-200 rounded-lg p-2"
            >
              <div className="text-sm text-gray-600 mb-2">{day}</div>
              {dayEvents.map((event, index) => (
                <div
                  key={index}
                  className={`text-xs p-1 rounded mb-1 truncate ${
                    event.type === 'brand'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}