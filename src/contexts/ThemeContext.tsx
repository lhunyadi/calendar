import React, { createContext, useContext, useState, useMemo } from 'react'
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

  const colorOptions: BrandColor[] = [
    'brand-blue',
    'brand-yellow', 
    'brand-green',
    'brand-red'
  ]

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')
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

  // Hover color function that uses a consistent light blue across all themes
  const getHoverColor = (): string => {
    // Use a consistent light blue hover color regardless of theme or brand color
    return '#36C5F030' // Light blue with 30 opacity - matches the blue from screenshot
  }

  // Get contrasting text color for today highlights - opposite of theme
  const getTodayTextColor = (): string => {
    return themeMode === 'dark' ? '#1A1D21' : '#ffffff' // brand-black : brand-white
  }

  const value = useMemo(() => ({
    currentColor,
    setCurrentColor,
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
