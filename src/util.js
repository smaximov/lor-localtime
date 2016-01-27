export const zeroPad = (num, places) => {
  const numString = num.toString()
  const zero = places - numString.length + 1
  return Array(+(zero > 0 && zero)).join('0') + num
}
