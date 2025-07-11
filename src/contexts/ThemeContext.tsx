import React, { createContext, useContext, useState, useMemo } from 'react'
import { flushSync } from 'react-dom'
import type { ReactNode } from 'react'
import type { BrandColor, ThemeMode, ThemeContextType } from './themeTypes'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentColor, setCurrentColor] = useState<BrandColor>('brand-blue') 
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')

  const colorOptions: BrandColor[] = [
    'brand-blue',
    'brand-yellow', 
    'brand-green',
    'brand-red'
  ]

  const toggleTheme = () => {
    document.body.classList.add('theme-changing')
    flushSync(() => {
      setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')
    })
    requestAnimationFrame(() => {
      document.body.classList.remove('theme-changing')
    })
  }

  const setCurrentColorSync = (color: BrandColor) => {
    document.body.classList.add('theme-changing')
    flushSync(() => {
      setCurrentColor(color)
    })
    requestAnimationFrame(() => {
      document.body.classList.remove('theme-changing')
    })
  }

  const getColorHex = (): string => {
    const colorMap: Record<BrandColor, string> = {
      'brand-blue': '#36C5F0',
      'brand-yellow': '#ECB22E',
      'brand-green': '#2EB67D',
      'brand-red': '#E01E5A'
    }
    return colorMap[currentColor]
  }

  // Dynamic color functions that swap based on theme mode
  const getTextColor = (): string => {
    return themeMode === 'dark' ? '#ffffff' : '#000000'
  }

  const getBgColor = (): string => {
    return themeMode === 'dark' ? '#1A1D21' : '#ffffff'
  }

  const getSurfaceColor = (): string => {
    return themeMode === 'dark' ? '#222529' : '#fafafa'
  }

  const getTextColorClass = (): string => {
    return themeMode === 'dark' ? 'text-white' : 'text-black'
  }

  const getBgColorClass = (): string => {
    return themeMode === 'dark' ? 'bg-brand-dark' : 'bg-white'
  }

  const getSurfaceColorClass = (): string => {
    return themeMode === 'dark' ? 'bg-brand-medium' : 'bg-brand-light'
  }

  const getCalendarInMonthColor = (): string => {
    return themeMode === 'dark' ? '#1A1D21' : '#ffffff'
  }

  const getCalendarOutMonthColor = (): string => {
    return themeMode === 'dark' ? '#222529' : '#fafafa'
  }

  const getHoverColor = (): string => {
    const brandColor = getColorHex()
    if (themeMode === 'dark') {
      return `${brandColor}40`
    } else {
      const hex = brandColor.replace('#', '')
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      const blendedR = Math.round(r * 0.25 + 255 * 0.75)
      const blendedG = Math.round(g * 0.25 + 255 * 0.75)
      const blendedB = Math.round(b * 0.25 + 255 * 0.75)
      return `#${blendedR.toString(16).padStart(2, '0')}${blendedG.toString(16).padStart(2, '0')}${blendedB.toString(16).padStart(2, '0')}`
    }
  }

  const getTodayTextColor = (): string => {
    return themeMode === 'dark' ? '#1A1D21' : '#ffffff'
  }

  const value = useMemo(() => ({
    currentColor,
    setCurrentColor: setCurrentColorSync,
    colorOptions,
    getColorHex,
    themeMode,
    toggleTheme,
    getTextColor,
    getBgColor,
    getSurfaceColor,
    getTextColorClass,
    getBgColorClass,
    getSurfaceColorClass,
    getCalendarInMonthColor,
    getCalendarOutMonthColor,
    getHoverColor,
    getTodayTextColor
  }), [
    currentColor,
    setCurrentColorSync,
    colorOptions,
    getColorHex,
    themeMode,
    toggleTheme,
    getTextColor,
    getBgColor,
    getSurfaceColor,
    getTextColorClass,
    getBgColorClass,
    getSurfaceColorClass,
    getCalendarInMonthColor,
    getCalendarOutMonthColor,
    getHoverColor,
    getTodayTextColor
  ])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
