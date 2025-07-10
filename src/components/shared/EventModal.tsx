import React, { useEffect, useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  onSave: (event: { name: string; color: string; priority: number; date: Date }) => void;
  editingEvent?: { name: string; color: string; priority: number } | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  editingEvent,
}) => {
  const [eventName, setEventName] = React.useState("");
  const { getBgColor, getTextColor, getColorHex, getSurfaceColor, themeMode } = useTheme();
  // Use the current highlight color from the calendar as the default
  const highlightColor = getColorHex();
  const [selectedColor, setSelectedColor] = React.useState<string>(highlightColor);
  // Priority: 0 = Low, 1 = Medium, 2 = High, -1 = none
  const [selectedPriority, setSelectedPriority] = React.useState<number>(-1);

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

  // Reset eventName and selectedColor when modal closes
  useEffect(() => {
    if (isOpen && editingEvent) {
      setEventName(editingEvent.name);
      setSelectedColor(editingEvent.color);
      setSelectedPriority(editingEvent.priority);
    } else if (isOpen && !editingEvent) {
      setEventName("");
      setSelectedColor(highlightColor);
      setSelectedPriority(-1);
    }
  }, [isOpen, editingEvent, highlightColor]);

  // Escape closes modal: listen on document when open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !selectedDate) {
    return null;
  }
  const handleSave = () => {
    if (!eventName.trim() || !selectedColor || selectedPriority === -1 || !selectedDate) return;
    onSave({
      name: eventName.trim(),
      color: selectedColor,
      priority: selectedPriority,
      date: selectedDate,
    });
    onClose();
  };

  // Extracted theme-dependent values for SonarQube compliance
  const borderSectionColor = themeMode === 'dark' ? '#2C2D30' : '#e6e6e6';
  const selectedBorderColor = themeMode === 'dark' ? '#fff' : '#000';

  const getPriorityBackground = (idx: number) => {
    if (idx === 1) {
      return themeMode === 'dark'
        ? `repeating-linear-gradient(135deg, ${selectedColor}33 0 8px, transparent 8px 16px)`
        : `repeating-linear-gradient(135deg, ${selectedColor}22 0 8px, transparent 8px 16px)`;
    }
    if (idx === 2) {
      return themeMode === 'dark'
        ? `linear-gradient(90deg, ${selectedColor}33 0%, ${selectedColor}33 100%)`
        : `linear-gradient(90deg, ${selectedColor}22 0%, ${selectedColor}22 100%)`;
    }
    return 'transparent';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}
        onClick={onClose}
        aria-label="Close modal"
        tabIndex={-1}
      />
      {/* Modal content */}
      <div
        className="relative rounded shadow-lg z-10"
        style={{
          backgroundColor: getBgColor(),
          color: getTextColor(),
          padding: '32px',
          width: '48rem',
          minWidth: '48rem',
          height: 'auto',
          minHeight: '0',
        }}
      >
        {/* Header with both title and close button */}
        <div className="flex items-center justify-between h-6">
          <h2
            className="text-lg font-medium leading-6 m-0 font-['Segoe_UI','system-ui','sans-serif']"
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
              marginTop: '4%',
              marginBottom: '0',
              marginLeft: '0',
              marginRight: '0',
              height: 'auto',
              minHeight: '0',
            }}
          >
            {/* Save header */}
            <div className={`flex items-center px-4 py-4`}
                 style={{ borderBottom: `1px solid ${borderSectionColor}` }}>
              <button
                className="flex flex-row items-center justify-center gap-2 rounded shadow text-sm px-3 py-1"
                style={{
                  backgroundColor: getColorHex(),
                  color: themeMode === 'dark' ? '#fff' : '#000',
                  border: 'none',
                  outline: 'none',
                  height: '2.25rem',
                  minWidth: '2.25rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  transition: 'color 0.2s, background 0.2s',
                  display: 'flex',
                  gap: '0.5ch',
                  cursor: 'pointer',
                  opacity: (!eventName.trim() || !selectedColor || selectedPriority === -1) ? 0.6 : 1,
                  pointerEvents: (!eventName.trim() || !selectedColor || selectedPriority === -1) ? 'none' : 'auto',
                }}
                onMouseEnter={e => {
                  const target = e.currentTarget as HTMLElement;
                  const currentColor = getColorHex();
                  target.style.backgroundColor = `${currentColor}DD`;
                  target.style.color = themeMode === 'dark' ? '#000' : '#fff';
                  target.style.transition = 'color 0.2s, background 0.2s';
                }}
                onMouseLeave={e => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.backgroundColor = getColorHex();
                  target.style.color = themeMode === 'dark' ? '#fff' : '#000';
                  target.style.transition = 'color 0.2s, background 0.2s';
                }}
                title="Save"
                onClick={handleSave}
                disabled={!eventName.trim() || !selectedColor || selectedPriority === -1}
                aria-disabled={!eventName.trim() || !selectedColor || selectedPriority === -1}
              >
                <span style={{ fontSize: '0.875rem', lineHeight: '1.25rem', display: 'inline' }}>Save</span>
              </button>
            </div>
            {/* Color header section */}
            <div
              className="flex items-center gap-2 px-4"
              style={{
                borderBottom: `1px solid ${borderSectionColor}`,
                minHeight: '2.25rem',
                margin: 0,
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                boxShadow: 'none',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
              }}
            >
              {/* Color circles with highlight effect matching ColorPalette */}
              {[
                { color: '#36C5F0', label: 'Blue' },
                { color: '#2EB67D', label: 'Green' },
                { color: '#ECB22E', label: 'Yellow' },
                { color: '#E01E5A', label: 'Red' },
              ].map(({ color, label }) => {
                // Brand-white in dark, brand-black in light
                const ringColor = themeMode === 'dark' ? '#ffffff' : '#000000';
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    title={label}
                    aria-label={label}
                    onClick={() => setSelectedColor(color)}
                    className={`p-1 rounded-full transition-all duration-300 ease-out hover:scale-110 ${
                      isSelected ? 'ring-2 ring-offset-1 ring-offset-transparent' : ''
                    }`}
                    style={
                      isSelected
                        ? { '--tw-ring-color': ringColor } as React.CSSProperties
                        : {}
                    }
                    tabIndex={0}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </button>
                );
              })}
            </div>
            {/* Empty header section between Color and Name, visually separated only by the same grey line as other modal sections */}
            <div
              className="flex items-center gap-2 px-4"
              style={{
                borderBottom: `1px solid ${borderSectionColor}`,
                minHeight: '2.25rem',
                margin: 0,
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                boxShadow: 'none',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
              }}
            >
              {/* 3 rectangles visually separated, now as buttons with theme-aware outline */}
              {["Low", "Medium", "High"].map((label, idx) => {
                const background = getPriorityBackground(idx);
                const isSelected = selectedPriority === idx;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-label={`${label} priority`}
                    tabIndex={0}
                    onClick={() => setSelectedPriority(idx)}
                    style={{
                      width: '53px',
                      height: '1.25rem',
                      borderRadius: '0.375rem',
                      border: isSelected
                        ? `1px solid ${selectedBorderColor}`
                        : `1px solid ${selectedColor}`,
                      background,
                      outline: 'none',
                      boxShadow: 'none',
                      transition: 'border-color 0.2s',
                      cursor: 'pointer',
                      position: 'relative',
                      marginRight: idx < 2 ? '0.5rem' : undefined,
                      zIndex: 1,
                    }}
                  />
                );
              })}
            </div>
            {/* Name section */}
            <div className="px-4 py-4 flex flex-col gap-1"
                 style={{ borderBottom: `1px solid ${borderSectionColor}` }}>
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
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  fontWeight: 400,
                  borderColor: inputRef.current && document.activeElement === inputRef.current ? getColorHex() : borderSectionColor,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                onFocus={e => {
                  e.currentTarget.style.color = themeMode === 'dark' ? '#fff' : '#000';
                  e.currentTarget.style.borderColor = getColorHex();
                }}
                onBlur={e => {
                  e.currentTarget.style.color = themeMode === 'dark' ? '#b0b3b8' : '#8a8a8a';
                  e.currentTarget.style.borderColor = borderSectionColor;
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
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  fontWeight: 400,
                  borderColor: document.activeElement && document.activeElement.id === 'event-description-input' ? getColorHex() : borderSectionColor,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  minHeight: '12.5rem',
                  maxHeight: 'none',
                  height: '12.5rem',
                  resize: 'none',
                }}
                onFocus={e => {
                  e.currentTarget.style.color = themeMode === 'dark' ? '#fff' : '#000';
                  e.currentTarget.style.borderColor = getColorHex();
                }}
                onBlur={e => {
                  e.currentTarget.style.color = themeMode === 'dark' ? '#b0b3b8' : '#8a8a8a';
                  e.currentTarget.style.borderColor = borderSectionColor;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
