<template>
  <div :class="[$style.wrapper]" v-if="ready">
    <div :class="[$style.task]">
      <template v-if="exists">
        <Preloader :class="[$style.preloader]" />
        <img
          :src="`https://olymp.bmstu.ru/exercises/files/${task}`"
          :key="taskIndex"
          :class="[$style.task__img]"
        />
      </template>
      <template v-else>
        Невозможно отобразить задание.
        Попробуйте перезагрузить страницу или проверьте правильность <pre>URL-адреса</pre>
      </template>
    </div>
    <div :class="[$style.answer]" v-show="answersReady">
      <div :class="[$style.ace_editor_holder]" ref="editor">
      </div>
      <label>
        <Button @clicked="openFileDialog">Открыть файл с решением</Button>
        <input type="file" hidden  ref="file" @change="processFile" :key="taskIndex" />
      </label>
      <Button @clicked="sendAnswer" :disabled="!answer.length || uploading">
        {{ uploading ? 'Идёт отправка' : 'Отправить решение' }}
      </Button>
      <span v-if="uploaded" :class="[$style.success]">Задание успешно отправлено</span>
      <span v-if="notUploaded" :class="[$style.error]">Задание не отправлено. повторите попытку</span>
    </div>
    <Preloader v-show="!answersReady" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
      ext: 'pas',
      uploading: false,
      uploaded: false,
      notUploaded: false
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
    exists () {
      return this.get[this.category].data.list[this.taskIndex - 1 || 0]
    },
    task () {
      // check task exists (?)
      return this.get[this.category].data.list[this.taskIndex - 1 || 0].url
    },
    answersReady () {
      return this.get[this.category] &&
        this.get[this.category].status &&
        this.get[this.category].data.answers.status &&
        this.get[this.category].data.answers.list.filter(a => {
          return a.task_id === this.taskIndex && a.status
        }).length
    }
  },
  watch: {
    taskIndex () {
      this.getAnswers()
    },
    ready () {
      this.initEditor()
    },
    answersReady (ready) {
      if (ready) {
        this.setDefaultAnswer()
      }
    },
    answer (value) {
      if (this.editor.getValue() !== value) {
        this.editor.setValue(value)
      }
      let ext = ''

      switch (this.ext) {
        case 'pas':
        case 'dpr':
        case 'lpr':
          ext = 'pascal'
          break
        case 'c':
        case 'cpp':
          ext = 'c_cpp'
        case 'py':
          ext = 'python'
          break
        default:
          ext = 'javascript' // just because
      }
      this.editor.session.setMode(`ace/mode/${ext}`)
    }
  },
  methods: {
    ...mapActions('tests', [
      'requestAnswers',
      'uploadSourceCode',
      'requestSource'
    ]),
    getAnswers () {
      this.uploading = false
      this.uploaded = false
      this.notUploaded = false
      this.requestAnswers(this.category)
        .then(response => {
          if (response.res_code === 'OK') {
            let task = response.res_data.filter(a => {
              return a.task_id === this.taskIndex
            })
            if (task.length) {
              task = task[0].source
              this.requestSource({
                id: this.taskIndex,
                category: this.category,
                url: task
              })
            }
          }
        })
    },
    openFileDialog () {
      this.$refs.file.click()
    },
    processFile (e) {
      let file = this.$refs.file
      if (!file || !file.files || !file.files[0]) {
        return
      }

      file = file.files[0]
      this.ext = file.name.split('.').pop() || 'source'

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
      this.editor = ace.edit(this.$refs.editor)
      this.editor.setValue(this.answer)
      this.editor.on('change', () => {
        this.answer = this.editor.getValue()
      })
    },
    sendAnswer () {
      this.uploading = true
      this.uploaded = false
      this.notUploaded = false
      const blob = new Blob([this.answer])
      const file = new File([blob], `${this.taskIndex}.${this.ext}${this.taskIndex}`, { type: 'application/json' })
      this.uploadSourceCode({
        category: this.category,
        file,
        success: () => {
          this.uploaded = true
          this.uploading = false
        },
        fail: () => {
          this.notUploaded = true
          this.uploading = false
        }
      })
    },
    setDefaultAnswer () {
      const state = this.get[this.category]
      if (!state || !state.status || !state.data.answers.status) {
        return
      }
      const list = state.data.answers.list
      const a = list.filter(a => a.task_id === this.taskIndex).pop()
      this.editor.setValue(a ? a.text : '', -1)
    }
  },
  mounted () {
    if (this.ready) {
      this.initEditor()
      this.getAnswers()
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
  position: relative;

  &__img {
    position: relative;
    z-index: 10;
    margin: auto;
    max-width: 100%;
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
  left: calc(50% - $size-preloader / 2);
  z-index: 1;
  margin: auto;
}

.ace_editor_holder {
  width: 100%;
  position: relative;
  height: 350px;
  margin: $margin-base 0;
}

.error {
  color: $color-error;
}

.success {
  color: $color-success;
}

</style>
