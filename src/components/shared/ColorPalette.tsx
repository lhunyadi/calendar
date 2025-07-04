import React, { useEffect, useRef } from 'react'
import { useTheme, type BrandColor } from '../../contexts/ThemeContext'

interface ColorPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ isOpen, onClose }) => {
  const { currentColor, setCurrentColor, colorOptions } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleColorSelect = (color: BrandColor) => {
    setCurrentColor(color)
    onClose()
  }

  const getColorName = (color: BrandColor): string => {
    const nameMap: Record<BrandColor, string> = {
      'brand-blue': 'Blue',
      'brand-yellow': 'Yellow',
      'brand-green': 'Green',
      'brand-red': 'Red',
      'brand-aubergine': 'Aubergine'
    }
    return nameMap[color]
  }

  const getColorValue = (color: BrandColor): string => {
    const colorMap: Record<BrandColor, string> = {
      'brand-blue': '#36C5F0',
      'brand-yellow': '#ECB22E',
      'brand-green': '#2EB67D',
      'brand-red': '#E01E5A',
      'brand-aubergine': '#4A154B'
    }
    return colorMap[color]
  }

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 bg-[#19171D] border border-[#2C2D30] rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
      <h3 className="text-sm font-medium text-white mb-2">Choose Theme Color</h3>
      <div className="space-y-2">
        {colorOptions.map((color) => (
          <button
            key={color}
            onClick={() => handleColorSelect(color)}
            className={`w-full flex items-center space-x-3 p-2 rounded hover:bg-[#2C2D30] transition-colors ${
              currentColor === color ? 'bg-[#2C2D30]' : ''
            }`}
          >
            <div
              className="w-4 h-4 rounded-full border border-[#444]"
              style={{ backgroundColor: getColorValue(color) }}
            />
            <span className="text-sm text-[#D1D2D3]">{getColorName(color)}</span>
            {currentColor === color && (
              <div className="ml-auto w-2 h-2 rounded-full bg-white" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
