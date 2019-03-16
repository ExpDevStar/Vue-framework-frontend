import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import news from './modules/news'
import tests from './modules/tests'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    news,
    tests
  }
})
