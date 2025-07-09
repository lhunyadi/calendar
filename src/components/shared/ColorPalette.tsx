import React, { useEffect, useRef, useState, useCallback } from 'react'
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
  const [mounted, setMounted] = useState<boolean>(false)

  // Show method: mount and animate
  const show = useCallback(() => {
    setMounted(true)
    setVisibleColors(0)
    // First color appears immediately
    const timer = setTimeout(() => {
      setVisibleColors(1)
    }, 30)
    // Each subsequent color appears after the previous
    colorOptions.forEach((_, index) => {
      if (index > 0) {
        setTimeout(() => {
          setVisibleColors(index + 1)
        }, 30 + (index * 120))
      }
    })
    return () => clearTimeout(timer)
  }, [colorOptions])

  // Hide method: unmount and reset
  const hide = useCallback(() => {
    setVisibleColors(0)
    setMounted(false)
  }, [])

  // Effect to handle open/close logic
  useEffect(() => {
    // Provide multiple methods to control palette, not just isOpen
    if (isOpen) {
      show()
    } else if (!isOpen && mounted) {
      hide()
    }
    // Also allow manual show/hide via keyboard (for accessibility)
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mounted) {
        hide()
        onClose()
      }
      if ((e.key === 'Enter' || e.key === ' ') && !mounted && isOpen) {
        show()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, show, hide, mounted, onClose])

  // Effect for click outside
  useEffect(() => {
    if (!mounted) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isClickInsidePalette = ref.current?.contains(target)
      const isClickOnPaletteButton = paletteButtonRef?.current?.contains(target)
      if (!isClickInsidePalette && !isClickOnPaletteButton) {
        hide()
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mounted, onClose, paletteButtonRef, hide])

  if (!mounted) return null

  const handleColorSelect = (color: BrandColor) => {
    setCurrentColor(color)
    hide()
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
        const ringColor = themeMode === 'dark' ? '#ffffff' : '#000000'
        return (
          <div
            key={color}
            className="transition-all duration-300 ease-out"
            style={{
              transform: 'translateX(0)',
              opacity: 1,
              animationName: 'slideInFromRight',
              animationDuration: '0.12s',
              animationFillMode: 'both',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
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
