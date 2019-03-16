<template>
  <div :class="[$style.wrapper]" v-if="ready && loggedin && testsReady">
    <div :class="[$style.start]" v-if="!started">
      <template v-if="olympName">
        <div :class="[$style.header]">{{ olympName }}</div>
        <Button
          size="big"
          :class="[$style.start__btn]"
          @clicked="onStartClick"
          :disabled="starting"
        >
          Начать
        </Button>
        <div
          :class="[$style.error]"
          v-if="errorStart"
        >
          Извините, что-то пошло не так, попробуйте снова
        </div>
      </template>
      <template v-else>
        В настоящее время у Вас нет доступных Олимпиад для участия.
      </template>
    </div>
    <div :class="[$style.finished]" v-else-if="finished">
      Тестирование завершено.
      Пожалуйста, сдайте черновики дежурному администратору и распишитесь в бланке по окончании тестирования.
      <br>
      Спасибо за участие!
    </div>
    <div :class="[$style.content]" v-else>
      <div :class="[$style.content__holder]">
        <div :class="[$style.col]">
          <Sticky>
            <Timer :start="startedTime" :duration="duration" @finished="onFinish" />
            <TasksList
              :category="category"
              :active="task"
              @choosen="onTaskChoosen"
            />
          </Sticky>
        </div>
        <div :class="[$style.col, $style.col_wide]">
          <TestProgramming
            v-if="category === 'programming'"
            :taskIndex="task"
            :category="category"
          />
        </div>
      </div>
    </div>
    <div :class="[$style.touch]">
      В настоящее время тестирование
      недоступно для мобильных устройств.
      Приносим свои извинения за доставленные неудобства
    </div>
  </div>
  <div :class="[$style.preloader]" v-else>
    <Preloader />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import TestProgramming from '../components/TestProgramming'
import TasksList from '../components/TasksList'
import Preloader from '../components/Preloader'
import Sticky from '../components/Sticky'
import Button from '../components/Button'
import Timer from '../components/Timer'

export default {
  components: {
    TestProgramming,
    TasksList,
    Preloader,
    Sticky,
    Button,
    Timer
  },
  data () {
    return {
      errorStart: false,
      starting: false
    }
  },
  props: {
    category: String,
    task: Number
  },
  computed: {
    ...mapGetters('tests', {
      tests: 'get'
    }),
    ...mapGetters('user', [
      'loggedin',
      'ready',
      'get'
    ]),
    availableCategories () {
      return {
        programming: {
          title: 'Задачи по программированию'
        }
      }
    },
    notAvailable () {
      return this.ready && !(this.loggedin && this.get.test_available)
    },
    testsReady () {
      return this.tests[this.category] && this.tests[this.category].status
    },
    started () {
      return this.startedTime >= 0
    },
    finished () {
      return this.startedTime >= this.duration
    },
    startedTime () {
      return this.tests[this.category].data.started
    },
    duration () {
      return this.tests[this.category].data.duration
    },
    olympName () {
      return this.tests[this.category].data.type
    }
  },
  watch: {
    notAvailable (v) {
      if (v) {
        this.goHome()
      } else {
        this.requestTest({ category: this.category })
      }
    }
  },
  methods: {
    ...mapActions('tests', [
      'requestTest',
      'onStart',
      'finish'
    ]),
    onTaskChoosen (index) {
      this.$router.push({ path: `${this.category}?task=${index}` })
    },
    goHome () {
      if (this.notAvailable) {
        this.$router.push({ path: '/' })
      }
    },
    onStartClick () {
      this.starting = true
      this.onStart(this.category)
        .then(response => {
          this.errorStart = !response
          this.starting = false
        })
    },
    onFinish () {
      this.finish(this.category)
    }
  },
  mounted () {
    if (this.notAvailable) {
      this.goHome()
    } else {
      this.category in this.availableCategories
        ? this.requestTest({ category: this.category })
        : this.$router.replace({ path: '/404' })
    }
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.touch {
  display: none;
}

.wrapper {
  width: 100%;
  padding: $padding-base * 2;
  box-sizing: border-box;
}

.user {
  @include fontHeader();
  padding: $padding-base;
}

.header {
  @include fontHeader();
  margin-bottom: $x6;
}

.start {
  text-align: center;

  &__description {
    text-align: left;
    max-width: $size-grid * 30;
    margin: auto;
    padding: $padding-base;
    @include fontSize4();
    color: $color-text-secondary;
  }

  &__btn {
    margin: auto;
  }
}

.finished {
  max-width: $size-grid * 30;
  margin: auto;
  padding: $padding-base;
  @include fontSize3();
}

.error {
  color: $color-error;
  padding: $padding-base;
}

.content {
  display: table;
  width: 100%;

  &__holder {
    display: table-row;
  }
}

.col {
  display: table-cell;
  vertical-align: top;

  &_wide {
    width: 100%;
  }
}

.preloader {
  margin: auto;
  text-align: center;
  padding: $padding-base * 2;
}

@media screen and (max-width: 800px) {
  .content {
    display: none;
  }

  .touch {
    display: block;
    @include fontSize5();
  }
}
</style>
