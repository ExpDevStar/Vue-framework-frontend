<template>
  <div :class="[$style.wrapper]">
    <div v-if="ready">
      <Welcome v-if="!loggedin" />
    </div>
    <div v-else :class="[$style.preloader]">
      <Preloader />
    </div>
    <div :class="[$style.content]">
      <NewsList />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Welcome from '../components/Welcome'
import NewsList from '../components/NewsList'
import Preloader from '../components/Preloader'

export default {
  components: {
    Welcome,
    NewsList,
    Preloader
  },
  methods: {
  },
  computed: {
    ...mapGetters('user', [
      'loggedin',
      'ready'
    ])
  },
  mounted () {
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
}

.content {
  padding: 0 $padding-base * 2;
}

.preloader {
  margin: auto;
  text-align: center;
  padding: $padding-base * 2;
}
</style>
