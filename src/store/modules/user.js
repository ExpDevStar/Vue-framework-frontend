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
  get: state => state.data
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
          login: response.login
        })
      }
      return { ...user }
    }

    return api('user_info', {}, 'GET').then(response => {
      commit('set', apiFormatter(response))
      return response
    })
  },
  login ({ state }, data) {
    return api('user_login', data, 'POST').then(res => {
      if (res.res_code === 'OK') {
        cookies.set('bmstuOlympAuth', res.res_data, { expires: 300 })
      }
      return res
    })
  }
}

const mutations = {
  set (state, data) {
    state.data = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
