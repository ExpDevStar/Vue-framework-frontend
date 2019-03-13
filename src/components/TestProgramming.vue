<template>
  <div :class="[$style.wrapper]" v-if="ready">
    <div :class="[$style.task]">
      <Preloader :class="[$style.preloader]" />
      <img
        :src="`https://olymp.bmstu.ru/exercises/files/${task}`"
        :key="taskIndex"
        :class="[$style.task__img]"
      />
    </div>
    <div :class="[$style.answer]">
      <div :class="[$style.ace_editor_holder]" v-show="true" ref="editor">
      </div>
      <label>
        <Button @clicked="openFileDialog">Открыть файл с решением</Button>
        <input type="file" hidden  ref="file" @change="processFile"/>
      </label>
      <Button @clicked="sendAnswer" :disabled="!answer.length">Отправить решение</Button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ace from 'ace-builds'
import '../../node_modules/ace-builds/webpack-resolver'

import Preloader from './Preloader'
import Button from './Button'

export default {
  data () {
    return {
      file: null,
      answer: '',
      editor: null,
      ext: 'pascal'
    }
  },
  components: {
    Preloader,
    Button
  },
  props: {
    taskIndex: Number,
    category: String
  },
  computed: {
    ...mapGetters('tests', [
      'get'
    ]),
    ready () {
      return this.get[this.category] && this.get[this.category].status
    },
    task () {
      return this.get[this.category].data.list[this.taskIndex - 1 || 0].url
    }
  },
  watch: {
    ready () {
      this.initEditor()
    },
    answer (value) {
      this.editor.setValue(value)
      this.editor.session.setMode(`ace/mode/${this.ext}`)
    }
  },
  methods: {
    openFileDialog () {
      this.$refs.file.click()
    },
    processFile (e) {
      let file = this.$refs.file
      if (!file || !file.files || !file.files[0]) {
        return
      }

      file = file.files[0]
      switch (file.type) {
        case 'pas':
        case 'dpr':
        case 'lpr':
          this.ext = 'pascal'
          break
        case 'c':
        case 'cpp':
          this.ext = 'c_cpp'
        case 'py':
          this.ext = 'python'
          break
        default:
          this.ext = 'javascript' // just because
      }

      const reader = new FileReader()
      reader.onload = e => {
        const text = reader.result
        if (text) {
          this.answer = text
        }
      }
      reader.readAsText(file)
    },
    initEditor () {
      const editor = this.$refs.editor
      this.editor = ace.edit(editor)
    },
    sendAnswer () {
      // create file from this.answer and pass it through api
    }
  },
  mounted () {
    if (this.ready) {
      this.initEditor()
    }
  }
}
</script>

<style module lang="scss">
@import "../styles/base.scss";

.wrapper {
  padding: 0 $padding-base * 2;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
}

.task {
  width: 100%;

  &__img {
    position: relative;
    z-index: 10;
    margin: auto;
  }
}

.answer {
  padding: $padding-base 0;
  max-width: $size-grid * 42;
  margin: auto;
  text-align: left;
}

.preloader {
  position: absolute;
  z-index: 1;
  margin: auto;
}

.ace_editor_holder {
  width: 100%;
  position: relative;
  height: 350px;
  margin: $margin-base 0;
}

</style>
