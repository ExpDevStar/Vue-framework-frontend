<template>
  <div :class="[$style.wrapper]">
    <Welcome v-if="!loggedin" />
    <div :class="[$style.content]">
      <NewsList />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Welcome from '../components/Welcome'
import NewsList from '../components/NewsList'

export default {
  components: {
    Welcome,
    NewsList
  },
  methods: {
  },
  computed: {
    ...mapGetters('user', [
      'loggedin'
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
</style>
