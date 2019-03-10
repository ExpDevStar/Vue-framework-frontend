<template>
  <div :class="[$style.wrapper]">
    <PasswordRecoverForm />
  </div>
</template>

<script>
import PasswordRecoverForm from '../components/PasswordRecoverForm'

export default {
  components: {
    PasswordRecoverForm
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
}
</style>
