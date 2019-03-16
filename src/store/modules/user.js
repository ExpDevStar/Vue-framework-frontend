import api from '../../modules/api'
import cookies from '../../modules/cookies'

const state = {
  status: false,
  errid: false,
  data: {
  }
}

const getters = {
  loggedin: state => !!(state.data && state.data.id),
  get: state => state.data,
  ready: state => state.status
}

const actions = {
  requestData ({ state, commit }) {
    const apiFormatter = res => {
      let user = {}
      if (res.res_code === 'OK') {
        const response = res.res_data
        user = Object.assign({}, {
          id: response.id,
          name: response.imia,
          surname: response.familia,
          email: response.email,
          login: response.login,
          test_available: !!(response.secs && response.secs.length)
        })
      }
      return { ...user }
    }

    return api('user_info', {}, 'GET')
      .then(response => {
        commit('set', apiFormatter(response))
        return response
      })
  },
  login ({ state }, data) {
    return api('user_login', data, 'POST').then(res => {
      if (res.res_code === 'OK') {
        cookies.set('bmstuOlympAuth', res.res_data, { expires: 3600 })
      }
      return res
    })
  },
  logout ({ state, commit }, data) {
    cookies.remove('bmstuOlympAuth')
    commit('set', {})
  },
  signup ({ state }, data) {
    const formatedData = {
      email: data.email,
      familia: data.surname,
      'g-recaptcha-response': data['g-recaptcha-response'],
      imia: data.name,
      login: data.login,
      otchestvo: data.secondname,
      password: data.password
    }
    return api('user_signup', formatedData, 'POST')
  },
  recover ({ state }, data) {
    return api('user_recover_password', data, 'POST')
  }
}

const mutations = {
  set (state, data) {
    state.data = data
    state.status = true
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
