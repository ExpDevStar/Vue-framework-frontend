<template>
  <div :class="[$style.wrapper]">
    <div>
      <Header />
    </div>
    <main>
      <router-view></router-view>
    </main>
    <div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import 'normalize.css'

import Header from './components/Header'
import Footer from './components/Footer'

export default {
  components: {
    Header,
    Footer
  },
  methods: {
    ...mapActions('user', [
      'requestData'
    ])
  },
  mounted () {
    this.requestData()
  }
}
</script>

<style module lang="scss">
@import "./styles/base.scss";

body, html {
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  min-width: 350px;
}

a {
  color: $color-link-secondary;
}

.wrapper {
  display: table;
  height: 100%;
  table-layout: fixed;
  width: 100%;
  box-sizing: border-box;

  & > * {
    display: table-row;

    & > * {
      display: table-cell;
    }
  }
}
</style>
