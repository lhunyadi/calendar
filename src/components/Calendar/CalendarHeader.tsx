import React, { useState, useRef } from 'react'
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
  const paletteButtonRef = useRef<HTMLButtonElement>(null)
  const { getColorHex, themeMode, toggleTheme, getTextColor, getBgColor, getSurfaceColor, getHoverColor } = useTheme()

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
        <div className="flex items-center space-x-2">
          {isPaletteOpen && (
            <ColorPalette 
              isOpen={isPaletteOpen} 
              onClose={() => setIsPaletteOpen(false)}
              paletteButtonRef={paletteButtonRef}
            />
          )}
          <button
            ref={paletteButtonRef}
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="relative p-1 rounded"
          >
            <Palette 
              size={18} 
              className="cursor-pointer"
              style={{ color: getButtonIconColor() }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as SVGElement
                target.style.color = getColorHex()
                target.style.transition = 'color 0.2s ease' // Only transition on hover
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as SVGElement
                target.style.color = getButtonIconColor()
                target.style.transition = 'color 0.2s ease' // Only transition on hover
              }}
            />
          </button>
          <button
            onClick={toggleTheme}
            className="relative p-1 rounded"
          >
            {themeMode === 'dark' ? (
              <Sun 
                size={18} 
                className="cursor-pointer"
                style={{ color: getButtonIconColor() }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as SVGElement
                  target.style.color = getColorHex()
                  target.style.transition = 'color 0.2s ease' // Only transition on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as SVGElement
                  target.style.color = getButtonIconColor()
                  target.style.transition = 'color 0.2s ease' // Only transition on hover
                }}
              />
            ) : (
              <Moon 
                size={18} 
                className="cursor-pointer"
                style={{ color: getButtonIconColor() }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as SVGElement
                  target.style.color = getColorHex()
                  target.style.transition = 'color 0.2s ease' // Only transition on hover
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as SVGElement
                  target.style.color = getButtonIconColor()
                  target.style.transition = 'color 0.2s ease' // Only transition on hover
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
                target.style.backgroundColor = getHoverColor() // Use transparent brand color
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
                target.style.backgroundColor = getHoverColor() // Use transparent brand color
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
