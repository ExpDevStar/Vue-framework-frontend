function get (name) {
  const matches = document.cookie.match(new RegExp(
    '(?:^| )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^]*)'
  ))
  return matches ? decodeURIComponent(matches[1]) : undefined
}

function set (name, value, options) {
  options = options || {}
  options.domain = '.olymp.bmstu.ru'
  options.secure = false

  let expires = options.expires

  if (typeof expires === 'number' && expires) {
    const d = new Date()
    d.setTime(d.getTime() + expires * 1000)
    expires = options.expires = d
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString()
  }

  value = encodeURIComponent(value)
  let updatedCookie = `${name}=${value}`

  for (var propName in options) {
    updatedCookie += `; ${propName}`
    const propValue = options[propName]
    if (propValue !== true) {
      updatedCookie += `=${propValue}`
    }
  }

  document.cookie = updatedCookie
}

function remove (name) {
  set(name, '', { expires: -1 })
}

export default {
  get,
  set,
  remove
}
