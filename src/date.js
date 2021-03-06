import { FACTORS, translateDelay } from './delay'

export const getYear = date => date.getFullYear()
export const getMonth = date => date.getMonth() + 1
export const getDay = date => date.getDate()

export const yesterday = date => {
  const newDate = new Date(date)
  newDate.setDate(date.getDate() - 1)
  return newDate
}

export const sameDay = (date1, date2) => {
  return (getYear(date1) === getYear(date2)) &&
    (getMonth(date1) === getMonth(date2)) &&
    (getDay(date1) === getDay(date2))
}

export const minutesElapsedSince = date => {
  const now = new Date()
  const minutesDiff = (now - date) / FACTORS.minutes
  const roundingFunction = minutesDiff < 1 ? Math.ceil : Math.floor
  return roundingFunction(minutesDiff)
}

export const elapsed = (date, delay) =>
  (new Date() - date) >= translateDelay(delay)
