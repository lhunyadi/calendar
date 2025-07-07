import React, { useEffect, useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
}) => {
  const [eventName, setEventName] = React.useState("");
  const { getBgColor, getTextColor, getColorHex, getSurfaceColor, themeMode } = useTheme()

  const inputRef = useRef<HTMLInputElement>(null)

  // Hide scrollbar for description textarea
  useEffect(() => {
    if (!isOpen) return;
    const styleId = 'custom-scrollbar-style';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
    const css = `.custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: transparent; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }`;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = css;
  }, [isOpen, themeMode, getSurfaceColor]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isOpen])

  // Reset eventName when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEventName("");
    }
  }, [isOpen]);

  if (!isOpen || !selectedDate) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
        onKeyDown={handleKeyDown}
        aria-label="Close modal"
      />
      
      {/* Modal content */}
      <div
        className="relative rounded shadow-lg z-10"
        style={{
          backgroundColor: getBgColor(),
          color: getTextColor(),
          padding: '32px', // 2x 16px (left/right/top/bottom)
          width: '48rem', // 2x w-96 (24rem)
          minWidth: '48rem',
          height: 'auto',
          minHeight: '0',
        }}
      >
        {/* Header with both title and close button */}
        <div className="flex items-center justify-between h-6">
          <h2 
            className="text-sm font-medium leading-6 m-0 font-['Segoe_UI','system-ui','sans-serif']"
            style={{ color: getColorHex() }}
            title={eventName || 'Event'}
          >
            {eventName !== '' ? eventName : 'Event'}
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center transition-colors material-icons-outlined"
            style={{ 
              color: getTextColor(),
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '18px'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.color = getColorHex()
              target.style.transition = 'color 0.2s ease'
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.color = getTextColor()
              target.style.transition = 'color 0.2s ease'
            }}
            aria-label="Close modal"
          >
            close
          </button>
        </div>
        
        {/* Modal content */}
        <div className="flex flex-col h-full">
          {/* Inner box with header surface color */}
            <div 
              className={`w-full rounded flex flex-col border ${themeMode === 'dark' ? 'border-dark-border' : 'border-light-border'}`}
              style={{
                backgroundColor: getSurfaceColor(),
                marginTop: '4%', // 4% of modal height
                marginBottom: '0', // no extra bottom margin
                marginLeft: '0',
                marginRight: '0',
                height: 'auto',
                minHeight: '0',
              }}
            >
            {/* Save header */}
            <div className={`flex items-center px-4 py-4`}
                 style={{ borderBottom: `1px solid ${themeMode === 'dark' ? '#2C2D30' : '#e6e6e6'}` }}>
              <button
                className="flex flex-row items-center justify-center gap-2 rounded shadow text-sm"
                style={{
                  backgroundColor: getColorHex(),
                  color: themeMode === 'dark' ? '#fff' : '#000',
                  border: 'none',
                  outline: 'none',
                  height: '2.25rem', // match textbox height
                  minWidth: '2.25rem',
                  padding: '0 0.75rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  transition: 'color 0.2s, background 0.2s',
                  display: 'flex',
                  gap: '0.5ch'
                }}
                onMouseEnter={e => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.color = themeMode === 'dark' ? '#000' : '#fff';
                  target.style.transition = 'color 0.2s';
                }}
                onMouseLeave={e => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.color = themeMode === 'dark' ? '#fff' : '#000';
                  target.style.transition = 'color 0.2s';
                }}
                title="Save"
              >
                <span className="material-icons-outlined" style={{ fontSize: '0.875rem', lineHeight: '1.25rem', verticalAlign: 'middle' }}>
                  edit_calendar
                </span>
                <span style={{ fontSize: '0.875rem', lineHeight: '1.25rem', display: 'inline' }}>Save</span>
              </button>
            </div>
            {/* Name section */}
            <div className="px-4 py-4 flex flex-col gap-1"
                 style={{ borderBottom: `1px solid ${themeMode === 'dark' ? '#2C2D30' : '#e6e6e6'}` }}>
              <input
                ref={inputRef}
                id="event-title-input"
                type="text"
                placeholder="Name"
                value={eventName}
                maxLength={50}
                onChange={e => setEventName(e.target.value)}
                className="rounded px-2 py-1 text-sm outline-none border transition-colors bg-transparent"
                style={{
                  color: themeMode === 'dark' ? '#b0b3b8' : '#8a8a8a',
                  backgroundColor: 'transparent',
                  fontSize: '0.875rem', // text-sm
                  lineHeight: '1.25rem',
                  fontWeight: 400,
                  borderColor: getColorHex(),
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                onFocus={e => {
                  e.currentTarget.style.color = themeMode === 'dark' ? '#fff' : '#000';
                }}
                onBlur={e => {
                  e.currentTarget.style.color = themeMode === 'dark' ? '#b0b3b8' : '#8a8a8a';
                }}
              />
            </div>
            {/* Description section (no label, 10 lines, fills modal) */}
            <div className="px-4 py-4 flex flex-col gap-1">
              <textarea
                id="event-description-input"
                placeholder="Description"
                rows={10}
                className="rounded px-2 py-1 text-sm outline-none border transition-colors bg-transparent resize-none custom-scrollbar"
                style={{
                  color: themeMode === 'dark' ? '#b0b3b8' : '#8a8a8a',
                  backgroundColor: 'transparent',
                  fontSize: '0.875rem', // text-sm
                  lineHeight: '1.25rem', // text-sm
                  fontWeight: 400,
                  borderColor: getColorHex(),
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  minHeight: '12.5rem', // 10 lines * 1.25rem
                  maxHeight: 'none',
                  height: '12.5rem',
                  resize: 'none',
                }}
                onFocus={e => {
                  e.currentTarget.style.color = themeMode === 'dark' ? '#fff' : '#000';
                }}
                onBlur={e => {
                  e.currentTarget.style.color = themeMode === 'dark' ? '#b0b3b8' : '#8a8a8a';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
