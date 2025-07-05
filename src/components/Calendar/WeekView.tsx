import React, { useRef, useEffect, useState } from 'react'
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
} from '../../utils/dateUtils'

interface Event {
  id: number
  title: string
  date: Date
  color: string
}

interface WeekViewProps {
  currentDate: Date
  events: Event[]
  selectedDate: Date | null
  selectedColumn: number | null
  selectedDayHour: { day: Date; hour: number } | null
  onDateClick: (date: Date) => void
  onDayHeaderClick: (date: Date) => void
  onDayHourClick: (day: Date, hour: number) => void
  isWorkWeek?: boolean
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  selectedDate,
  selectedColumn,
  selectedDayHour,
  onDateClick,
  onDayHeaderClick,
  onDayHourClick,
  isWorkWeek = false,
}) => {
  const startDate = startOfWeek(currentDate)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Get days for the week (or work week)
  const getDaysToShow = () => {
    if (isWorkWeek) {
      // Work week: Monday to Friday
      const monday = addDays(startDate, 1) // Start from Monday
      return Array.from({ length: 5 }, (_, i) => addDays(monday, i))
    } else {
      // Full week: Sunday to Saturday
      return Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
    }
  }

  const daysToShow = getDaysToShow()

  // Update current time every minute for real-time "now" line
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date())
    const timeInterval = setInterval(updateTime, 60000) // Update every minute
    
    return () => clearInterval(timeInterval)
  }, [])

  // Auto-scroll to current time
  useEffect(() => {
    const scrollToCurrentTime = (smooth = false) => {
      if (scrollContainerRef.current) {
        const now = new Date()
        const currentHour = now.getHours()
        const currentMinutes = now.getMinutes()
        
        // Calculate the position to scroll to (center the current time)
        const hourHeight = 72 // min-h-[72px]
        const scrollTop = (currentHour * hourHeight) + ((currentMinutes / 60) * hourHeight) - (scrollContainerRef.current.clientHeight / 2)
        
        scrollContainerRef.current.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: smooth ? 'smooth' : 'instant'
        })
      }
    }

    // Initial scroll - instant, no animation
    scrollToCurrentTime(false)

    // Update scroll position every minute to keep "now" line centered - with smooth animation
    const interval = setInterval(() => scrollToCurrentTime(true), 60000)

    return () => clearInterval(interval)
  }, [currentDate, daysToShow])

  // Calculate current time position for the line that spans across all days
  const getCurrentTimePosition = () => {
    const currentHour = currentTime.getHours()
    const currentMinutes = currentTime.getMinutes()
    
    // Position within the specific hour cell
    const hourHeight = 72
    const topPosition = (currentHour * hourHeight) + ((currentMinutes / 60) * hourHeight)
    
    return topPosition
  }
  const formatHour = (hour: number) => {
    if (hour === 0) return { number: '12', period: 'AM' }
    if (hour === 12) return { number: '12', period: 'PM' }
    if (hour < 12) return { number: hour.toString(), period: 'AM' }
    return { number: (hour - 12).toString(), period: 'PM' }
  }

  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  const isSelected = (date: Date) => {
    return selectedDate && isSameDay(date, selectedDate)
  }

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay()
    return day === 0 || day === 6 // 0 is Sunday, 6 is Saturday
  }

  // Weekend pattern - same as in month view
  const weekendPattern = `linear-gradient(45deg, #2c2f33 25%, transparent 25%, transparent 50%, #2c2f33 50%, #2c2f33 75%, transparent 75%, transparent)`

  return (
    <div className="h-full flex flex-col">
      {/* Time grid - SCROLLABLE with sticky header */}
      <div className="flex-1 overflow-y-auto relative" ref={scrollContainerRef}>
        {/* Sticky header with days - part of scrollable content but stays fixed */}
        <div className="sticky top-0 z-30 grid border-b border-[#2C2D30] bg-[#1A1D21]" style={{ gridTemplateColumns: `60px repeat(${daysToShow.length}, 1fr)` }}>
          {/* Empty corner - matches time label width exactly */}
          <div className="p-2 bg-[#1A1D21]"></div>
          
          {/* Day headers */}
          {daysToShow.map((day, index) => {
            const isSelectedColumn = selectedColumn !== null && day.getDay() === selectedColumn
            
            return (
              <div
                key={day.toString()}
                className={`p-3 text-center cursor-pointer hover:!bg-[#36C5F0]/25 transition-colors bg-[#1A1D21] ${
                  isSelected(day) ? 'border-t-2 border-t-[#36C5F0]' : ''
                } ${isSelectedColumn ? 'border-t border-[#36C5F0]' : ''}`}
                onClick={() => onDayHeaderClick(day)}
              >
                <div className={`text-sm mb-1 ${
                  isToday(day) ? 'text-[#36C5F0]' : 'text-[#8D8D8D]'
                }`}>
                  {format(day, 'EEEE')}
                </div>
                <div className={`text-lg font-medium ${
                  isToday(day) 
                    ? 'bg-[#36C5F0] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                    : 'text-white'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            )
          })}
        </div>

        {/* Current time line spanning across all days */}
        <div 
          className="absolute left-[60px] right-0 z-20 pointer-events-none"
          style={{ 
            top: `${getCurrentTimePosition() + 73}px`, // Add header height offset
            height: '2px',
            backgroundColor: '#36C5F0'
          }}
        ></div>

        {/* Hours grid */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid border-b border-[#2C2D30] min-h-[72px]"
            style={{ gridTemplateColumns: `60px repeat(${daysToShow.length}, 1fr)` }}
          >            {/* Time label - matches header corner exactly */}
            <div className="border-r border-[#2C2D30] p-2 text-xs bg-[#1A1D21] flex items-center justify-center">
              <span className="text-white font-medium">
                {formatHour(hour).number}
              </span>
              <span className="text-[#8D8D8D] ml-0.5">
                {formatHour(hour).period}
              </span>
            </div>
            
            {/* Day columns */}
            {daysToShow.map((day, index) => {
              const isWeekendDay = isWeekend(day)
              const isSelectedColumn = selectedColumn !== null && day.getDay() === selectedColumn
              const isSelectedDayHour = selectedDayHour && 
                isSameDay(selectedDayHour.day, day) && 
                selectedDayHour.hour === hour
              
              const cellStyle: React.CSSProperties = isWeekendDay ? {
                backgroundImage: weekendPattern,
                backgroundSize: '10px 10px',
                backgroundColor: '#222529',
              } : {
                backgroundColor: '#1A1D21'
              }

              // Border logic - similar to CalendarGrid for proper overlap
              let borderStyle: React.CSSProperties = {}
              let cellClasses = 'hover:!bg-[#36C5F0]/25 transition-colors cursor-pointer relative '
              
              if (isSelectedDayHour) {
                // Individual day+hour selection: highlight only this specific cell with perfect border alignment
                cellClasses += 'border-0' // Remove all default borders
                borderStyle = {
                  border: '1px solid #36C5F0',
                  marginLeft: '-1px',
                  marginTop: '-1px',
                  marginBottom: '-1px',
                  padding: '4px',
                  position: 'relative',
                  zIndex: 10
                }
              } else if (isSelectedColumn) {
                // Column highlighting: use inline styles for precise overlap control
                cellClasses += 'border-0 p-1' // Remove all default borders
                borderStyle = {                borderLeft: '1px solid #36C5F0',
                borderRight: '1px solid #36C5F0',
                  borderBottom: '1px solid #2C2D30',
                  borderTop: 'none',
                  marginLeft: '-1px' // Overlap the left border for perfect alignment
                }
              } else {
                // Default: no padding when not selected, borders handled by grid structure
                cellClasses += 'p-1'
              }
              
              // Default right borders - only for non-selected cells at column boundaries
              if (!isSelectedDayHour && !isSelectedColumn && index < daysToShow.length - 1) {
                cellClasses += ' border-r border-[#2C2D30]'
              }

              // Merge all styles
              const finalCellStyle = { ...cellStyle, ...borderStyle }

              return (
                <div
                  key={`${day.toString()}-${hour}`}
                  className={cellClasses}
                  style={finalCellStyle}
                  role="button"
                  tabIndex={0}
                  onClick={() => onDayHourClick(day, hour)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onDayHourClick(day, hour)
                    }
                  }}
                >
                  {/* Events for this day and hour would go here */}
                  {events
                    .filter(event => isSameDay(event.date, day))
                    .map(event => (
                      <div
                        key={event.id}
                        className="text-xs p-1 my-0.5 rounded truncate text-white cursor-pointer"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.title}
                      </div>
                    ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
