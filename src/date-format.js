import { zeroPad } from './util'
import { getYear, getMonth, getDay } from './date'
import { yesterday, sameDay } from './date'
import { minutesElapsedSince } from './date'

export const FORMAT = {
  EXACT: 'EXACT',
  ELAPSED: 'ELAPSED'
}

export const displayDate = (date, format) => {
  const verbose = format === FORMAT.ELAPSED

  const year = getYear(date).toString()
  const month = zeroPad(getMonth(date), 2)
  const day = zeroPad(getDay(date), 2)

  const now = new Date()

  let dateString

  if (verbose && sameDay(date, now)) {
    dateString = 'сегодня'
  } else if (verbose && sameDay(date, yesterday(now))) {
    dateString = 'вчера'
  } else {
    dateString = `${day}.${month}.${year}`
  }

  return dateString
}

const pluralizeMinutes = minutes => {
  const lastDigit = minutes % 10

  if ((minutes >= 10 && minutes <= 20) || lastDigit == 0 || lastDigit >= 5) return "минут"
  if (lastDigit == 1) return "минута"
  return "минуты"
}

export const displayMinutes = elapsedMinutes => {
  if (elapsedMinutes === 1) {
    return 'минуту назад'
  }
  const minutesString = pluralizeMinutes(elapsedMinutes)
  return `${elapsedMinutes} ${minutesString} назад`
}

export const display = (date, format, options = { shortDates: false }) => {
  const verbose = format === FORMAT.ELAPSED

  if (verbose) {
    const elapsedMinutes = minutesElapsedSince(date)

    if (elapsedMinutes < 60) {
      return displayMinutes(elapsedMinutes)
    }
  }

  const hour = zeroPad(date.getHours(), 2)
  const minute = zeroPad(date.getMinutes(), 2)
  const seconds = zeroPad(date.getSeconds(), 2)

  let dateString = displayDate(date, format)

  dateString = `${dateString} ${hour}:${minute}`

  if (!options.shortDates) {
    dateString = `${dateString}:${seconds}`
  }

  return dateString
}
