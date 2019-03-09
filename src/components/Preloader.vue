<template>
  <img src="/static/preloader.svg" :class="$style.preloader" />
</template>

<script>
export default {
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.preloader {
  height: $size-preloader;
  width: $size-preloader;
}
</style>
