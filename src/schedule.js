import { translateDelay } from './delay'
import { elapsed } from './date'

export const after = (delay) =>
  (date) => elapsed(date, delay)

export const schedule = (action, options, ...args) => {
  options = options || {};

  return new Promise((resolve, reject) => {
    if (!options.every) return reject(new Error('options.every not set'))
    if (!options.stop) return reject(new Error('options.stop not set'))

    if (typeof options.stop !== 'function') return reject(new Error('options.stop is not a function'));
    if (typeof options.every !== 'object') return reject(new Error('options.every is not an object'));

    let interval;

    interval = setInterval(() => {
      const result = action(...args)
      if (options.stop(...args)) {
	clearInterval(interval)
	return resolve(result)
      }
    }, translateDelay(options.every))
  })
}
