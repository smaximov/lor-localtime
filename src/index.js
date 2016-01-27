import { elapsed } from './date'
import { display, FORMAT } from './date-format'
import { after, schedule } from './schedule'

const setLocalTime = (elem) => {
  const time = elem.dateTime
  const date = new Date(time)

  const update = (date) => elem.textContent = display(date, FORMAT.ELAPSED)

  const scheduleUpdateDays = () =>
	schedule(update, {stop: after({days: 2}), every: {hours: 1}}, date)
  const scheduleUpdateMinutes = () =>
	schedule(update, {stop: after({hours: 1}), every: {seconds: 10}}, date)

  update(date)
  elem.setAttribute('data-tooltip', display(date, FORMAT.EXACT))

  if (!elapsed(date, {hours: 1})) {
    scheduleUpdateMinutes().then(scheduleUpdateDays)
  } else if (!elapsed(date, {days: 2})) {
    scheduleUpdateDays();
  }
}

const css = `
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

const style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = css
document.body.appendChild(style)

for (let time of document.querySelectorAll('time')) {
  setLocalTime(time)
}
