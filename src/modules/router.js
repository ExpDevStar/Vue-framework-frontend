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
      path: '/signup',
      component: Managers.SignUp
    },
    {
      path: '/recover',
      component: Managers.RecoverPassword
    },
    {
      path: '/profile',
      component: Managers.Profile
    },
    {
      path: '/test/:category',
      component: Managers.Test,
      props: route => ({
        task: Number(route.query.task) || 1,
        category: route.params.category
      })
    },
    {
      path: '*',
      component: Managers.NotFound
    }
  ]
})
