export const addDays = (date: Date, amount: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

export const addMonths = (date: Date, amount: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + amount)
  return result
}

export const subMonths = (date: Date, amount: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() - amount)
  return result
}

export const startOfMonth = (date: Date): Date => {
  const result = new Date(date)
  result.setDate(1)
  result.setHours(0, 0, 0, 0)
  return result
}

export const endOfMonth = (date: Date): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1)
  result.setDate(0)
  result.setHours(23, 59, 59, 999)
  return result
}

export const startOfWeek = (date: Date): Date => {
  const result = new Date(date)
  const day = result.getDay()
  result.setDate(result.getDate() - day)
  result.setHours(0, 0, 0, 0)
  return result
}

export const endOfWeek = (date: Date): Date => {
  const result = new Date(date)
  const day = result.getDay()
  result.setDate(result.getDate() + (6 - day))
  result.setHours(23, 59, 59, 999)
  return result
}

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  )
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export const format = (date: Date, formatStr: string): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  if (formatStr === 'd') {
    return date.getDate().toString()
  }
  if (formatStr === 'MMMM') {
    return months[date.getMonth()]
  }
  if (formatStr === 'yyyy') {
    return date.getFullYear().toString()
  }
  if (formatStr === 'MMMM yyyy') {
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }
  if (formatStr === 'EEEE') {
    return days[date.getDay()]
  }
  return date.toDateString()
}

export const getWeekRange = (date: Date, isWorkWeek: boolean = false): string => {
  const start = isWorkWeek ? addDays(startOfWeek(date), 1) : startOfWeek(date)
  const end = isWorkWeek ? addDays(start, 4) : addDays(start, 6)
  
  const startMonth = format(start, 'MMMM yyyy').split(' ')[0]
  const endMonth = format(end, 'MMMM yyyy').split(' ')[0]
  const year = format(end, 'MMMM yyyy').split(' ')[1]
  
  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${year}`
  } else {
    return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${year}`
  }
}

export const getDayRange = (date: Date): string => {
  const dayName = format(date, 'EEEE')
  const monthYear = format(date, 'MMMM yyyy')
  return `${dayName}, ${monthYear.split(' ')[0]} ${date.getDate()}, ${monthYear.split(' ')[1]}`
}
