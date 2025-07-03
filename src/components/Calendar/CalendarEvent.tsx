import React from 'react'

interface Event {
  id: number
  title: string
  date: Date
  color: string
}

interface CalendarEventProps {
  event: Event
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({ event }) => {
  return (
    <div
      className="text-xs p-1 my-0.5 rounded truncate text-white cursor-pointer hover:opacity-90 transition-opacity"
      style={{
        backgroundColor: event.color,
      }}
    >
      {event.title}
    </div>
  )
}
