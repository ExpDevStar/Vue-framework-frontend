<template>
  <ul :class="[$style.wrapper]" v-if="ready">
    <li
      v-for="(t, i) in tasks"
      :key="i"
      :class="{[$style.active]: i + 1 === active}"
      @click="$emit('choosen', i + 1)"
    >
      Задание №{{ i + 1 }}
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    category: String,
    active: Number
  },
  computed: {
    ...mapGetters('tests', [
      'get'
    ]),
    ready () {
      return this.get[this.category] && this.get[this.category].status
    },
    tasks () {
      return this.get[this.category].data.list
    }
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
  list-style: none;
  margin: 0;
  padding: 0;
  white-space: nowrap;

  li {
    @include fontSize4();
    color: $color-text;
    padding: $padding-base / 2 $padding-base;
    margin-bottom: $margin-base / 2;
    cursor: pointer;
    border-radius: $border-radius;

    &:hover {
      background: $color-light;
    }
  }
}

.active {
  color: $color-text;
  background: $color-selector;
}

</style>
