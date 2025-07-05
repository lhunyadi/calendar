import React, { useEffect, useRef, useState } from 'react'
import { useTheme, type BrandColor } from '../../contexts/ThemeContext'

interface ColorPaletteProps {
  isOpen: boolean
  onClose: () => void
  paletteButtonRef?: React.RefObject<HTMLButtonElement | null>
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ isOpen, onClose, paletteButtonRef }) => {
  const { currentColor, setCurrentColor, colorOptions, themeMode } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const [visibleColors, setVisibleColors] = useState<number>(0)

  useEffect(() => {
    if (isOpen) {
      // Reset and start the sequential animation
      setVisibleColors(0)
      
      // First color appears immediately
      const timer = setTimeout(() => {
        setVisibleColors(1) // Red appears at position 1
      }, 30)

      // Each subsequent color appears exactly when the previous color finishes moving to its next position
      colorOptions.forEach((_, index) => {
        if (index > 0) {
          setTimeout(() => {
            setVisibleColors(index + 1)
          }, 30 + (index * 120)) // 120ms = faster animation duration
        }
      })

      return () => clearTimeout(timer)
    } else {
      setVisibleColors(0)
    }
  }, [isOpen, colorOptions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isClickInsidePalette = ref.current?.contains(target)
      const isClickOnPaletteButton = paletteButtonRef?.current?.contains(target)
      
      if (!isClickInsidePalette && !isClickOnPaletteButton) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, paletteButtonRef])

  if (!isOpen) return null

  const handleColorSelect = (color: BrandColor) => {
    setCurrentColor(color)
    onClose()
  }

  const getColorValue = (color: BrandColor): string => {
    const colorMap: Record<BrandColor, string> = {
      'brand-blue': '#36C5F0',
      'brand-yellow': '#ECB22E',
      'brand-green': '#2EB67D',
      'brand-red': '#E01E5A'
    }
    return colorMap[color]
  }

  return (
    <div ref={ref} className="flex items-center space-x-2">
      {colorOptions.slice(0, visibleColors).map((color) => {
        const ringColor = themeMode === 'dark' ? '#ffffff' : '#000000' // brand-white in dark, brand-black in light
        return (
          <div
            key={color}
            className="transition-all duration-300 ease-out"
            style={{
              transform: 'translateX(0)',
              opacity: 1,
              animationName: 'slideInFromRight',
              animationDuration: '0.12s', // Faster animation - 120ms
              animationFillMode: 'both',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' // Smooth easing for precise timing
            }}
          >
            <button
              onClick={() => handleColorSelect(color)}
              className={`p-1 rounded-full transition-all duration-300 ease-out hover:scale-110 ${
                currentColor === color ? 'ring-2 ring-offset-1 ring-offset-transparent' : ''
              }`}
              style={currentColor === color ? { '--tw-ring-color': ringColor } as React.CSSProperties : {}}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getColorValue(color) }}
              />
            </button>
          </div>
        )
      })}
    </div>
  )
}
