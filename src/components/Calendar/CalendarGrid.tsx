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
import { useTheme } from '../../contexts/ThemeContext'

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
  const { getColorHex, getBgColor, getCalendarOutMonthColor, getTextColor, themeMode, getHoverColor } = useTheme()
  
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay()
    return day === 0 || day === 6 // 0 is Sunday, 6 is Saturday
  }

  const renderDays = () => {
    const dateFormat = 'EEEE'
    const days = []
    let startDate = startOfWeek(startOfMonth(currentDate))
    const todayDayOfWeek = new Date().getDay() // Get today's day of the week (0-6)

    for (let i = 0; i < 7; i++) {
      const dayDate = addDays(startDate, i)
      const isTodayDayOfWeek = dayDate.getDay() === todayDayOfWeek // Check if this day of week matches today's day of week
      const isSelectedColumn = selectedColumn !== null && dayDate.getDay() === selectedColumn
      
      const currentColor = getColorHex()
      
      days.push(
        <div
          key={i}
          className={`font-medium text-center py-2 text-sm cursor-pointer transition-colors ${
            isSelectedColumn ? 'border-t-2' : ''
          }`}
          style={{
            color: isTodayDayOfWeek ? currentColor : getTextColor(), // Use dynamic text color for non-today headers
            borderTopColor: isSelectedColumn ? currentColor : undefined,
            backgroundColor: getBgColor() // Use same color as date header
          }}
          role="button"
          tabIndex={0}
          onClick={() => onDayHeaderClick(dayDate)}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.backgroundColor = getHoverColor() // Use theme-aware hover color
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.backgroundColor = getBgColor() // Reset to date header color
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onDayHeaderClick(dayDate)
            }
          }}
        >
          {format(dayDate, dateFormat)}
        </div>,
      )
    }

    return (
      <div className="grid grid-cols-7 border-b" style={{ borderColor: themeMode === 'dark' ? '#2C2D30' : '#e6e6e6' }}>{days}</div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const currentColor = getColorHex()

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ''

    // Dynamic diagonal stripe pattern based on theme
    const weekendPattern = themeMode === 'dark' 
      ? `linear-gradient(45deg, #2c2f33 25%, transparent 25%, transparent 50%, #2c2f33 50%, #2c2f33 75%, transparent 75%, transparent)`
      : `linear-gradient(45deg, #e6e6e6 25%, transparent 25%, transparent 50%, #e6e6e6 50%, #e6e6e6 75%, transparent 75%, transparent)`

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

        // Different styling based on day type and whether it's in current month
        const isCurrentMonth = isSameMonth(day, monthStart)
        
        if (isWeekendDay && isCurrentMonth) {
          // Weekends in current month: use same base color as weekdays with diagonal stripes
          cellStyle = {
            backgroundImage: weekendPattern,
            backgroundSize: '10px 10px',
            backgroundColor: getBgColor(), // Use same color as date header
          }
        } else {
          // For non-weekend days or weekend days outside current month
          cellStyle = {
            backgroundColor: isCurrentMonth ? getBgColor() : getCalendarOutMonthColor()
          }
        }

        // Determine cell classes
        let cellClasses = 'flex-1 min-h-[120px] p-2 relative cursor-pointer transition-colors '
        
        // Default text color class for out-of-month days
        if (!isSameMonth(day, monthStart)) {
          cellClasses += 'text-[#8D8D8D]' // Out-of-month days stay dimmed
        }
        
        // Text color will be set via inline style for current month days
        
        // Border logic - either default, column highlighted, or individual day highlighted
        let borderStyle: React.CSSProperties = {}
        
        if (isSelectedColumn) {
          // Column highlighting: use inline styles for precise overlap control
          cellClasses += ' border-0' // Remove all default borders
          borderStyle = {
            borderLeft: `1px solid ${currentColor}`,
            borderRight: `1px solid ${currentColor}`, 
            borderBottom: `1px solid ${themeMode === 'dark' ? '#2C2D30' : '#e6e6e6'}`, // Dynamic border color
            borderTop: 'none',
            marginLeft: '-1px' // Only overlap the left border, keep right border normal
          }
        } else if (selectedDate && isSameDay(day, selectedDate)) {
          // Individual day highlighting: full border with proper overlap
          cellClasses += ' border-0' // Remove all default borders
          borderStyle = {
            border: `1px solid ${currentColor}`,
            marginLeft: '-1px', // Overlap left grid line
            marginTop: '-1px'   // Overlap top grid line
          }
        } else {
          // Default borders: right and bottom only with dynamic color
          cellClasses += ' border-r border-b'
          borderStyle.borderRightColor = themeMode === 'dark' ? '#2C2D30' : '#e6e6e6'
          borderStyle.borderBottomColor = themeMode === 'dark' ? '#2C2D30' : '#e6e6e6'
        }

        // Merge all styles and set dynamic text color for current month days
        const finalCellStyle = { 
          ...cellStyle, 
          ...borderStyle,
          color: isSameMonth(day, monthStart) ? getTextColor() : undefined
        }

        days.push(
          <div
            key={day.toString()}
            className={cellClasses}
            style={finalCellStyle}
            role="button"
            tabIndex={0}
            onClick={() => onDateClick(cloneDay)}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.backgroundColor = getHoverColor() // Use theme-aware hover color
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement
              // Reset to original background from finalCellStyle
              target.style.backgroundColor = finalCellStyle.backgroundColor || ''
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onDateClick(cloneDay)
              }
            }}
          >
            <div className="p-1">
              <span
                className={`text-sm ${isSameDay(day, new Date()) ? 'rounded-full w-6 h-6 flex items-center justify-center' : ''}`}
                style={
                  isSameDay(day, new Date()) 
                    ? { backgroundColor: currentColor, color: '#ffffff' }  // White text on highlight background
                    : {}
                }
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
