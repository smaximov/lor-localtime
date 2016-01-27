import { translateDelay } from './delay'
import { formatDateTime } from './date-format'

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
  elem.textContent = formatDateTime(date, true)
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
  elem.setAttribute('data-tooltip', formatDateTime(date, false))

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
