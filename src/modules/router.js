import Vue from 'vue'
import Router from 'vue-router'
import Managers from '../managers'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Managers.Main
    },
    {
      path: '*',
      component: Managers.NotFound
    }
  ]
})
