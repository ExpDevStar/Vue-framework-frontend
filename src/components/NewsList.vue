<template>
  <div :class="[$style.wrapper]">
    <div :class="[$style.header]">Последние новости и объявления</div>
    <div :class="[$style.news]" v-if="getLast.status">
      <NewsListItem
        v-for="(item, index) in getLast.list"
        :key="index"
        :even="!!(index % 2)"
        :data="item"
      />
    </div>
    <Preloader v-else-if="!getLast.errid" />
    <div v-else :class="[$style.loading_error]"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import NewsListItem from './NewsListItem'
import Preloader from './Preloader'

export default {
  components: {
    NewsListItem,
    Preloader
  },
  computed: {
    ...mapGetters('news', [
      'getLast'
    ])
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
}

.header {
  @include fontHeader();
  padding: $padding-base 0;
}

.news {
}
</style>
