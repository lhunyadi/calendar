import { Calendar } from './components/Calendar/Calendar'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

const AppContent = () => {
  const { getBgColor, getTextColor } = useTheme()

  return (
    <div 
      className="w-full h-screen font-['Segoe_UI',_system-ui,_sans-serif]"
      style={{ 
        backgroundColor: getBgColor(),
        color: getTextColor()
      }}
    >
      <div className="w-full h-full">
        <Calendar />
      </div>
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
