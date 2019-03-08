'use strict'

import Vue from 'vue'
import App from './App'

const vueAppElement = document.querySelector('#vue-app')

window.vueApp = new Vue({
  el: vueAppElement || document.body,
  data: {},
  components: { App },
  template: '<App />',
  created () {
    console.warn('Vue started')
  }
})
