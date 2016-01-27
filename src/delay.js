export const FACTORS = {
  millis: 1,
  millisecond: 1,
  milliseconds: 1,
  seconds: 1000,
  second: 1000,
  minutes: 1000 * 60,
  minute: 1000 * 60,
  hours: 1000 * 60 * 60,
  hour: 1000 * 60 * 60,
  days: 1000 * 60 * 60 * 24,
  day: 1000 * 60 * 60 * 24
}
const units = Object.keys(FACTORS)

export const translateDelay = (delay) => {
  let translated = 0
  for (let unit of units) {
    const value = delay[unit] || 0
    translated += value * FACTORS[unit]
  }
  return translated
}
