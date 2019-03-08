'use strict'

import Vue from 'vue'
import App from './App.vue'

window.vueApp = new Vue({
  el: window.vueAppElement,
  data: {},
  components: { App },
  template: '<App />',
  created () {
    console.warn('Vue started')
  }
})
