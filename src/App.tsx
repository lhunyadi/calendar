import { useState } from 'react'
import { Calendar } from './components/Calendar/Calendar'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

const AppContent = () => {
  const { getBgColor, getTextColor } = useTheme()
  
  // Sample events data
  const [events] = useState([
    {
      id: 1,
      title: 'Team standup',
      date: new Date(2023, new Date().getMonth(), 15),
      color: '#36C5F0',
    },
    {
      id: 2,
      title: 'Product review',
      date: new Date(2023, new Date().getMonth(), 18),
      color: '#2EB67D',
    },
    {
      id: 3,
      title: 'Client meeting',
      date: new Date(2023, new Date().getMonth(), 22),
      color: '#ECB22E',
    },
    {
      id: 4,
      title: 'Design workshop',
      date: new Date(2023, new Date().getMonth(), 10),
      color: '#E01E5A',
    },
    {
      id: 5,
      title: 'Release planning',
      date: new Date(2023, new Date().getMonth(), new Date().getDate()),
      color: '#2EB67D',
    },
  ])

  return (
    <div 
      className="w-full h-screen font-['Segoe_UI',_system-ui,_sans-serif]"
      style={{ 
        backgroundColor: getBgColor(),
        color: getTextColor()
      }}
    >
      <div className="w-full h-full">
        <Calendar events={events} />
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
