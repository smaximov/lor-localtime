export const FACTORS = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  days: 1000 * 60 * 60 * 24
}
const units = Object.keys(FACTORS)

export const translateDelay = (delay) => {
  let translated = 0
  for (let unit of units) {
    let value = delay[unit] || 0
    translated += value * FACTORS[unit]
  }
  return translated
}
