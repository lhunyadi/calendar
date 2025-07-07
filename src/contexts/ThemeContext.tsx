import React, { createContext, useContext, useState, useMemo, startTransition } from 'react'
import { flushSync } from 'react-dom'
import type { ReactNode } from 'react'

export type BrandColor = 'brand-blue' | 'brand-yellow' | 'brand-green' | 'brand-red'
export type ThemeMode = 'dark' | 'light'

interface ThemeContextType {
  currentColor: BrandColor
  setCurrentColor: (color: BrandColor) => void
  colorOptions: BrandColor[]
  getColorHex: () => string
  themeMode: ThemeMode
  toggleTheme: () => void
  // Dynamic color functions
  getTextColor: () => string
  getBgColor: () => string
  getSurfaceColor: () => string
  getTextColorClass: () => string
  getBgColorClass: () => string
  getSurfaceColorClass: () => string
  // Calendar-specific colors
  getCalendarInMonthColor: () => string
  getCalendarOutMonthColor: () => string
  getHoverColor: () => string
  getTodayTextColor: () => string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentColor, setCurrentColor] = useState<BrandColor>('brand-blue') // Default to blue
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark') // Default to dark mode
  const [isChangingTheme, setIsChangingTheme] = useState(false)

  const colorOptions: BrandColor[] = [
    'brand-blue',
    'brand-yellow', 
    'brand-green',
    'brand-red'
  ]

  const toggleTheme = () => {
    // Temporarily disable all transitions for instant theme change
    setIsChangingTheme(true)
    document.body.classList.add('theme-changing')
    
    // Use flushSync to ensure all components update simultaneously
    flushSync(() => {
      setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')
    })
    
    // Re-enable transitions after a frame
    requestAnimationFrame(() => {
      document.body.classList.remove('theme-changing')
      setIsChangingTheme(false)
    })
  }

  const setCurrentColorSync = (color: BrandColor) => {
    // Temporarily disable all transitions for instant color change
    setIsChangingTheme(true)
    document.body.classList.add('theme-changing')
    
    // Use flushSync to ensure all components update simultaneously when color changes
    flushSync(() => {
      setCurrentColor(color)
    })
    
    // Re-enable transitions after a frame
    requestAnimationFrame(() => {
      document.body.classList.remove('theme-changing')
      setIsChangingTheme(false)
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
    return themeMode === 'dark' ? '#ffffff' : '#000000' // white : black
  }

  const getBgColor = (): string => {
    return themeMode === 'dark' ? '#1A1D21' : '#ffffff' // brand-dark : pure white
  }

  const getSurfaceColor = (): string => {
    return themeMode === 'dark' ? '#222529' : '#fafafa' // brand-medium : brand-light
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

  // Calendar-specific color functions
  const getCalendarInMonthColor = (): string => {
    return themeMode === 'dark' ? '#1A1D21' : '#ffffff' // brand-dark : pure white
  }

  const getCalendarOutMonthColor = (): string => {
    return themeMode === 'dark' ? '#222529' : '#fafafa' // brand-medium : brand-light
  }

  // Hover color function that calculates the exact resulting color to match across themes
  const getHoverColor = (): string => {
    const brandColor = getColorHex()
    
    // For dark mode, we want the nice light teal effect (brand color over dark background)
    // For light mode, we calculate what solid color would give the same visual result
    if (themeMode === 'dark') {
      // Use transparency on dark background (original behavior)
      return `${brandColor}40` // 25% opacity over dark background
    } else {
      // Calculate the exact RGB that would result from 25% brand color over white
      // This gives us the same visual color as the dark mode hover, but as a solid color
      const hex = brandColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      // Blend 25% brand color with 75% white (255,255,255)
      const blendedR = Math.round(r * 0.25 + 255 * 0.75)
      const blendedG = Math.round(g * 0.25 + 255 * 0.75)
      const blendedB = Math.round(b * 0.25 + 255 * 0.75)
      
      return `#${blendedR.toString(16).padStart(2, '0')}${blendedG.toString(16).padStart(2, '0')}${blendedB.toString(16).padStart(2, '0')}`
    }
  }

  // Get contrasting text color for today highlights - opposite of theme
  const getTodayTextColor = (): string => {
    return themeMode === 'dark' ? '#1A1D21' : '#ffffff' // brand-black : brand-white
  }

  const value = useMemo(() => ({
    currentColor,
    setCurrentColor: setCurrentColorSync, // Use the synchronous version
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
  }), [currentColor, themeMode])

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
