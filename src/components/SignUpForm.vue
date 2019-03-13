<template>
  <form
    :class="[$style.recover_form]"
    data-vv-scope="signupform"
    @submit.prevent="onFormSubmit"
    autocomplete="off"
  >
    <div :class="[$style.header]">
      Регистрация нового пользователя
    </div>
    <InputText
      title="Логин"
      required
      v-model="loginInput"
      placeholder="i.ivanov"
      name="login"
      type="text"
      :class="[$style.input]"
      v-validate="'required|min:5|udashdigiten'"
      data-vv-as="«Логин»"
      :error="errors.first('signupform.login')"
    />
    <InputText
      ref="password"
      title="Пароль"
      required
      v-model="passwordInput"
      placeholder="Пароль"
      name="password"
      type="password"
      :class="[$style.input]"
      v-validate="'required|min:8'"
      data-vv-as="«Пароль»"
      :error="errors.first('signupform.password')"
    />
    <InputText
      title="Повторите пароль"
      required
      v-model="repasswordInput"
      placeholder="Пароль"
      name="repassword"
      type="password"
      :class="[$style.input]"
      v-validate="'required|min:8|confirmed:password'"
      data-vv-as="«Подтверждение пароля»"
      :error="displayConfirnationError ? errors.first('signupform.repassword') : ''"
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
      :error="errors.first('signupform.email')"
    />
    <InputText
      title="Фамилия"
      required
      v-model="surnameInput"
      placeholder="Иванов"
      name="surname"
      type="text"
      :class="[$style.input]"
      v-validate="'required|alpha:ru'"
      data-vv-as="«Фамилия»"
      :error="errors.first('signupform.surname')"
    />
    <InputText
      title="Имя"
      required
      v-model="nameInput"
      placeholder="Иван"
      name="name"
      type="text"
      :class="[$style.input]"
      v-validate="'required|alpha:ru'"
      data-vv-as="«Имя»"
      :error="errors.first('signupform.name')"
    />
    <InputText
      title="Отчество"
      required
      v-model="secondnameInput"
      placeholder="Иванович"
      name="secondname"
      type="text"
      :class="[$style.input]"
      v-validate="'required|alpha:ru'"
      data-vv-as="«Отчество»"
      :error="errors.first('signupform.secondname')"
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
            <template v-if="process">Регистрируем...</template>
            <template v-else>Зарегистрироваться</template>
          </Button>
        </div>
        <div :class="[$style.table__cell, $style.table__cell_wide]">
          <div :class="[$style.error]" v-if="responseError">
            {{ responseError }}
          </div>
          <div :class="[$style.success]" v-if="success">
            Вы успешно зарегистрированы. <br>
            Теперь вы можете
            <router-link
              tag="a"
              to="/"
              :class="[$style.success__link]"
            >
              авторизоваться
            </router-link>
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
      passwordInput: '',
      repasswordInput: '',
      surnameInput: '',
      nameInput: '',
      secondnameInput: '',
      readyRecover: false,
      process: false,
      responseError: '',
      success: false,
      captcha: '',
      displayConfirnationError: false,
      errorsList: {
        custom: {
          login: {
            udashdigiten: field => 'Поле ' + field + ' должно содержать латинские символы, которые могут разделяться точкой и знаком нижнего подчеркивания'
          }
        }
      }
    }
  },
  watch: {
    loginInput () {
      this.onChange()
    },
    emailInput () {
      this.onChange()
    },
    passwordInput () {
      this.onChange()
      this.$nextTick(() => {
        this.$validator.validate('signupform.repassword')
      })
    },
    repasswordInput () {
      this.displayConfirnationError = true
      this.onChange()
    },
    surnameInput () {
      this.onChange()
    },
    nameInput () {
      this.onChange()
    },
    secondnameInput () {
      this.onChange()
    },
    captcha () {
      this.onChange()
    }
  },
  methods: {
    ...mapActions('user', [
      'signup'
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
        .validateAll('signupform', {
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
        this.signup({
          login: this.loginInput,
          email: this.emailInput,
          password: this.passwordInput,
          name: this.nameInput,
          surname: this.surnameInput,
          secondname: this.secondnameInput,
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
  },
  mounted () {
    this.$validator.localize('ru', this.errorsList)
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";
@import "../styles/transitions.scss";

.recover_form {
  max-width: $size-grid * 25;
  margin: $margin-base auto;
  padding: 0 $padding-base;
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

    &_wide {
      width: 100%;
    }
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

  &__link {
    @include fontSize2();
    text-decoration: none;
    border-bottom: 1px dashed $color-success;

    &:hover {
      border-bottom: 1px solid $color-success;
    }
  }
}

.input, .captcha {
  margin-bottom: $x4;
}
</style>
