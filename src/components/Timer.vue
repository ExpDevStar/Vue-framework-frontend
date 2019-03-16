<template>
  <div :class="[$style.wrapper]">
    Осталось <br> <b>{{ duration - spend | clock('s') }}</b>
  </div>
</template>

<script>
export default {
  data () {
    return {
      spend: this.start
    }
  },
  props: {
    start: Number,
    duration: Number
  },
  methods: {
    tick () {
      setTimeout(() => {
        if (this.spend >= this.duration - 1) {
          this.$emit('finished')
        } else {
          this.spend++
          this.tick()
        }
      }, 1000)
    }
  },
  mounted () {
    this.tick()
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
  @include fontSize4();
  white-space: nowrap;
  padding: $padding-base;
  min-width: 320px;
}
</style>
