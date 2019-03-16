const plurals = {
  second: ['секунду', 'секунды', 'секунд'],
  minute: ['минуту', 'минуты', 'минут'],
  hour: ['час', 'часа', 'часов'],
  day: ['день', 'дня', 'дней'],
  week: ['неделю', 'недели', 'недель'],
  month: ['месяц', 'месяца', 'месяцев'],
  year: ['год', 'года', 'лет'],
  infsecond: ['секунда', 'секунды', 'секунд'],
  infminute: ['минута', 'минуты', 'минут'],
  infhour: ['час', 'часа', 'часов'],
  infday: ['день', 'дня', 'дней'],
  infweek: ['неделя', 'недели', 'недель'],
  infmonth: ['месяц', 'месяца', 'месяцев'],
  infyear: ['год', 'года', 'лет']
}

export default function (sourceValue, pluralKey) {
  let parsedValue = parseFloat(sourceValue, 10)
  let plural = plurals[pluralKey]

  if (!isFinite(parsedValue) || !plural) {
    return String(sourceValue)
  }

  let n = Math.abs(parsedValue)
  n %= 100
  if (n >= 5 && n <= 20) {
    return plural[2]
  }
  n %= 10
  if (n === 1) {
    return plural[0]
  }
  if (n >= 2 && n <= 4) {
    return plural[1]
  }
  return plural[2]
}
