import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { format, getWeekRange, getDayRange } from '../../utils/dateUtils'

interface CalendarHeaderProps {
  currentDate: Date
  selectedDate: Date | null
  viewMode: 'Day' | 'Work week' | 'Week' | 'Month'
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  selectedDate,
  viewMode,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const getDisplayTitle = () => {
    switch (viewMode) {
      case 'Day':
        return getDayRange(selectedDate || currentDate)
      case 'Week':
        return getWeekRange(currentDate, false)
      case 'Work week':
        return getWeekRange(currentDate, true)
      case 'Month':
      default:
        return format(currentDate, 'MMMM yyyy')
    }
  }
  return (
    <div className="bg-[#19171D] p-4 flex items-center justify-between font-['Segoe_UI',_system-ui,_sans-serif]">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-white">
          {getDisplayTitle()}
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onToday}
          className="px-3 py-1 bg-[#4A154B] hover:bg-[#611f64] text-white rounded text-sm transition-colors"
        >
          Today
        </button>
        <div className="flex items-center bg-[#222529] rounded overflow-hidden">
          <button
            onClick={onPrevMonth}
            className="p-1.5 hover:bg-[#2C2D30] text-[#D1D2D3] transition-colors"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 hover:bg-[#2C2D30] text-[#D1D2D3] transition-colors"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
