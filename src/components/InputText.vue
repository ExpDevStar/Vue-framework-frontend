<template>
  <div :class="[
    $style.wrapper, {
      [$style.contrasted]: contrast,
      [$style.big]: big
    }
  ]"  @click="$emit('click')">
    <label :class="[$style.label]">
      <slot name="upper_input"></slot>
      <div
        v-if="maxLength && !disableMaxLengthCounter"
        :class="[
          $style.counter, {
            [$style.counter_negative]: currentLimit < 0 || error
          }
        ]"
      >
        {{ currentLimit }}
      </div>
      <div v-if="title" :class="[$style.title]">
        {{ title }}
        <span
          v-if="required"
          :class="[$style.required]"
        >*</span>
      </div>
      <div :class="$style.clear"></div>

      <!-- InputElement -->
      <div :class="[
        $style.input,
        {
          [$style.input_norightround]: noRightRound,
          [$style.input_focused]: focused,
          [$style.input_disabled]: disabled,
          [$style.input_error]: error
        }
      ]">
        <div :class="[$style.input__table]">
          <div :class="[$style.input__row]">

            <!-- PreInput -->
            <div
              v-if="!!$slots.pre_input"
              :class="[$style.input__part, $style.input__part_pre]"
            >
              <slot name="pre_input" />
            </div>

            <!-- MainInput -->
            <div :class="[$style.input__part, $style.input__part_main]">
              <component
                :is="type === 'textarea' ? 'textarea' : 'input'"
                ref="input"
                :name="name"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :value="type === 'password' ? '' : value"
                :autocomplete="autocomplete"
                :maxlength="maxLengthForce || 'none'"
                :rows="rows"
                @focus="onFocus"
                @input="onInput"
                @change="onChange"
                @blur="onBlur"
                @paste="onPaste"
                :class="[
                  {
                    [$style.autosize]: autosize
                  }
                ]"
                :style="{
                  maxHeight: autosize ? autosizeMaxHeight  + 'px' : 'auto',
                  minHeight: (postHeight || 40) + 'px',
                  paddingRight: (postWidth || 12) + 'px'
                }"
              />
            </div>

          </div>
        </div>

        <!-- PostInput -->
        <div
          @mousedown="onPostInputMouseDown"
          ref="post_input"
          :class="[$style.input__post, { [$style.input__post_textarea]: type === 'textarea' }]"
          :style="{
            top: ((big ? 50 : 40) - postHeight - 2) / 2 + 'px', // -2 is for border
          }"
        >
          <slot name="post_input" v-if="!!$slots.post_input" />
        </div>

        <!-- UnderInput -->
        <div
          v-if="!!$slots.under_input"
          @click="preventFocusing"
          :class="[
            $style.input__under,
            {
              [$style.input__under_focused]: focused
            }
          ]"
        >
          <slot name="under_input" />
        </div>

      </div>
    </label>

    <transition name="fade">
      <div v-if="error" :class="[$style.error]">
        {{ error }}
      </div>
    </transition>
    <div
      v-if="$slots.description"
      :class="[$style.description]"
    >
      <slot name="description" />
    </div>
  </div>
</template>

<script>
import autosize from 'autosize'

