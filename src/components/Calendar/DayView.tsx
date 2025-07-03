import React, { useRef, useEffect, useState } from 'react'
import {
  format,
  isSameDay,
} from '../../utils/dateUtils'

interface Event {
  id: number
  title: string
  date: Date
  color: string
}

interface DayViewProps {
  currentDate: Date
  events: Event[]
  selectedDate: Date | null
  selectedHour: number | null
  onDateClick: (date: Date) => void
  onHourClick: (hour: number) => void
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  selectedDate,
  selectedHour,
  onDateClick,
  onHourClick,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
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
  }, [currentDate])

  // Calculate current time position for the line
  const getCurrentTimePosition = () => {
    const currentHour = currentTime.getHours()
    const currentMinutes = currentTime.getMinutes()
    
    // Position within the specific hour cell
    const hourHeight = 72
    const topPosition = (currentHour * hourHeight) + ((currentMinutes / 60) * hourHeight)
    
    return topPosition
  }
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM'
    if (hour === 12) return '12 PM'
    if (hour < 12) return `${hour} AM`
    return `${hour - 12} PM`
  }

  const isToday = isSameDay(currentDate, new Date())
  const dayEvents = events.filter(event => isSameDay(event.date, currentDate))

  return (
    <div className="h-full flex flex-col">
      {/* Time grid - SCROLLABLE with sticky header */}
      <div className="flex-1 overflow-y-auto relative" ref={scrollContainerRef}>
        {/* Sticky header with day - part of scrollable content but stays fixed */}
        <div className="sticky top-0 z-30 grid grid-cols-[60px_1fr] border-b border-[#2C2D30] bg-[#1A1D21]">
          {/* Empty corner - matches time label width exactly */}
          <div className="p-2 bg-[#1A1D21]"></div>
          
          {/* Day header */}
          <button
            type="button"
            className="p-3 text-center hover:!bg-[#4A154B]/25 transition-colors bg-[#1A1D21] border-0 w-full"
            style={selectedDate && isSameDay(currentDate, selectedDate) && selectedHour === null ? {
              borderTop: '1px solid #4A154B',
              marginTop: '-1px',
              position: 'relative',
              zIndex: 10
            } : {}}
            onClick={() => onDateClick(currentDate)}
          >
            <div className="text-sm text-[#8D8D8D] mb-1">
              {format(currentDate, 'EEEE')}
            </div>
            <div className={`text-lg font-medium ${
              isToday 
                ? 'bg-[#4A154B] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                : 'text-white'
            }`}>
              {format(currentDate, 'd')}
            </div>
          </button>
        </div>

        {/* Current time line spanning across the day */}
        <div 
          className="absolute left-[60px] right-0 z-20 pointer-events-none"
          style={{ 
            top: `${getCurrentTimePosition() + 73}px`, // Add header height offset
            height: '2px',
            backgroundColor: '#4A154B'
          }}
        ></div>

        {/* Hours grid */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[60px_1fr] border-b border-[#2C2D30] min-h-[72px]"
          >
            {/* Time label - matches header corner exactly */}
            <div className="border-r border-[#2C2D30] p-2 text-xs text-[#8D8D8D] text-right bg-[#1A1D21]">
              {formatHour(hour)}
            </div>
            
            {/* Day column */}
            <button
              type="button"
              className={`hover:!bg-[#4A154B]/25 transition-colors relative w-full text-left min-h-[72px] ${
                selectedHour === hour ? 'border-0' : 'border-0 p-1'
              }`}
              style={selectedHour === hour ? {
                border: '1px solid #4A154B',
                marginLeft: '-1px',
                marginTop: '-1px',
                marginBottom: '-1px',
                padding: '4px',
                position: 'relative',
                zIndex: 10
              } : {}}
              onClick={() => onHourClick(hour)}
            >
              {/* Events for this hour */}
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="text-xs p-1 my-0.5 rounded truncate text-white cursor-pointer"
                  style={{ backgroundColor: event.color }}
                >
                  {event.title}
                </div>
              ))}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
