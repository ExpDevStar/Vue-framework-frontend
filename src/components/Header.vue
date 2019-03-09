<template>
  <header>
    <router-link tag="a" to="/" :class="[$style.logo__wrapper]">
      <div :class="[$style.logo]">
        <img src="/static/logo.svg" />
      </div>
      <div :class="[$style.title]">
        <span>ШАГ В БУДУЩЕЕ</span>
        <div :class="[$style.badge]">
          бета
        </div>
      </div>
    </router-link>
  </header>
</template>

<script>
export default {

}
</script>

<style module lang="scss">
@import '../styles/base.scss';

header {
  height: $size-header;
  background: $color-bg;
  position: relative;
  vertical-align: middle;
  border-bottom: 10px solid $color-bg-ld;
  box-shadow: 2px 5px 14px -10px rgb(50, 50, 50);
}

.logo__wrapper {
  display: inline-block;
  outline: none;
  text-decoration: none;
}

.logo {
  position: absolute;
  top: 0;
  margin: 0 $padding-base * 2;
  padding: 0 $margin-base / 2;
  background: $color-bg-secondary;
  @include borderRadiusBottom();

  & > img {
    width: $size-logo-w;
    margin: $margin-base / 4 0;
  }
}

.title {
  display: inline-block;
  margin-left: $size-logo-w + $padding-base * 4;
  @include fontHeader();
  color: $color-header-text;
  white-space: nowrap;

  & > * {
    vertical-align: middle;
  }
}

.badge {
  display: inline-block;
  @include fontBadge();
  background: $color-bg-secondary;
  padding: $padding-badge;
  border-radius: $border-radius;
  color: $color-text-contrast;
  margin-left: $margin-base / 2;
}

@media screen and (max-width: 800px) {
  .logo {
    position: relative;
    vertical-align: middle;
    top: 0;
    margin: 0;
    padding: 0 $margin-base / 2;
    background: none;
    display: inline-block;
    @include borderRadiusBottom();

    & > img {
      width: $size-logo-w / 2;
    }
  }

  .title {
    margin: 0;
    vertical-align: middle;
  }
}
</style>
