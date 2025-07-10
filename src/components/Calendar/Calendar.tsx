import React, { useState } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import { EventModal } from '../shared/EventModal'
import { addMonths, subMonths } from '../../utils/dateUtils'

// Updated Event type to include priority
interface Event {
  id: number
  name: string
  date: Date
  color: string
  priority: number
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null)
  const [events, setEvents] = useState<Event[]>([])

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
    setSelectedColumn(null)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedColumn(null)
  }

  const handleDayHeaderClick = (date: Date) => {
    const dayOfWeek = date.getDay()
    if (selectedColumn === dayOfWeek) {
      setSelectedColumn(null)
    } else {
      setSelectedColumn(dayOfWeek)
    }
    setSelectedDate(null)
  }

  const handleDateDoubleClick = (date: Date) => {
    setModalDate(date)
    setIsModalOpen(true)
  }

  // Single click on event: open modal for editing
  const handleEventClick = (event: Event) => {
    setEditingEvent(event)
    setModalDate(event.date)
    setIsModalOpen(true)
  }

  // Add event to state
  const handleEventSave = (event: { name: string; color: string; priority: number; date: Date }) => {
    setEvents(prev => {
      if (editingEvent) {
        // Update existing event
        return prev.map(ev =>
          ev.id === editingEvent.id
            ? { ...ev, ...event }
            : ev
        )
      } else {
        // Add new event
        return [
          ...prev,
          {
            id: Date.now() + Math.floor(Math.random() * 10000),
            name: event.name,
            color: event.color,
            priority: event.priority,
            date: event.date,
          },
        ]
      }
    })
    setEditingEvent(null)
    setIsModalOpen(false)
    setModalDate(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setModalDate(null)
    setEditingEvent(null)
  }

  return (
    <div className="bg-[#1A1D21] h-full flex flex-col border border-[#2C2D30]">
      {/* Calendar Header */}
      <div className="flex-shrink-0">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
        />
      </div>

      {/* Calendar Content - Month View Only */}
      <div className="flex-1 min-h-0">
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          setEvents={setEvents}
          selectedDate={selectedDate}
          selectedColumn={selectedColumn}
          onDateClick={handleDateClick}
          onDayHeaderClick={handleDayHeaderClick}
          onDateDoubleClick={handleDateDoubleClick}
          onEventClick={handleEventClick} // <-- pass this prop
        />
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedDate={modalDate}
        onSave={handleEventSave}
        editingEvent={editingEvent} // <-- pass this prop
      />
    </div>
  )
}
