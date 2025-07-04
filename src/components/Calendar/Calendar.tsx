import React, { useState } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import { addMonths, subMonths } from '../../utils/dateUtils'

interface Event {
  id: number
  title: string
  date: Date
  color: string
}

interface CalendarProps {
  events: Event[]
}

export const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()) // Highlight today by default
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null) // Track column selection separately

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today) // Highlight today when going to today
    setSelectedColumn(null) // Clear column selection
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date) // Select specific day
    setSelectedColumn(null) // Clear column selection
  }

  const handleDayHeaderClick = (date: Date) => {
    setSelectedColumn(date.getDay()) // Select entire column
    setSelectedDate(null) // Clear individual day selection
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
          selectedDate={selectedDate}
          selectedColumn={selectedColumn}
          onDateClick={handleDateClick}
          onDayHeaderClick={handleDayHeaderClick}
        />
      </div>
    </div>
  )
}
