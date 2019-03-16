<template>
  <div :class="[$style.wrapper]">
    <SignUpForm />
  </div>
</template>

<script>
import SignUpForm from '../components/SignUpForm.vue'

export default {
  components: {
    SignUpForm
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
}
</style>
