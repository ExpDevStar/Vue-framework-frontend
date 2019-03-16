/**
 * Since we don't have news service on backend yet, here is just a stub
 */
import NewsStub from './stubs/news'

const state = {
  data: Object.assign({
    status: true,
    errid: false
  }, NewsStub)
}

const getters = {
  getLast: state => state.data
}

const actions = {
}

const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
