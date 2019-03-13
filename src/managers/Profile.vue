<template>
  <div :class="[$style.wrapper]">
    <div v-if="ready && loggedin" :class="[$style.content]">
      Потом тут будет профиль, пока только ссылка на <router-link tag="a" to="/test/programming">систему выдачи заданий</router-link>
    </div>
    <div :class="[$style.preloader]" v-else>
      <Preloader />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Preloader from '../components/Preloader'

export default {
  components: {
    Preloader
  },
  computed: {
    ...mapGetters('user', [
      'loggedin',
      'ready'
    ]),
    needAuth () {
      return this.ready && !this.loggedin
    }
  },
  watch: {
    needAuth (v) {
      if (v) {
        this.goHome()
      }
    }
  },
  methods: {
    goHome () {
      if (this.needAuth) {
        this.$router.push({ path: '/' })
      }
    }
  },
  mounted () {
    if (this.needAuth) {
      this.goHome()
    }
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
  width: 100%;
}

.content {
  padding: $padding-base * 2;
}

.preloader {
  margin: auto;
  text-align: center;
  padding: $padding-base * 2;
}
</style>
