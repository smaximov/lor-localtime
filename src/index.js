let zeroPad = (num, places) => {
  let numString = num.toString()
  let zero = places - numString.length + 1
  return Array(+(zero > 0 && zero)).join('0') + num
}

let getYear = date => date.getFullYear()
let getMonth = date => date.getMonth() + 1
let getDay = date => date.getDate()

let yesterday = date => {
  let newDate = new Date(date)
  newDate.setDate(date.getDate() - 1)
  return newDate
}

let sameDay = (date1, date2) => {
  return (getYear(date1) === getYear(date2)) &&
   (getMonth(date1) === getMonth(date2)) &&
   (getDay(date1) === getDay(date2))
}

let formatDate = (date, verbose=true) => {
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

const MILLIS_PER_MINUTE = 1000 * 60

let minutesElapsedSince = date => {
  let now = new Date()
  let minutesDiff = (now - date) / MILLIS_PER_MINUTE
  let roundingFunction = minutesDiff < 1 ? Math.ceil : Math.floor
  return roundingFunction(minutesDiff)
}

let pluralizeMinutes = minutes => {
  let lastDigit = minutes % 10

  if ((minutes >= 10 && minutes <= 20) || lastDigit == 0 || lastDigit >= 5) return "минут"
  if (lastDigit == 1) return "минута"
  return "минуты"
}

let formatElapsedMinutes = elapsedMinutes => {
  if (elapsedMinutes === 1) {
    return 'минуту назад'
  }
  let minutesString = pluralizeMinutes(elapsedMinutes)
  return `${elapsedMinutes} ${minutesString} назад`
}

let formatDateTime = (date, verbose=true) => {
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

let translateDelay = delay => {
  const FACTORS = {
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24
  }
  const units = Object.keys(FACTORS)
  let translated = 0
  for (let unit of units) {
    let value = delay[unit] || 0
    translated += value * FACTORS[unit]
  }
  return translated
}

let schedule = (action, stopCondition, delay, ...args) => {
  let scheduler = {
    then(action) {
      this.after = action
    }
  }
  scheduler.interval = setInterval(() => {
    action(...args)
    if (stopCondition(...args)) {
      clearInterval(scheduler.interval)
      if (scheduler.after) scheduler.after(...args)
    }
  }, translateDelay(delay))
  return scheduler
}

let updateTime = (elem, date) => {
  elem.textContent = formatDateTime(date, verbose=true)
}

let scheduleUpdateDays = (elem, date) =>
  schedule(updateTime, stopAfter({days: 2}), {hours: 1}, elem, date)

let scheduleUpdateMinutes = (elem, date) =>
  schedule(updateTime, stopAfter({hours: 1}), {seconds: 10}, elem, date)

let timeElapsed = (date, delay) =>
  (new Date() - date) >= translateDelay(delay)

let stopAfter = (delay) =>
  (_elem, date) => timeElapsed(date, delay)

let localizeTimeElement = (elem) => {
  let time = elem.dateTime
  let date = new Date(time)
  updateTime(elem, date)
  elem.setAttribute('data-tooltip', formatDateTime(date, verbose=false))

  if (!timeElapsed(date, {hours: 1})) {
    scheduleUpdateMinutes(elem, date).then(scheduleUpdateDays)
  } else if (!timeElapsed(date, {days: 2})) {
    scheduleUpdateDays(elem, date)
  }
}

let css = `
time[data-tooltip] {
  border-bottom: 2px dotted grey;
  cursor: pointer;
}
time[data-tooltip]:hover {
  position: relative;
}
time[data-tooltip]:hover:after {
  font-size: small;
  content: attr(data-tooltip);
  padding: 0.3em 0.5em;
  color: #333;
  position: absolute;
  left: 2em;
  top: 150%;
  white-space: nowrap;
  z-index: 20;
  border-radius: 0.5em;
  box-shadow: 0px 0px 4px #222;
  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #eeeeee),color-stop(1, #cccccc));
  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);
}
`

let style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = css
document.body.appendChild(style)

for (let time of document.querySelectorAll('time')) {
  localizeTimeElement(time)
}
