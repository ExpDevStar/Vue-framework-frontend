<template>
  <div :class="[$style.wrapper, {
    [$style.wrapper_even]: !even
  }]">
    <div :class="[$style.header]">
      {{ data.header }}
    </div>
    <div :class="[$style.content]" v-html="data.text"></div>
    <div :class="[$style.meta]">
      <div :class="[$style.author]">{{ data.author }}</div>,
      <div :class="[$style.date]">{{ date }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    even: Boolean,
    data: Object
  },
  computed: {
    date () {
      return new Date(this.data.date).toLocaleDateString()
    }
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
  padding: $padding-base;
  background: $color-light;
  border-radius: $border-radius;
  margin-bottom: $margin-base;

  &_even {
  }
}

.header {
  @include fontSize6();
  font-weight: bold;
  border-bottom: 1px solid $color-bg-secondary;
}

.content {
  @include fontSize3();

  h2 {
    @include fontSize4();
    font-weight: bold;
  }

  b {
    white-space: nowrap;
  }
}

.meta {
  border-top: 1px solid $color-bg-secondary;
  padding-top: $padding-base / 2;
  color: $color-text-meta;

  .author, .date {
    display: inline-block;
  }
}
</style>
