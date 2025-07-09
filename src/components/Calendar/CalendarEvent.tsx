import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface Event {
  id: number;
  name: string;
  date: Date;
  color: string;
  priority: number;
}

interface CalendarEventProps {
  event: Event;
  draggable?: boolean;
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  onDragEnd?: React.DragEventHandler<HTMLDivElement>;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  onDrop?: React.DragEventHandler<HTMLDivElement>;
  isDragOver?: boolean;
  dragOverPosition?: 'above' | 'below' | null;
  isDragging?: boolean;
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({
  event,
  draggable,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragOver,
  dragOverPosition,
  isDragging,
}) => {
  const { getColorHex } = useTheme();

  // Priority style: Low = border only, Medium = diagonal, High = solid
  let background = 'transparent';
  if (event.priority === 1) {
    background = `repeating-linear-gradient(135deg, ${event.color}33 0 8px, transparent 8px 16px)`;
  } else if (event.priority === 2) {
    background = `linear-gradient(90deg, ${event.color}33 0%, ${event.color}33 100%)`;
  }

  // Highlight color for drag-over
  const highlightColor = getColorHex();

  // Dynamic border style for drag-over indicator
  const borderTop =
    isDragOver && dragOverPosition === 'above'
      ? `1px solid ${highlightColor}`
      : `1px solid ${event.color}`;
  const borderBottom =
    isDragOver && dragOverPosition === 'below'
      ? `1px solid ${highlightColor}`
      : `1px solid ${event.color}`;

  return (
    <div
      className="relative text-xs p-1 rounded truncate cursor-pointer hover:opacity-90 transition-opacity flex items-center w-full box-border"
      style={{
        background,
        borderLeft: `1px solid ${event.color}`,
        borderRight: `1px solid ${event.color}`,
        borderTop,
        borderBottom,
        color: '#fff',
        minHeight: '2.2rem',
        fontWeight: 500,
        maxWidth: '100%',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
        transition: 'border-color 0.15s',
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      title={event.name}
    >
      <span className="relative z-10 w-full truncate">{event.name}</span>
    </div>
  );
}
