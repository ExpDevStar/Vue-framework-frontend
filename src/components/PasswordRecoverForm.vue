<template>
  <form
    :class="[$style.recover_form]"
    data-vv-scope="recoverform"
    @submit.prevent="onFormSubmit"
    autocomplete="off"
  >
    <div :class="[$style.header]">
      Сброс пароля
      <span>Новый пароль придет на почту, указанную при регистрации</span>
    </div>
    <InputText
      title="Логин"
      required
      v-model="loginInput"
      placeholder="i.ivanov"
      name="login"
      type="text"
      :class="[$style.input]"
      v-validate="'required'"
    />
    <InputText
      title="Электронная почта"
      required
      v-model="emailInput"
      placeholder="ivanov@domain.ru"
      name="email"
      type="email"
      :class="[$style.input]"
      v-validate="'email|required'"
      data-vv-as="«Электронная почта»"
      :error="errors.first('recoverform.email')"
    />
    <vue-recaptcha
      ref="captcha"
      :sitekey="$root.rsk"
      @verify="onCaptchaVerify"
      @expired="onCaptchaExpired"
      :class="[$style.captcha]"
    ></vue-recaptcha>
    <div :class="[$style.table]">
      <div :class="[$style.table__row]">
        <div :class="[$style.table__cell]">
          <Button
            :disabled="!readyRecover || process"
            @clicked="onFormSubmit"
          >
            <template v-if="process">Идёт сброс пароля...</template>
            <template v-else>Сбросить пароль</template>
          </Button>
        </div>
        <div :class="[$style.table__cell]">
          <div :class="[$style.error]" v-if="responseError">
            {{ responseError }}
          </div>
          <div :class="[$style.success]" v-if="success">
            Пароль успешно сброшен. Проверьте указанную почту.
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'

import VueRecaptcha from 'vue-recaptcha'

import InputText from './InputText'
import Button from './Button'

export default {
  inject: ['$validator'],
  components: {
    VueRecaptcha,
    InputText,
    Button
  },
  data () {
    return {
      loginInput: '',
      emailInput: '',
      readyRecover: false,
      process: false,
      responseError: '',
      success: false,
      captcha: ''
    }
  },
  watch: {
    loginInput () {
      this.onChange()
    },
    emailInput () {
      this.onChange()
    },
    captcha () {
      this.onChange()
    }
  },
  methods: {
    ...mapActions('user', [
      'recover'
    ]),
    onCaptchaVerify (response) {
      this.captcha = response
    },
    onCaptchaExpired () {
      this.$refs.captcha.reset()
      this.captcha = ''
    },
    onChange () {
      this.$validator
        .validateAll('recoverform', {
          silent: true
        })
        .then(valid => {
          this.readyRecover = valid && !this.process && this.captcha
        })
    },
    onFormSubmit () {
      if (this.readyRecover) {
        this.success = false
        this.process = true
        this.responseError = ''
        this.recover({
          login: this.loginInput,
          email: this.emailInput,
          'g-recaptcha-response': this.captcha
        })
          .then(response => {
            this.process = false
            this.onCaptchaExpired()
            if (response.res_code === 'OK') {
              this.success = true
            } else {
              this.responseError = response.res_msg
            }
          })
      }
    }
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";
@import "../styles/transitions.scss";

.recover_form {
  max-width: $size-grid * 25;
  margin: $margin-base auto;
}

.header {
  @include fontHeader();

  span {
    display: block;
    text-transform: lowercase;
    @include fontSize2();
  }

  margin-bottom: $x6;
}

.table {
  display: table;
  width: 100%;

  &__row {
    display: table-row;
  }

  &__cell {
    display: table-cell;
    vertical-align: middle;
  }
}

.error, .success {
  margin-left: $margin-base;
  @include fontSize2();
}

.error {
  color: $color-error;
}

.success {
  color: $color-success;
}

.input, .captcha {
  margin-bottom: $x4;
}
</style>