export default {
  inject: ['$validator'],
  $_veeValidate: {
    name () {
      return this.name
    },
    value () {
      return this.value
    }
  },
  data () {
    return {
      focused: false,
      autosizeMaxHeight: 300,
      initialTextAreaSize: 0,
      postWidth: 0,
      postHeight: 0
    }
  },
  props: {
    title: String,
    value: String,
    placeholder: String,
    required: Boolean,
    disabled: Boolean,
    rows: { // textarea height
      type: Number,
      default: 1
    },
    autosize: Boolean,
    maxLength: {
      type: Number,
      default: 0
    },
    disableMaxLengthCounter: {
      type: Boolean,
      default: false
    },
    maxLengthForce: { // input max length
      type: Number,
      default: 0
    },
    noRightRound: { // disable border-radius on right side
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text',
      validator: val => {
        return (
          ['url', 'text', 'password', 'email', 'search', 'textarea'].indexOf(val) !== -1
        )
      }
    },
    name: {
      type: String,
      required: true
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    validate: String,
    error: String,
    contrast: Boolean,
    big: Boolean,
    updateOnChange: Boolean,
    preventArrowKeys: Boolean
  },
  watch: {
    rows () {
      if (!this.value.length) {
        this.autosizeHeight = 0
      }
      this.initTextareaSize()
    },
    value () {
      this.apply()
    }
  },
  computed: {
    currentLimit () {
      let limit = 0
      if (this.maxLength) {
        limit = this.maxLength - (this.value || '').length
      }
      return limit
    }
  },
  methods: {
    onBlur (e) {
      this.focused = false
      this.$emit('blur', this)
    },
    onFocus (e) {
      this.$emit('focus', e.target.value)
      this.focused = true
    },
    onInput (e) {
      this.$emit('input', e.target.value)
    },
    onChange (e) {
      this.$emit('change', e.target.value)
    },
    onPaste (e) {
      this.$emit('paste', e)
    },
    preventFocusing (e) {
      e.preventDefault()
    },
    focus () {
      const input = this.$refs.input
      if (input) {
        input.focus()
      }
    },
    onPostInputMouseDown () {
      try {
        this.$refs.input.blur()
      } catch (ex) {}
    },
    initTextareaSize () {
      const textarea = this.$refs.input
      if (textarea) {
        textarea.style.height = 'auto'
      }
    },
    calculatePostInputPosition () {
      if (this.$slots.post_input) {
        const pi = this.$refs.post_input
        const c = pi.getBoundingClientRect()
        this.postWidth = c.width
        this.postHeight = c.height
      }
    },
    apply () {
      this.$refs.input.value = this.value
    }
  },
  mounted () {
    this.initTextareaSize()
    if (this.value) {
      this.apply()
    }

    this.calculatePostInputPosition()

    this.$nextTick(() => {
      if (this.type === 'textarea' && this.autosize) {
        autosize(this.$refs.input)
      }
    })

    this.$validator.extend('udashdigiten', {
      validate: (text) => {
        const validateInput = (text) => {
          return Promise.resolve({
            valid: text.match(/^[a-zA-Z][a-zA-Z\d_]{2,}$/)
          })
        }
        return Promise.resolve(validateInput(text))
      }
    })
  }
}
</script>

<style scoped module lang="scss">
@import "../styles/base.scss";

.clear {
  clear: both;
}

@mixin focused () {
  outline: none;
  border-color: $color-border-active;
  border-color: rgba(0,0,0,0.48);
}

@mixin hovered () {
  border-color: $color-border-hover;
  border-color: rgba(0,0,0,0.24);
}

.wrapper {
  display: block;
  padding: 0;

  &_contrasted {
    color: $color-text-contrast;
  }
}

.label {
  display: block;
  width: 100%;
}

.counter {
  @include fontSize2();
  float: right;
  transition: color 0.5s;

  &_negative {
    color: $color-error;
  }
}

.input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid $color-border;
  border-radius: $border-radius;
  transition: border-color 0.5s;
  position: relative;
  background: $color-input-bg;

  &:hover {
    @include hovered();
  }

  &_focused, &_focused:hover {
    @include focused();
  }

  &_disabled {
    background: $color-bg-disabled;
  }

  &_error {
    border-color: $color-error !important;
  }

  &_norightround {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &__table {
    display: table;
    width: 100%;
    box-sizing: border-box;
    border-spacing: 0px;
  }

  &__row {
    display: table-row;
  }

  &__part {
    display: table-cell;
    background-color: rgba(0, 0, 0, 0);
    cursor: text;
    color: $color-text;
    min-height: $x10;
    @include fontSize3();

    &_pre {
      padding: 0;
      padding-left: $x3;
      vertical-align: middle;
    }

    &_main {
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  }

  &__post {
    position: absolute;
    right: 0;
    padding-right: $x3;

    &_textarea {
      padding-right: $x5;
    }
  }

  &__under {
  }
}

input, textarea {
  width: 100%;
  box-sizing: border-box;
  appearance: none;
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  padding: $x2 $x3;
  padding-right: $x3;
  vertical-align: top;

  @include fontSize3();
  &:disabled {
    background: rgba(0, 0, 0, 0);
  }
}

.title {
  margin-bottom: $x1;
  @include fontSize2();
  @include fontControlLabel();
  @media (max-device-width: $size-grid * $touch-size) {
    & {
      font-weight: $font-weight;
    }
  }

  .required {
    color: $color-error;
  }
}

.error {
  @include fontSize2();
  color: $color-error;
  margin-top: $x2;
}

.description {
  @include fontSize2();
  margin-top: $x2;
  color: $color-text-secondary;
}

.big {
  .title {
    @include fontSize4();
    font-weight: bold;
    @media (max-device-width: $size-grid * $touch-size) {
      & {
        font-weight: $font-weight;
      }
    }
  }

  .input {
    &__part {
      &_pre {
        @include fontSize4();
        padding: 0;
        padding-left: $x3;
      }

      &_main {
        input, textarea {
          border: 0;
          @include fontSize4();
        }

        padding: 0;
      }
    }
  }

  input, textarea {
    padding: $x3;
  }

  .error {
    @include fontSize3();
  }

  .description {
    @include fontSize2();
    margin-top: $x1;
  }
}

.touch {
  .title {
    @media (max-device-width: $size-grid * $touch-size) {
      & {
        font-weight: bold;
      }
    }
  }
  .input {
    &__part {
      &_pre {
        @include fontSize4();
        padding-left: $x3;
      }

      &_main {
        input, textarea {
          border: 0;
          @include fontSize4();
        }
      }
    }
  }

  input, textarea {
    padding: $x3;
  }

  .description {
    @include fontSize3();
  }
}

textarea {
  resize: vertical;

  &.autosize {
    resize: none;

    &_less {
      overflow-y: hidden;
    }
  }
}

</style>
