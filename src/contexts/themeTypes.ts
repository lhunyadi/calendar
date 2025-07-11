export type BrandColor = 'brand-blue' | 'brand-yellow' | 'brand-green' | 'brand-red'
export type ThemeMode = 'dark' | 'light'

export interface ThemeContextType {
  currentColor: BrandColor
  setCurrentColor: (color: BrandColor) => void
  colorOptions: BrandColor[]
  getColorHex: () => string
  themeMode: ThemeMode
  toggleTheme: () => void
  getTextColor: () => string
  getBgColor: () => string
  getSurfaceColor: () => string
  getTextColorClass: () => string
  getBgColorClass: () => string
  getSurfaceColorClass: () => string
  getCalendarInMonthColor: () => string
  getCalendarOutMonthColor: () => string
  getHoverColor: () => string
  getTodayTextColor: () => string
}

export interface ThemeProviderProps {
  children: React.ReactNode
}