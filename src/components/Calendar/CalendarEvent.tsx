import React from 'react'


interface Event {
  id: number;
  name: string;
  date: Date;
  color: string;
  priority: number;
}

interface CalendarEventProps {
  event: Event;
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({ event }) => {
  // Priority style: Low = border only, Medium = diagonal, High = solid
  let background = 'transparent';
  if (event.priority === 1) {
    background = `repeating-linear-gradient(135deg, ${event.color}33 0 8px, transparent 8px 16px)`;
  } else if (event.priority === 2) {
    background = `linear-gradient(90deg, ${event.color}33 0%, ${event.color}33 100%)`;
  }
  return (
    <div
      className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-90 transition-opacity flex items-center border w-full box-border"
      style={{
        background,
        borderColor: event.color,
        borderWidth: '1px',
        borderStyle: 'solid',
        color: '#fff',
        minHeight: '1.25rem',
        fontWeight: 500,
        maxWidth: '100%',
      }}
      title={event.name}
    >
      {event.name}
    </div>
  );
}
