export const zeroPad = (num, places) => {
  let numString = num.toString()
  let zero = places - numString.length + 1
  return Array(+(zero > 0 && zero)).join('0') + num
}
