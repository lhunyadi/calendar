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
  name: string
  date: Date
  color: string
  priority: number
}

interface CalendarGridProps {
  currentDate: Date
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
  selectedDate: Date | null
  selectedColumn: number | null
  onDateClick: (date: Date) => void
  onDayHeaderClick: (date: Date) => void
  onDateDoubleClick?: (date: Date) => void
}

// Utility filter functions to avoid deep nesting
const filterOutEventById = (events: Event[], id: number) => events.filter(ev => ev.id !== id);
const filterEventsByDay = (events: Event[], day: Date) => events.filter(ev => isSameDay(ev.date, day));
const filterEventsNotByDay = (events: Event[], day: Date) => events.filter(ev => !isSameDay(ev.date, day));

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  setEvents,
  selectedDate,
  selectedColumn,
  onDateClick,
  onDayHeaderClick,
  onDateDoubleClick,
}) => {
  const { getColorHex, getBgColor, getCalendarOutMonthColor, getTextColor, themeMode, getTodayTextColor, getHoverColor } = useTheme()
  
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
        <button
          key={i}
          className={`font-medium text-center py-2 text-sm cursor-pointer ${
            isSelectedColumn ? 'border-t-2' : ''
          }`}
          style={{
            color: isTodayDayOfWeek ? currentColor : getTextColor(), // Use dynamic text color for non-today headers
            borderTopColor: isSelectedColumn ? currentColor : undefined,
            backgroundColor: getBgColor() // Use same color as date header
          }}
          onClick={() => onDayHeaderClick(dayDate)}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.backgroundColor = getHoverColor() // Use transparent brand color
            target.style.transition = 'background-color 0.2s ease' // Only transition on hover
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.backgroundColor = getBgColor() // Reset to date header color
            target.style.transition = 'background-color 0.2s ease' // Only transition on hover
          }}
        >
          {format(dayDate, dateFormat)}
        </button>,
      )
    }

    return (
      <div className={"grid grid-cols-7 border-b " + (themeMode === 'dark' ? 'border-dark-border' : 'border-light-border')}>{days}</div>
    )
  }

  const getWeekendPattern = () => {
    return themeMode === 'dark'
      ? `linear-gradient(45deg, #2C2D30 25%, transparent 25%, transparent 50%, #2C2D30 50%, #2C2D30 75%, transparent 75%, transparent)`
      : `linear-gradient(45deg, #e6e6e6 25%, transparent 25%, transparent 50%, #e6e6e6 50%, #e6e6e6 75%, transparent 75%, transparent)`
  }

  const getCellStyle = (isWeekendDay: boolean, isCurrentMonth: boolean) => {
    const weekendPattern = getWeekendPattern()
    
    if (isWeekendDay && isCurrentMonth) {
      return {
        backgroundImage: weekendPattern,
        backgroundSize: '10px 10px',
        backgroundColor: getBgColor(),
      }
    } else {
      return {
        backgroundColor: isCurrentMonth ? getBgColor() : getCalendarOutMonthColor()
      }
    }
  }

  const getBorderStyle = (day: Date, isSelectedColumn: boolean, selectedDate: Date | null, currentColor: string) => {
    const borderColor = themeMode === 'dark' ? '#2C2D30' : '#e6e6e6'
    
    if (isSelectedColumn) {
      return {
        borderLeft: `1px solid ${currentColor}`,
        borderRight: `1px solid ${currentColor}`, 
        borderBottom: `1px solid ${borderColor}`,
        borderTop: 'none',
        marginLeft: '-1px'
      }
    } else if (selectedDate && isSameDay(day, selectedDate)) {
      return {
        border: `1px solid ${currentColor}`,
        marginLeft: '-1px',
        marginTop: '-1px'
      }
    } else {
      return {
        borderRightColor: borderColor,
        borderBottomColor: borderColor
      }
    }
  }

  const getCellClasses = (day: Date, isSelectedColumn: boolean, selectedDate: Date | null, monthStart: Date) => {
    let cellClasses = 'flex-1 min-h-[120px] p-2 relative cursor-pointer flex flex-col items-start text-left '
    
    if (!isSameMonth(day, monthStart)) {
      cellClasses += 'text-[#8D8D8D]'
    }
    
    if (isSelectedColumn || (selectedDate && isSameDay(day, selectedDate))) {
      cellClasses += ' border-0'
    } else {
      cellClasses += ' border-r border-b'
    }
    
    return cellClasses
  }

  // Drag state
  const [draggedEventId, setDraggedEventId] = React.useState<number | null>(null)
  const [dragOverEventId, setDragOverEventId] = React.useState<number | null>(null)
  const [dragOverPosition, setDragOverPosition] = React.useState<'above' | 'below' | null>(null)

  React.useEffect(() => {
    const clearDragState = () => {
      setDragOverEventId(null);
      setDragOverPosition(null);
    };
    window.addEventListener('dragend', clearDragState);
    window.addEventListener('drop', clearDragState);
    return () => {
      window.removeEventListener('dragend', clearDragState);
      window.removeEventListener('drop', clearDragState);
    };
  }, []);

  // Helper to move/reorder events between dates
  const moveOrReorderEvents = (
    targetDate: Date,
    draggedId: number,
    targetId: number,
    position: 'above' | 'below'
  ) => {
    setEvents(prevEvents => {
      // Remove dragged event from its current date
      let draggedEvent: Event | undefined;
      const filteredEvents = prevEvents.filter(e => {
        if (e.id === draggedId) {
          draggedEvent = { ...e, date: targetDate }; // update date if moving
          return false;
        }
        return true;
      });

      if (!draggedEvent) return prevEvents;

      // Get events for the target date
      const targetDayEvents = filteredEvents.filter(e => isSameDay(e.date, targetDate));
      const otherEvents = filteredEvents.filter(e => !isSameDay(e.date, targetDate));

      // Find target index in the target day's events
      const targetIdx = targetDayEvents.findIndex(e => e.id === targetId);
      if (targetIdx === -1) {
        // If dropping into empty cell or not on an event, just append
        return [...otherEvents, ...targetDayEvents, draggedEvent];
      }

      // Insert at correct position
      let insertIdx = position === 'above' ? targetIdx : targetIdx + 1;
      if (insertIdx > targetDayEvents.length) insertIdx = targetDayEvents.length;
      targetDayEvents.splice(insertIdx, 0, draggedEvent);

      return [...otherEvents, ...targetDayEvents];
    });
  };

  const renderDayContent = (
    day: Date,
    formattedDate: string,
    dayEvents: Event[],
    currentColor: string
  ) => {
    // Extracted handlers for accessibility and reduced nesting
    const handleDayDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      // Always clear previous highlight before setting new
      setDragOverEventId(null);
      setDragOverPosition(null);
      // If you want to highlight the cell itself, set a cell-level state here
    };

    const handleDayDrop = (e: React.DragEvent<HTMLButtonElement>, day: Date) => {
      if (
        draggedEventId !== null &&
        e.target === e.currentTarget
      ) {
        const draggedEvent = events.find(ev => ev.id === draggedEventId);
        if (!draggedEvent) return;

        setEvents(prevEvents => {
          const updatedEvents = filterOutEventById(prevEvents, draggedEventId);
          const newEvent = { ...draggedEvent, date: day };
          const dayEvents = filterEventsByDay(updatedEvents, day);
          const otherEvents = filterEventsNotByDay(updatedEvents, day);
          return [...otherEvents, ...dayEvents, newEvent];
        });

        setDraggedEventId(null);
        setDragOverEventId(null);
        setDragOverPosition(null);
      }
    };

    const handleDayKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, day: Date) => {
      if (
        (e.key === 'Enter' || e.key === ' ') &&
        draggedEventId !== null
      ) {
        const draggedEvent = events.find(ev => ev.id === draggedEventId);
        if (!draggedEvent) return;

        setEvents(prevEvents => {
          const updatedEvents = filterOutEventById(prevEvents, draggedEventId);
          const newEvent = { ...draggedEvent, date: day };
          const dayEvents = filterEventsByDay(updatedEvents, day);
          const otherEvents = filterEventsNotByDay(updatedEvents, day);
          return [...otherEvents, ...dayEvents, newEvent];
        });

        setDraggedEventId(null);
        setDragOverEventId(null);
        setDragOverPosition(null);
      }
    };

    return (
      <button
        type="button"
        className="flex flex-col h-full w-full text-left"
        aria-label="Drop event here"
        tabIndex={0}
        onDragOver={handleDayDragOver}
        onDrop={e => handleDayDrop(e, day)}
        onKeyDown={e => handleDayKeyDown(e, day)}
      >
        <div className="p-1">
          <span
            className={`text-sm ${isSameDay(day, new Date()) ? 'rounded-full w-6 h-6 flex items-center justify-center inline-flex' : ''}`}
            style={
              isSameDay(day, new Date())
                ? { backgroundColor: currentColor, color: getTodayTextColor() }
                : {}
            }
          >
            {formattedDate}
          </span>
        </div>
        <div
          className="flex flex-col gap-1 w-full overflow-y-auto custom-scrollbar pb-2 mt-2.5"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            maxHeight: '7.2rem',
            minHeight: 0,
          }}
        >
          {dayEvents.map((event) => (
            <CalendarEvent
              key={event.id}
              event={event}
              draggable
              onDragStart={() => setDraggedEventId(event.id)}
              onDragEnd={() => {
                setDraggedEventId(null)
                setDragOverEventId(null)
                setDragOverPosition(null)
              }}
              onDragOver={e => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const offset = e.clientY - rect.top;
                const position = offset < rect.height / 2 ? 'above' : 'below';
                // Only set the new highlight (this will replace the old one)
                setDragOverEventId(event.id);
                setDragOverPosition(position);
              }}
              onDragLeave={() => {
                setDragOverEventId(null);
                setDragOverPosition(null);
              }}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                if (
                  draggedEventId !== null &&
                  dragOverEventId === event.id &&
                  draggedEventId !== dragOverEventId
                ) {
                  moveOrReorderEvents(
                    day,
                    draggedEventId,
                    event.id,
                    dragOverPosition!
                  );
                }
                setDraggedEventId(null);
                setDragOverEventId(null);
                setDragOverPosition(null);
              }}
              isDragOver={dragOverEventId === event.id}
              dragOverPosition={dragOverPosition}
              isDragging={draggedEventId === event.id}
            />
          ))}
        </div>
      </button>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const currentColor = getColorHex()

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd')
        const cloneDay = day
        const isWeekendDay = isWeekend(cloneDay)
        const isCurrentMonth = isSameMonth(day, monthStart)
        const isSelectedColumn = selectedColumn !== null && cloneDay.getDay() === selectedColumn

        const dayEvents = events.filter((event) => isSameDay(event.date, cloneDay))
        
        const cellStyle = getCellStyle(isWeekendDay, isCurrentMonth)
        const borderStyle = getBorderStyle(day, isSelectedColumn, selectedDate, currentColor)
        const cellClasses = getCellClasses(day, isSelectedColumn, selectedDate, monthStart)

        const finalCellStyle = { 
          ...cellStyle, 
          ...borderStyle,
          color: isCurrentMonth ? getTextColor() : undefined
        }

        days.push(
          <button
            key={day.toString()}
            className={cellClasses}
            style={finalCellStyle}
            onClick={() => onDateClick(cloneDay)}
            onDoubleClick={() => onDateDoubleClick?.(cloneDay)}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.backgroundColor = getHoverColor()
              target.style.transition = 'background-color 0.2s ease'
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.backgroundColor = finalCellStyle.backgroundColor ?? ''
              target.style.transition = 'background-color 0.2s ease'
            }}
          >
            {renderDayContent(day, formattedDate, dayEvents, currentColor)}
          </button>,
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
