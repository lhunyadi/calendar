import React from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  addDays,
} from '../../utils/dateUtils'
import { CalendarEvent } from './CalendarEvent'

interface Event {
  id: number
  title: string
  date: Date
  color: string
}

interface CalendarGridProps {
  currentDate: Date
  events: Event[]
  selectedDate: Date | null
  selectedColumn: number | null
  onDateClick: (date: Date) => void
  onDayHeaderClick: (date: Date) => void
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  selectedDate,
  selectedColumn,
  onDateClick,
  onDayHeaderClick,
}) => {
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay()
    return day === 0 || day === 6 // 0 is Sunday, 6 is Saturday
  }

  const renderDays = () => {
    const dateFormat = 'EEEE'
    const days = []
    let startDate = startOfWeek(startOfMonth(currentDate))

    for (let i = 0; i < 7; i++) {
      const dayDate = addDays(startDate, i)
      const isToday = isSameDay(dayDate, new Date())
      const isSelectedColumn = selectedColumn !== null && dayDate.getDay() === selectedColumn
      
      days.push(
        <div
          key={i}
          className={`font-medium text-center py-2 text-sm cursor-pointer hover:!bg-[#4A154B]/25 transition-colors ${
            isToday ? 'text-[#4A154B]' : 'text-[#8D8D8D]'
          } ${isSelectedColumn ? 'border-t border-[#4A154B]' : ''}`}
          onClick={() => onDayHeaderClick(dayDate)}
        >
          {format(dayDate, dateFormat)}
        </div>,
      )
    }

    return (
      <div className="grid grid-cols-7 border-b border-[#2C2D30]">{days}</div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ''

    // Updated diagonal stripe pattern with a slightly lighter color for the stripes
    // Base color #222529 with slightly lighter #2c2f33 for the stripes
    const weekendPattern = `linear-gradient(45deg, #2c2f33 25%, transparent 25%, transparent 50%, #2c2f33 50%, #2c2f33 75%, transparent 75%, transparent)`

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd')
        const cloneDay = day
        const isWeekendDay = isWeekend(cloneDay)
        const isSelectedColumn = selectedColumn !== null && cloneDay.getDay() === selectedColumn

        // Filter events for this day
        const dayEvents = events.filter((event) =>
          isSameDay(event.date, cloneDay),
        )

        // Base style for the cell
        let cellStyle: React.CSSProperties = {}

        // Different styling based on day type
        if (isWeekendDay) {
          cellStyle = {
            backgroundImage: weekendPattern,
            backgroundSize: '10px 10px',
            backgroundColor: '#222529',
          }
        } else {
          // Ensure non-weekend days have explicit background
          cellStyle = {
            backgroundColor: !isSameMonth(day, monthStart) ? '#222529' : '#1A1D21'
          }
        }

        // Determine cell classes - use !important hover to override inline styles
        let cellClasses = 'flex-1 min-h-[120px] p-2 relative cursor-pointer transition-colors '
        
        // Add hover class that will override inline styles with more transparent color
        cellClasses += 'hover:!bg-[#4A154B]/25 '
        
        // Text color for out-of-month days
        if (!isSameMonth(day, monthStart)) {
          cellClasses += 'text-[#8D8D8D]'
        }
        
        // Border logic - either default, column highlighted, or individual day highlighted
        let borderStyle: React.CSSProperties = {}
        
        if (isSelectedColumn) {
          // Column highlighting: use inline styles for precise overlap control
          cellClasses += ' border-0' // Remove all default borders
          borderStyle = {
            borderLeft: '1px solid #4A154B',
            borderRight: '1px solid #4A154B', 
            borderBottom: '1px solid #2C2D30',
            borderTop: 'none',
            marginLeft: '-1px' // Only overlap the left border, keep right border normal
          }
        } else if (selectedDate && isSameDay(day, selectedDate)) {
          // Individual day highlighting: full border with proper overlap
          cellClasses += ' border-0' // Remove all default borders
          borderStyle = {
            border: '1px solid #4A154B',
            marginLeft: '-1px', // Overlap left grid line
            marginTop: '-1px'   // Overlap top grid line
          }
        } else {
          // Default borders: right and bottom only
          cellClasses += ' border-r border-b border-[#2C2D30]'
        }

        // Merge all styles
        const finalCellStyle = { ...cellStyle, ...borderStyle }

        days.push(
          <div
            key={day.toString()}
            className={cellClasses}
            style={finalCellStyle}
            role="button"
            tabIndex={0}
            onClick={() => onDateClick(cloneDay)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onDateClick(cloneDay)
              }
            }}
          >
            <div className="p-1">
              <span
                className={`text-sm ${isSameDay(day, new Date()) ? 'bg-[#4A154B] text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}
              >
                {formattedDate}
              </span>
            </div>
            <div className="overflow-y-auto max-h-[80px]">
              {dayEvents.map((event) => (
                <CalendarEvent key={event.id} event={event} />
              ))}
            </div>
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 flex-1">
          {days}
        </div>,
      )
      days = []
    }
    return <div className="flex flex-col h-full">{rows}</div>
  }

  return (
    <div className="flex flex-col h-full">
      {renderDays()}
      <div className="flex-1">
        {renderCells()}
      </div>
    </div>
  )
}
