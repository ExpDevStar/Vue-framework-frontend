import 'whatwg-fetch'

const availableMethods = {
  'user_info': '/api/personal/info',
  'user_login': '/api/personal/login',
  'user_recover_password': '/api/personal/recover',
  'user_signup': '/api/personal/register'
}

let requestSettings = {
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  mode: 'cors'
}

function toParams (params) {
  let pairs = []
  let proc
  (proc = function (object, prefix) {
    let el, i, key, value, _results
    if (object == null) object = params
    if (prefix == null) prefix = null
    _results = []
    for (key in object) {
      value = object[key]
      if (value instanceof Array) {
        _results.push((function () {
          let _len
          let _results2 = []
          for (i = 0, _len = value.length; i < _len; i++) {
            el = value[i]
            _results2.push(proc(el, prefix != null ? `${prefix}[${key}][]` : `${key}[]`))
          }
          return _results2
        })())
      } else if (value instanceof Object) {
        if (prefix != null) {
          prefix += `[${key}]`
        } else {
          prefix = key
        }
        _results.push(proc(value, prefix))
      } else {
        _results.push(pairs.push(prefix != null ? `${prefix}[${key}]=${value}` : `${key}=${value}`))
      }
    }
    return _results
  })()
  return pairs.join('&')
}

export default function (method, data, crud) {
  let body
  let params

  let url = availableMethods[method] || null
  if (!url) {
    throw new Error('Unknown api method!')
  }

  switch (crud) {
    case 'POST':
      body = JSON.stringify(data)
      break
    case 'GET':
      params = toParams(data)
      break
    case 'DELETE':
      url += `/${data.id}`
      break

    default:
      break
  }

  return fetch(url + (params ? `?${params}` : ''), Object.assign({
    method: crud,
    body
  }, requestSettings))
    .then(
      response => response.json()
    )
}
