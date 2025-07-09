import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, Palette, Sun, Moon } from 'lucide-react'
import { format } from '../../utils/dateUtils'
import { ColorPalette } from '../shared/ColorPalette'
import { useTheme } from '../../contexts/ThemeContext'

interface CalendarHeaderProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const paletteButtonRef = useRef<HTMLButtonElement>(null)
  const { getColorHex, themeMode, toggleTheme, getTextColor, getBgColor, getSurfaceColor } = useTheme()

  // Focus input when menu opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Close search menu when clicking outside
  useEffect(() => {
    if (!isSearchOpen) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        !searchButtonRef.current?.contains(target) &&
        !searchInputRef.current?.parentElement?.contains(target)
      ) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isSearchOpen])

  const getButtonIconColor = (): string => {
    return themeMode === 'dark' ? '#ffffff' : '#000000' // white in dark mode, black in light mode
  }

  const getDisplayTitle = () => {
    // Always show Month Year format
    const monthName = format(currentDate, 'MMMM')
    const year = format(currentDate, 'yyyy')
    return { monthName, year }
  }

  const renderTitle = () => {
    const title = getDisplayTitle()
    // Month in highlight color, year in primary text color
    return (
      <>
        <span style={{ color: getColorHex() }}>{title.monthName}</span>
        <span style={{ color: getTextColor() }}> {title.year}</span>
      </>
    )
  }

  return (
    <div>
      {/* Color Palette Header */}
      <div 
        className="px-4 py-2 flex items-center justify-end border-b relative"
        style={{ 
          backgroundColor: getSurfaceColor(),
          borderColor: themeMode === 'dark' ? '#2C2D30' : '#e6e6e6'
        }}
      >
        <div className="flex items-center space-x-2 relative">
          {isPaletteOpen && (
            <ColorPalette 
              isOpen={isPaletteOpen} 
              onClose={() => setIsPaletteOpen(false)}
              paletteButtonRef={paletteButtonRef}
            />
          )}
          {/* Search Menu */}
          {isSearchOpen && (
            <div
              className="absolute left-0 z-20 flex items-center px-4 py-2 shadow-lg rounded-l-full rounded-r-full"
              style={{
                minWidth: '200px',
                marginLeft: '-220px',
                backgroundColor: getSurfaceColor(), // Match header background
                border: `1px solid ${themeMode === 'dark' ? '#2C2D30' : '#e6e6e6'}`, // Match grid border
                transition: 'box-shadow 0.2s',
              }}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className="bg-transparent outline-none w-full text-sm px-0"
                style={{
                  color: getTextColor(),
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  padding: 0,
                  minWidth: 0,
                  width: '100%',
                }}
                placeholder=""
              />
            </div>
          )}
          {/* Search Icon Button */}
          <button
            ref={searchButtonRef}
            className="relative p-1 rounded flex items-center justify-center"
            style={{ background: 'none', border: 'none' }}
            tabIndex={0}
            aria-label="Search"
            onClick={() => setIsSearchOpen(v => !v)}
          >
            <span
              className="material-icons cursor-pointer"
              style={{
                fontSize: 20,
                color: getButtonIconColor(),
                verticalAlign: 'middle',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = getColorHex();
                (e.currentTarget as HTMLElement).style.transition = 'color 0.2s ease';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = getButtonIconColor();
                (e.currentTarget as HTMLElement).style.transition = 'color 0.2s ease';
              }}
            >
              search
            </span>
          </button>
          {/* Color Palette Button */}
          <button
            ref={paletteButtonRef}
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="relative p-1 rounded"
          >
            <Palette
              size={18}
              className="cursor-pointer"
              style={{ color: getButtonIconColor() }}
              onMouseEnter={e => {
                const target = e.currentTarget as SVGElement;
                target.style.color = getColorHex();
                target.style.transition = 'color 0.2s ease';
              }}
              onMouseLeave={e => {
                const target = e.currentTarget as SVGElement;
                target.style.color = getButtonIconColor();
                target.style.transition = 'color 0.2s ease';
              }}
            />
          </button>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative p-1 rounded"
          >
            {themeMode === 'dark' ? (
              <Sun
                size={18}
                className="cursor-pointer"
                style={{ color: getButtonIconColor() }}
                onMouseEnter={e => {
                  const target = e.currentTarget as SVGElement;
                  target.style.color = getColorHex();
                  target.style.transition = 'color 0.2s ease';
                }}
                onMouseLeave={e => {
                  const target = e.currentTarget as SVGElement;
                  target.style.color = getButtonIconColor();
                  target.style.transition = 'color 0.2s ease';
                }}
              />
            ) : (
              <Moon
                size={18}
                className="cursor-pointer"
                style={{ color: getButtonIconColor() }}
                onMouseEnter={e => {
                  const target = e.currentTarget as SVGElement;
                  target.style.color = getColorHex();
                  target.style.transition = 'color 0.2s ease';
                }}
                onMouseLeave={e => {
                  const target = e.currentTarget as SVGElement;
                  target.style.color = getButtonIconColor();
                  target.style.transition = 'color 0.2s ease';
                }}
              />
            )}
          </button>
        </div>
      </div>
      
      {/* Main Header */}
      <div 
        className="p-4 flex items-center justify-between font-['Segoe_UI',_system-ui,_sans-serif]"
        style={{ backgroundColor: getBgColor() }}
      >
        <div className="flex items-center">
          <h2 className="text-xl font-bold">
            {renderTitle()}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToday}
            className="px-3 py-1 rounded text-sm"
            style={{ 
              backgroundColor: getColorHex(),
              color: getTextColor()
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement
              const currentColor = getColorHex()
              target.style.backgroundColor = `${currentColor}DD` // Slightly darker on hover for buttons
              target.style.transition = 'background-color 0.2s ease' // Only transition on hover
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.backgroundColor = getColorHex() // Back to original
              target.style.transition = 'background-color 0.2s ease' // Only transition on hover
            }}
          >
            Today
          </button>
          <div 
            className="flex items-center rounded overflow-hidden"
            style={{ backgroundColor: getBgColor() }}
          >
            <button
              onClick={onPrevMonth}
              className="p-1.5"
              style={{ color: getTextColor() }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement
                target.style.backgroundColor = getColorHex() // Use exact highlight color for hover
                target.style.transition = 'background-color 0.2s ease' // Only transition on hover
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement
                target.style.backgroundColor = 'transparent'
                target.style.transition = 'background-color 0.2s ease' // Only transition on hover
              }}
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button
              onClick={onNextMonth}
              className="p-1.5"
              style={{ color: getTextColor() }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement
                target.style.backgroundColor = getColorHex() // Use exact highlight color for hover
                target.style.transition = 'background-color 0.2s ease' // Only transition on hover
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement
                target.style.backgroundColor = 'transparent'
                target.style.transition = 'background-color 0.2s ease' // Only transition on hover
              }}
            >
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
