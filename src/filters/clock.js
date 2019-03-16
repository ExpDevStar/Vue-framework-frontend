import plural from './plural'

export default function (time, grad) {
  let d = 0
  let h = 0
  let m = 0
  let s = time
  if (s > 60) {
    m = Math.floor(s / 60)
    s %= 60
    if (m > 60) {
      h = Math.floor(m / 60)
      m %= 60
      if (h > 24) {
        d = Math.floor(h / 24)
        h %= 24
      }
    }
  }
  const gradD = grad !== 'd'
  const gradH = gradD && grad !== 'h'
  const gradM = gradH && grad !== 'm'
  const useD = d
  const useH = (d || h) && gradD
  const useM = (d || h || m) && gradH
  const useS = (d || h || m || s) && gradM

  let result = ''
  result += useD ? `${d} ${plural(d, 'infday')} ` : ''
  result += useH ? `${h} ${plural(h, 'infhour')} ` : ''
  result += useM ? `${m} ${plural(m, 'infminute')} ` : ''
  result += useS ? `${s} ${plural(s, 'infsecond')}` : ''

  return result
}
