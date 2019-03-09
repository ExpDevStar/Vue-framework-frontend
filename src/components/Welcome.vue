<template>
  <div :class="[$style.wrapper]">
    <div :class="[$style.table]">
      <div :class="[$style.table__row]">
        <div :class="[$style.table__cell, $style.table__cell_main, $style.login__info]">
          <div :class="[$style.header]">
            Для работы с системой необходимо авторизоваться.
          </div>
          <div :class="[$style.description]">
            <p>
              После авторизации будет доступна регистрация на мероприятия <br>
              и просмотр персональных результатов прошедших туров олимпиад.
            </p>
            <p>
              В дни проведения олимпиад в личном кабинете открывается доступ к тестированию.
            </p>
          </div>
        </div>
        <div :class="[$style.table__cell, $style.table__cell_main]">
          <form
            :class="[$style.signin_form]"
            data-vv-scope="loginform"
            @submit.prevent="onFormSubmit"
          >
            <InputText
              v-model="loginInput"
              placeholder="Логин"
              name="login"
              type="text"
              :class="[$style.input]"
              v-validate="'required'"
            />
            <InputText
              v-model="passwordInput"
              placeholder="Пароль"
              name="login"
              type="password"
              :class="[$style.input]"
              v-validate="'required'"
            />
            <div :class="[$style.table]">
              <div :class="[$style.table__row]">
                <div :class="[$style.table__cell]">
                  <Button
                    primary
                    @clicked="onFormSubmit"
                    :disabled="!readyLogin || process"
                  >
                    <template v-if="process">Авторизуемся...</template>
                    <template v-else>Авторизоваться</template>
                  </Button>
                </div>
                <div :class="[$style.table__cell]">
                  <div :class="[$style.auth, error ? $style.auth__error : $style.auth__license]">
                    {{
                      error ||
                      'Авторизуясь в системе, Вы тем самым принимаете положения пользовательского соглашения'
                    }}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import InputText from './InputText'
import Button from './Button'

export default {
  inject: ['$validator'],
  components: {
    InputText,
    Button
  },
  data () {
    return {
      loginInput: '',
      passwordInput: '',
      readyLogin: false,
      process: false,
      error: ''
    }
  },
  watch: {
    loginInput () {
      this.onChange()
    },
    passwordInput () {
      this.onChange()
    }
  },
  methods: {
    ...mapActions('user', [
      'login',
      'requestData'
    ]),
    onChange () {
      this.error = ''
      this.$validator
        .validateAll('loginform', {
          silent: true
        })
        .then(valid => {
          this.readyLogin = valid && !this.process
        })
    },
    onFormSubmit () {
      if (this.readyLogin) {
        this.process = true
        this.login({
          login: this.loginInput,
          password: this.passwordInput
        })
          .then(response => {
            this.process = false
            if (response.res_code === 'OK') {
              this.requestData()
            } else {
              this.error = response.res_msg
            }
          })
      }
    }
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
  background: $color-bg-secondary;
  color: $color-text-contrast;
  padding: $padding-base * 4 $padding-base * 2;
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

    &_main {
      width: 50%;
    }
  }
}

.header {
  @include fontSize6();
}

.signin_form {
  padding: 0 $padding-base;
  max-width: $size-grid * 25;
  margin: auto;
}

.input {
  margin-bottom: $x4;
}

.auth{
  margin-left: $margin-base / 2;

  &__license {
    @include fontSize1();
  }

  &__error {
    @include fontSize3();
    color: $color-error;
  }
}

@media screen and (max-width: 800px) {
  .login__info {
    display: none;
  }

  .table__cell {
    vertical-align: top;
  }
}
</style>
