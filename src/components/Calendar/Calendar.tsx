import React, { useState, useEffect } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import { EventModal } from '../shared/EventModal'
import { addMonths, subMonths } from '../../utils/dateUtils'
import { useTheme } from '../../contexts/ThemeContext'

interface Event {
  id: string | number;
  name: string;
  date: Date;
  color: string;
  priority: number;
  isHoliday?: boolean;
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [holidays, setHolidays] = useState<Event[]>([])
  const { getColorHex } = useTheme()

  // Fetch holidays for all countries for the current year
  useEffect(() => {
    const fetchHolidays = async () => {
      const year = currentDate.getFullYear()
      const countriesRes = await fetch('https://date.nager.at/api/v3/AvailableCountries')
      const countries = await countriesRes.json()
      // Limit to a reasonable number of countries for performance (e.g., top 10)
      const countryCodes = countries.slice(0, 10).map((c: any) => c.countryCode)
      const allHolidays: Event[] = []
      await Promise.all(
        countryCodes.map(async (code: string) => {
          const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${code}`)
          const data = await res.json()
          data.forEach((h: any) => {
            allHolidays.push({
              id: `holiday-${code}-${h.date}`,
              name: `${h.localName} (${code})`,
              date: new Date(h.date),
              color: getColorHex(),
              priority: 1,
              isHoliday: true,
            })
          })
        })
      )
      setHolidays(allHolidays)
    }
    fetchHolidays()
    // Re-fetch on highlight color change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getColorHex, currentDate])

  // Merge holidays and user events, holidays always first per day
  const mergedEvents = React.useMemo(() => {
    // Group holidays by date string for fast lookup
    const holidayMap = new Map<string, Event[]>()
    holidays.forEach(h => {
      const key = h.date.toISOString().slice(0, 10)
      if (!holidayMap.has(key)) holidayMap.set(key, [])
      holidayMap.get(key)!.push(h)
    })
    // For each event, skip if it's a holiday (avoid duplicates)
    const userEvents = events.filter(ev => !ev.isHoliday)
    // Return all holidays + user events
    return [...holidays, ...userEvents]
  }, [holidays, events])

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
    setEditingEvent(null)
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

  // Delete event by id
  const handleEventDelete = (eventId: string | number) => {
    setEvents(prev => prev.filter(ev => ev.id !== eventId))
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
          events={mergedEvents}
          setEvents={setEvents}
          selectedDate={selectedDate}
          selectedColumn={selectedColumn}
          onDateClick={handleDateClick}
          onDayHeaderClick={handleDayHeaderClick}
          onDateDoubleClick={handleDateDoubleClick}
          onEventClick={handleEventClick}
        />
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedDate={modalDate}
        onSave={handleEventSave}
        editingEvent={editingEvent}
        onDelete={handleEventDelete}
      />
    </div>
  )
}
