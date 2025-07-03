import React, { useState } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import { WeekView } from './WeekView'
import { DayView } from './DayView'
import { addMonths, subMonths, addDays, startOfWeek } from '../../utils/dateUtils'

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
  const [selectedHour, setSelectedHour] = useState<number | null>(null) // Track selected hour in day view
  const [selectedDayHour, setSelectedDayHour] = useState<{ day: Date; hour: number } | null>(null) // Track selected day+hour in week views
  const [viewMode, setViewMode] = useState<'Day' | 'Work week' | 'Week' | 'Month'>('Month')

  const goToPreviousMonth = () => {
    switch (viewMode) {
      case 'Day':
        setCurrentDate(addDays(currentDate, -1))
        // Keep individual day selection when navigating in day view
        if (selectedDate && !selectedColumn) {
          setSelectedDate(addDays(selectedDate, -1))
        }
        break
      case 'Week':
      case 'Work week':
        setCurrentDate(addDays(currentDate, -7))
        break
      case 'Month':
      default:
        setCurrentDate(subMonths(currentDate, 1))
        break
    }
  }

  const goToNextMonth = () => {
    switch (viewMode) {
      case 'Day':
        setCurrentDate(addDays(currentDate, 1))
        // Keep individual day selection when navigating in day view
        if (selectedDate && !selectedColumn) {
          setSelectedDate(addDays(selectedDate, 1))
        }
        break
      case 'Week':
      case 'Work week':
        setCurrentDate(addDays(currentDate, 7))
        break
      case 'Month':
      default:
        setCurrentDate(addMonths(currentDate, 1))
        break
    }
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today) // Highlight today when going to today
    setSelectedColumn(null) // Clear column selection
    setSelectedHour(null) // Clear hour selection
    setSelectedDayHour(null) // Clear day+hour selection
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date) // Select specific day
    setSelectedColumn(null) // Clear column selection
    setSelectedHour(null) // Clear hour selection
    setSelectedDayHour(null) // Clear day+hour selection
  }

  const handleDayHeaderClick = (date: Date) => {
    setSelectedColumn(date.getDay()) // Select entire column
    setSelectedDate(null) // Clear individual day selection
    setSelectedHour(null) // Clear hour selection
    setSelectedDayHour(null) // Clear day+hour selection
  }

  const handleHourClick = (hour: number) => {
    setSelectedHour(hour) // Select specific hour (for Day view)
    setSelectedDate(null) // Clear day selection
    setSelectedColumn(null) // Clear column selection
    setSelectedDayHour(null) // Clear day+hour selection
  }

  const handleDayHourClick = (day: Date, hour: number) => {
    setSelectedDayHour({ day, hour }) // Select specific day+hour (for Week views)
    setSelectedDate(null) // Clear day selection
    setSelectedColumn(null) // Clear column selection
    setSelectedHour(null) // Clear hour selection
  }

  const handleViewModeChange = (mode: 'Day' | 'Work week' | 'Week' | 'Month') => {
    setViewMode(mode)
    
    // Clear hour selection when switching to Month view
    if (mode === 'Month') {
      setSelectedHour(null)
      setSelectedDayHour(null)
    }
    
    // Clear day+hour selection when switching to Day view (use hour-only selection instead)
    if (mode === 'Day') {
      setSelectedDayHour(null)
    }
    
    // Clear hour-only selection when switching to Week views (use day+hour selection instead)
    if (mode === 'Week' || mode === 'Work week') {
      setSelectedHour(null)
    }
    
    // When switching to Week or Work week views, show the week containing the selected date
    if ((mode === 'Week' || mode === 'Work week') && selectedDate) {
      setCurrentDate(startOfWeek(selectedDate))
    }
    // When switching to Day view, show the selected date
    else if (mode === 'Day' && selectedDate) {
      setCurrentDate(selectedDate)
    }
  }

  return (
    <div className="bg-[#1A1D21] h-full flex flex-col border border-[#2C2D30]">
      {/* View Mode Selector - FIXED */}
      <div className="bg-[#19171D] px-4 py-3 border-b border-[#2C2D30] flex-shrink-0">
        <div className="flex items-center space-x-1">
          {(['Day', 'Work week', 'Week', 'Month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleViewModeChange(mode)}
              className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center space-x-1 ${
                viewMode === mode
                  ? 'bg-[#4A154B] text-white'
                  : 'text-[#D1D2D3] hover:bg-[#2C2D30] hover:text-white'
              }`}
            >
              {mode === 'Day' && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="3" y="4" width="14" height="12" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
              {mode === 'Work week' && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="3" y="4" width="14" height="12" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
              {mode === 'Week' && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="3" y="4" width="14" height="12" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
              {mode === 'Month' && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="3" y="4" width="14" height="12" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
              <span>{mode}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Calendar Header - FIXED */}
      <div className="flex-shrink-0">
        <CalendarHeader
          currentDate={currentDate}
          selectedDate={selectedDate}
          viewMode={viewMode}
          onPrevMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
        />
      </div>

      {/* Calendar Content - SCROLLABLE AREA */}
      <div className="flex-1 min-h-0">
        {viewMode === 'Month' && (
          <CalendarGrid 
            currentDate={currentDate} 
            events={events} 
            selectedDate={selectedDate}
            selectedColumn={selectedColumn}
            onDateClick={handleDateClick}
            onDayHeaderClick={handleDayHeaderClick}
          />
        )}
        {viewMode === 'Week' && (
          <WeekView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            selectedColumn={selectedColumn}
            selectedDayHour={selectedDayHour}
            onDateClick={handleDateClick}
            onDayHeaderClick={handleDayHeaderClick}
            onDayHourClick={handleDayHourClick}
          />
        )}
        {viewMode === 'Work week' && (
          <WeekView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            selectedColumn={selectedColumn}
            selectedDayHour={selectedDayHour}
            onDateClick={handleDateClick}
            onDayHeaderClick={handleDayHeaderClick}
            onDayHourClick={handleDayHourClick}
            isWorkWeek={true}
          />
        )}
        {viewMode === 'Day' && (
          <DayView
            currentDate={selectedDate || currentDate}
            events={events}
            selectedDate={selectedDate}
            selectedHour={selectedHour}
            onDateClick={handleDateClick}
            onHourClick={handleHourClick}
          />
        )}
      </div>
    </div>
  )
}
