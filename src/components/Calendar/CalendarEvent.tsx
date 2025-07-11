import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface Event {
  id: string | number;
  name: string;
  date: Date;
  color: string;
  priority: number;
  isHoliday?: boolean;
}

interface CalendarEventProps {
  event: Event;
  draggable?: boolean;
  onDragStart?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnd?: React.DragEventHandler<HTMLButtonElement>;
  onDragOver?: React.DragEventHandler<HTMLButtonElement>;
  onDragLeave?: React.DragEventHandler<HTMLButtonElement>;
  onDrop?: React.DragEventHandler<HTMLButtonElement>;
  isDragOver?: boolean;
  dragOverPosition?: 'above' | 'below' | null;
  isDragging?: boolean;
  onClick?: () => void;
}

function renderHolidayEvent(event: Event, getColorHex: () => string, getBgColor: () => string, themeMode: string) {
  const regex = /^(.*?)(\s\([A-Z]{2,3}\))$/;
  const execResult = regex.exec(event.name);
  const holidayName = execResult ? execResult[1] : event.name;
  const countryCode = execResult ? execResult[2] : '';

  return (
    <div
      className="relative text-xs p-1 rounded truncate flex items-center justify-center w-full box-border font-medium"
      style={{
        background: getBgColor(),
        borderLeft: `1px solid ${getColorHex()}`,
        borderRight: `1px solid ${getColorHex()}`,
        borderTop: `1px solid ${getColorHex()}`,
        borderBottom: `1px solid ${getColorHex()}`,
        color: getColorHex(),
        minHeight: '2.2rem',
        fontWeight: 500,
        maxWidth: '100%',
        opacity: 1,
        zIndex: 20,
        pointerEvents: 'none',
        userSelect: 'none',
        textAlign: 'center',
      }}
      aria-label={`Holiday: ${event.name}`}
      tabIndex={-1}
    >
      <span className="relative z-10 w-full truncate">
        {holidayName}
        {countryCode && (
          <span
            className="ml-1"
            style={{
              color: themeMode === 'dark' ? '#fff' : '#000'
            }}
          >
            {countryCode}
          </span>
        )}
      </span>
    </div>
  )
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({
  event,
  draggable,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver,
  dragOverPosition,
  isDragging,
  onClick,
}) => {
  const { getColorHex, getBgColor, themeMode } = useTheme();

  let background: string;
  if (event.isHoliday) {
    background = `repeating-linear-gradient(135deg, ${getColorHex()}33 0 8px, transparent 8px 16px), ${getBgColor()}`;
  } else if (event.priority === 1) {
    background = `repeating-linear-gradient(135deg, ${event.color}33 0 8px, transparent 8px 16px), ${getBgColor()}`;
  } else if (event.priority === 2) {
    background = `linear-gradient(90deg, ${event.color}33 0%, ${event.color}33 100%), ${getBgColor()}`;
  } else {
    background = getBgColor();
  }

  if (event.isHoliday) {
    return renderHolidayEvent(event, getColorHex, getBgColor, themeMode);
  }

  const highlightColor = getColorHex();

  const borderTop =
    isDragOver && dragOverPosition === 'above'
      ? `1px solid ${highlightColor}`
      : `1px solid ${event.color}`;
  const borderBottom =
    isDragOver && dragOverPosition === 'below'
      ? `1px solid ${highlightColor}`
      : `1px solid ${event.color}`;

  return (
    <button
      type="button"
      className="relative text-xs p-1 rounded truncate cursor-pointer hover:opacity-90 transition-opacity flex items-center w-full box-border group"
      style={{
        background,
        borderLeft: `1px solid ${event.color}`,
        borderRight: `1px solid ${event.color}`,
        borderTop,
        borderBottom,
        color: themeMode === 'dark' ? '#fff' : '#000',
        minHeight: '2.2rem',
        fontWeight: 500,
        maxWidth: '100%',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
        transition: 'border-color 0.15s',
        overflow: 'hidden',
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-label={`Event: ${event.name}`}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
        }
      }}
      onClick={onClick}
    >
      {/* Hover Highlight Overlay*/}
      <span
        className="pointer-events-none absolute inset-0 rounded z-20 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            themeMode === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.06)',
        }}
      />
      <span className="relative z-10 w-full truncate">{event.name}</span>
    </button>
  );
}
