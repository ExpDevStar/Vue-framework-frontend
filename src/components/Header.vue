<template>
  <header>
    <router-link tag="a" to="/" :class="[$style.logo__wrapper]">
      <div :class="[$style.logo]">
        <img src="/static/logo.svg" />
      </div>
      <div :class="[$style.title, {[$style.title_loggedin]: loggedin}]">
        <span>ШАГ В БУДУЩЕЕ</span>
        <div :class="[$style.badge]">
          бета
        </div>
      </div>
    </router-link>
    <div :class="[$style.profile]" v-if="ready && loggedin">
      <router-link tag="a" to="/test/programming">#{{ uid }} {{ name }}</router-link>
      |
      <a :class="[$style.logout]" @click="onLogoutClick">Выход</a>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', [
      'get',
      'ready',
      'loggedin'
    ]),
    name () {
      if (this.ready && this.loggedin) {
        return `${this.get.name} ${this.get.surname}`
      }
      return ''
    },
    uid () {
      if (this.ready && this.loggedin) {
        return this.get.id
      }
      return ''
    }
  },
  methods: {
    ...mapActions('user', [
      'logout'
    ]),
    onLogoutClick () {
      this.logout()
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style module lang="scss">
@import '../styles/base.scss';

header {
  height: $size-header;
  line-height: $size-header;
  background: $color-bg;
  position: relative;
  vertical-align: middle;
  border-bottom: 10px solid $color-bg-ld;
  box-shadow: 2px 5px 14px -10px rgb(50, 50, 50);
  padding: 0 $padding-base * 2;
}

.logo__wrapper {
  display: inline-block;
  outline: none;
  text-decoration: none;
}

.logo {
  position: absolute;
  top: 0;
  padding: 0 $margin-base / 2;
  background: $color-bg-secondary;
  @include borderRadiusBottom();

  & > img {
    display: block;
    width: $size-logo-w;
    margin: $margin-base / 4 0 $margin-base / 2 0;
  }
}

.title {
  display: inline-block;
  margin-left: $size-logo-w + $padding-base * 2;
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

.profile {
  float: right;
  line-height: $size-header;
  white-space: nowrap;
  padding: 0 $padding-base;

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.logout {
  color: $color-bg-secondary;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
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

    &_loggedin {
      display: none;
    }
  }
}
</style>
