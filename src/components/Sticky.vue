<template>
  <div :class="[
      $style.wrapper,
      {
        [$style.wrapper__native]: isNativeSupport
      },
      {
        [$style.wrapper__relative]: !isNativeSupport
      }
    ]"
    :style="{
      top: isNativeSupport ? offsetTop + 'px' : 'auto'
    }"
    ref="wrapper"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    offsetTop: {
      type: Number,
      default: 20 // $padding-base
    }
  },
  computed: {
    isNativeSupport () {
      const div = document.createElement('div')
      const checkList = ['sticky', '-webkit-sticky']
      const matchValue = 'sticky'

      let i = 0
      let isSupported = false
      while (i < checkList.length && !isSupported) {
        div.style.position = checkList[i]

        if (String(div.style.position).match(matchValue)) {
          isSupported = true
        }
        i++
      }

      return isSupported
    }
  },
  methods: {
    redraw () {
      const element = this.$refs.wrapper
      if (!element) {
        return null
      }
      const parent = element.parentNode
      if (!parent) {
        return null
      }

      const elementClientRect = element.getBoundingClientRect()
      const parentClientRect = parent.getBoundingClientRect()

      const parentTop = parentClientRect.top
      const parentHeight = parentClientRect.height
      const elementHeight = elementClientRect.height

      let top = 0
      if (parentTop < this.offsetTop) {
        top = this.offsetTop + -parentTop
      } else {
        top = 0
      }

      if (elementHeight + top > parentHeight) {
        top = parentHeight - elementHeight
      }

      element.style.top = top + 'px'
    }
  },
  mounted () {
    if (!this.isNativeSupport) {
      window.addEventListener('resize', this.redraw)
      window.addEventListener('scroll', this.redraw)
      this.$nextTick(this.redraw)
    }
  },
  beforeDestroy () {
    if (!this.isNativeSupport) {
      window.removeEventListener('resize', this.redraw)
      window.removeEventListener('scroll', this.redraw)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped module lang="scss">
@import "../styles/base.scss";

.wrapper {
  &__native {
    position: sticky;
  }
  &__relative {
    position: relative;
    top: 0px;
  }
}
</style>
