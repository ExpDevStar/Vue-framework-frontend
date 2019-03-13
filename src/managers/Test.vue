<template>
  <div :class="[$style.wrapper]" v-if="ready && loggedin">
    <div  :class="[$style.content]">
      <div :class="[$style.content]">
        <div :class="[$style.content__holder]">
          <div :class="[$style.col]">
            <Sticky>
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

export default {
  components: {
    TestProgramming,
    TasksList,
    Preloader,
    Sticky
  },
  props: {
    category: String,
    task: Number
  },
  computed: {
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
    needAuth () {
      return this.ready && !this.loggedin
    }
  },
  watch: {
    needAuth (v) {
      if (v) {
        this.goHome()
      } else {
        this.requestTest({ category: this.category })
      }
    }
  },
  methods: {
    ...mapActions('tests', [
      'requestTest'
    ]),
    onTaskChoosen (index) {
      this.$router.push({ path: `${this.category}?task=${index}` })
    },
    goHome () {
      if (this.needAuth) {
        this.$router.push({ path: '/' })
      }
    }
  },
  mounted () {
    if (this.needAuth) {
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
