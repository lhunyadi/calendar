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
  id: string | number;
  name: string;
  date: Date;
  color: string;
  priority: number;
  isHoliday?: boolean;
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
  onEventClick?: (event: Event) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  setEvents,
  selectedDate,
  selectedColumn,
  onDateClick,
  onDayHeaderClick,
  onDateDoubleClick,
  onEventClick,
}) => {
  const { getColorHex, getBgColor, getCalendarOutMonthColor, getTextColor, themeMode, getTodayTextColor, getHoverColor } = useTheme()
  
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const renderDays = () => {
    const dateFormat = 'EEEE'
    const days = []
    const startDate = startOfWeek(startOfMonth(currentDate))
    const todayDayOfWeek = new Date().getDay()

    for (let i = 0; i < 7; i++) {
      const dayDate = addDays(startDate, i)
      const isTodayDayOfWeek = dayDate.getDay() === todayDayOfWeek
      const isSelectedColumn = selectedColumn !== null && dayDate.getDay() === selectedColumn
      
      const currentColor = getColorHex()
      
      days.push(
        <button
          key={i}
          className={`font-medium text-center py-2 text-sm cursor-pointer ${
            isSelectedColumn ? 'border-t-2' : ''
          }`}
          style={{
            color: isTodayDayOfWeek ? currentColor : getTextColor(),
            borderTopColor: isSelectedColumn ? currentColor : undefined,
            backgroundColor: getBgColor()
          }}
          onClick={() => onDayHeaderClick(dayDate)}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.backgroundColor = getHoverColor()
            target.style.transition = 'background-color 0.2s ease'
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.backgroundColor = getBgColor()
            target.style.transition = 'background-color 0.2s ease'
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

  const [draggedEventId, setDraggedEventId] = React.useState<string | number | null>(null)
  const [dragOverEventId, setDragOverEventId] = React.useState<string | number | null>(null)
  const [dragOverPosition, setDragOverPosition] = React.useState<'above' | 'below' | null>(null)

  const moveOrReorderEvents = (
    targetDate: Date,
    draggedId: string | number,
    targetId: string | number,
    position: 'above' | 'below'
  ) => {
    setEvents(prevEvents => {
      let draggedEvent: Event | undefined;
      const filteredEvents = prevEvents.filter(e => {
        if (e.id === draggedId) {
          draggedEvent = { ...e, date: targetDate };
          return false;
        }
        return true;
      });
      if (!draggedEvent) return prevEvents;
      const targetDayEvents = filteredEvents.filter(e => isSameDay(e.date, targetDate));
      const otherEvents = filteredEvents.filter(e => !isSameDay(e.date, targetDate));
      const targetIdx = targetDayEvents.findIndex(e => e.id === targetId);
      if (targetIdx === -1) return [...otherEvents, ...targetDayEvents, draggedEvent];
      let insertIdx = position === 'above' ? targetIdx : targetIdx + 1;
      if (insertIdx > targetDayEvents.length) insertIdx = targetDayEvents.length;
      targetDayEvents.splice(insertIdx, 0, draggedEvent);
      return [...otherEvents, ...targetDayEvents];
    });
  };

  const sortHolidaysFirst = (a: Event, b: Event) => {
    if (a.isHoliday === b.isHoliday) return 0;
    if (a.isHoliday) return -1;
    return 1;
  };

  const renderCalendarEvent = (event: Event, day: Date) => {
    const isHoliday = !!event.isHoliday;
    const isDragOver = dragOverEventId === event.id;
    const isDragging = draggedEventId === event.id;

    const dragProps = !isHoliday
      ? {
          draggable: true,
          onDragStart: () => setDraggedEventId(event.id),
          onDragEnd: () => {
            setDraggedEventId(null);
            setDragOverEventId(null);
            setDragOverPosition(null);
          },
          onDragOver: (e: React.DragEvent<HTMLButtonElement>) => {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            const offset = e.clientY - rect.top;
            const position = offset < rect.height / 2 ? 'above' : 'below';
            setDragOverEventId(event.id);
            setDragOverPosition(position);
          },
          onDragLeave: () => {
            setDragOverEventId(null);
            setDragOverPosition(null);
          },
          onDrop: (e: React.DragEvent<HTMLButtonElement>) => {
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
          },
        }
      : {
          draggable: false,
          onDragStart: undefined,
          onDragEnd: undefined,
          onDragOver: undefined,
          onDragLeave: undefined,
          onDrop: undefined,
        };

    return (
      <CalendarEvent
        key={event.id}
        event={event}
        {...dragProps}
        isDragOver={isDragOver}
        dragOverPosition={dragOverPosition}
        isDragging={isDragging}
        onClick={!isHoliday ? () => onEventClick?.(event) : undefined}
      />
    );
  };

  const renderDayContent = (
    day: Date,
    formattedDate: string,
    dayEvents: Event[],
    currentColor: string
  ) => (
    <div
      className="flex flex-col h-full w-full text-left"
      aria-label="Drop event here"
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
        {[...dayEvents]
          .sort(sortHolidaysFirst)
          .map(event => renderCalendarEvent(event, day))}
      </div>
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(startOfMonth(currentDate))
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
          <div
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
            onDragOver={e => {
              e.preventDefault();
            }}
            onDrop={e => {
              e.preventDefault();
              if (draggedEventId !== null && dragOverEventId === null) {
                const draggedEvent = events.find(ev => ev.id === draggedEventId);
                if (!draggedEvent) return;
                setEvents(prevEvents => {
                  const updatedEvents = prevEvents.filter(ev => ev.id !== draggedEventId);
                  const newEvent = { ...draggedEvent, date: cloneDay };
                  const dayEvents = updatedEvents.filter(ev => isSameDay(ev.date, cloneDay));
                  const otherEvents = updatedEvents.filter(ev => !isSameDay(ev.date, cloneDay));
                  return [...otherEvents, ...dayEvents, newEvent];
                });
                setDraggedEventId(null);
                setDragOverEventId(null);
                setDragOverPosition(null);
              }
            }}
          >
            {renderDayContent(day, formattedDate, dayEvents, currentColor)}
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
