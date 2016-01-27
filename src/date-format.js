import { zeroPad } from './util'
import { getYear, getMonth, getDay } from './date'
import { yesterday, sameDay } from './date'
import { minutesElapsedSince } from './date'

const formatDate = (date, verbose=true) => {
  let year = getYear(date).toString()
  let month = zeroPad(getMonth(date), 2)
  let day = zeroPad(getDay(date), 2)

  let now = new Date()

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
  let lastDigit = minutes % 10

  if ((minutes >= 10 && minutes <= 20) || lastDigit == 0 || lastDigit >= 5) return "минут"
  if (lastDigit == 1) return "минута"
  return "минуты"
}

const formatElapsedMinutes = elapsedMinutes => {
  if (elapsedMinutes === 1) {
    return 'минуту назад'
  }
  let minutesString = pluralizeMinutes(elapsedMinutes)
  return `${elapsedMinutes} ${minutesString} назад`
}

export const formatDateTime = (date, verbose=true) => {
  if (verbose) {
    let elapsedMinutes = minutesElapsedSince(date)

    if (elapsedMinutes < 60) {
      return formatElapsedMinutes(elapsedMinutes)
    }
  }

  let hour = zeroPad(date.getHours(), 2)
  let minute = zeroPad(date.getMinutes(), 2)
  let seconds = zeroPad(date.getSeconds(), 2)

  let dateString = formatDate(date, verbose=verbose)

  return `${dateString} ${hour}:${minute}:${seconds}`
}
