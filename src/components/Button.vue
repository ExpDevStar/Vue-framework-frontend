<template>
  <a
    :class="[
      $style.btn,
      {
        [$style.btn_disabled]: disabled,
        [$style.btn_big]: big,
        [$style.btn_small]: small,

        [$style.btn_primary]: primary,
        [$style.btn_default]: !primary,
      }
    ]"
    :href="href"
    @click="buttonAction"
  >
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    href: String,
    size: String,
    primary: Boolean,
    disabled: Boolean
  },
  methods: {
    buttonAction (event) {
      if (!this.href) {
        event.preventDefault()
      }
      this.$emit('clicked', event)
    }
  },
  computed: {
    big () {
      return this.size === 'big'
    },
    small () {
      return !this.big
    }
  }
}
</script>

<style scoped module lang="scss">
@import "../styles/base.scss";

.btn {
  display: inline-block;
  text-decoration: none;
  user-select: none;
  text-align: center;
  cursor: pointer;

  &_big {
    @include fontSize3();
    border-radius: $border-radius;
    padding: $padding-base / 2 $padding-base;
  }

  &_small {
    @include fontSize3();
    border-radius: $border-radius / 2;
    padding: $padding-base / 2 $padding-base;
  }

  &_primary {
    color: $color-text-contrast;
    background: $color-primary;

    &:hover {
      background: $color-primary-hover;
      color: $color-text-contrast;
    }

    &:active {
      background: $color-primary-active;
      color: $color-text-contrast;
    }
  }

  &_disabled {
    pointer-events: none;
    background: $color-primary-disabled;
    cursor: not-allowed;
  }

  &_default {
    color: $color-text;
    background: $color-bg-secondary;

    &:hover {
      background: $color-bg-secondary-hover;
      color: $color-text;
    }

    &:active {
      background: $color-bg-secondary-active;
      color: $color-text;
    }
  }
}
</style>
