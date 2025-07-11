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

interface HolidayApi {
  date: string;
  localName: string;
}
interface CountryApi {
  countryCode: string;
}

function mapHolidayToEvent(h: HolidayApi, code: string, getColorHex: () => string): Event {
  return {
    id: `holiday-${code}-${h.date}`,
    name: `${h.localName} (${code})`,
    date: new Date(h.date),
    color: getColorHex(),
    priority: 1,
    isHoliday: true,
  };
}

async function fetchCountryHolidays(
  code: string,
  year: number,
  getColorHex: () => string
): Promise<Event[]> {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${code}`);
  const data: HolidayApi[] = await res.json();
  return data.map((h) => mapHolidayToEvent(h, code, getColorHex));
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
  const [searchText, setSearchText] = useState<string>('')
  const { getColorHex } = useTheme()

  useEffect(() => {
    const fetchHolidays = async () => {
      const year = currentDate.getFullYear();
      const countriesRes = await fetch('https://date.nager.at/api/v3/AvailableCountries');
      const countries: CountryApi[] = await countriesRes.json();
      const countryCodes: string[] = countries.slice(0, 10).map((c) => c.countryCode);
      const allHolidaysArrays = await Promise.all(
        countryCodes.map((code: string) => fetchCountryHolidays(code, year, getColorHex))
      );
      const allHolidays = allHolidaysArrays.flat();
      setHolidays(allHolidays);
    };
    fetchHolidays();
  }, [getColorHex, currentDate])

  const normalizeText = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const mergedEvents = React.useMemo(() => {
    const normalizedSearch = normalizeText(searchText.trim());
    const filteredUserEvents = events.filter(ev =>
      ev.isHoliday ||
      normalizedSearch === '' ||
      (ev.name && normalizeText(ev.name).includes(normalizedSearch))
    );
    return [...holidays, ...filteredUserEvents.filter(ev => !ev.isHoliday)];
  }, [holidays, events, searchText])

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

  const handleEventClick = (event: Event) => {
    setEditingEvent(event)
    setModalDate(event.date)
    setIsModalOpen(true)
  }

  const handleEventSave = (event: { name: string; color: string; priority: number; date: Date }) => {
    setEvents(prev => {
      if (editingEvent) {
        return prev.map(ev =>
          ev.id === editingEvent.id
            ? { ...ev, ...event }
            : ev
        )
      } else {
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
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </div>

      {/* Calendar */}
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

      {/* Pop-up Menu*/}
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
