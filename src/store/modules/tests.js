import api from '../../modules/api'
import FileAPI from 'FileApi'

const state = {
  tests: {
    /*
      categoryName: {
        status: false,
        errid: false,
        data: {
          started: 1243, // seconds passed
          duration: 3600, // seconds
          list: [{
            id: Number,
            file: String
          }],
          answers: {
            list: [{
              task_id: Number
              source: url,
              text: String,
              status: true
            }],
            status: true
          }
        }
      }
    */
  }
}

const getters = {
  get: state => state.tests
}

const actions = {
  requestTest ({ state, commit }, data) {
    commit('createCategory', data.category)

    const apiFormatter = res => {
      let tasks = []
      if (res.res_code === 'OK') {
        const response = res.res_data
        tasks = response.secs.slice()
      }
      return tasks
    }

    api('test_started_time', {}, 'GET')
      .then(response => {
        commit('setTestStartTime', {
          category: data.category,
          time: response.res_data,
          type: response.res_msg
        })
      })

    return api('test_tasks', {}, 'GET')
      .then(response => {
        commit('setTasksList', {
          category: data.category,
          list: apiFormatter(response)
        })
        return response
      })
  },
  onStart ({ state, commit }, category) {
    return api('test_started_time', {}, 'POST')
      .then(response => {
        if (response.res_code === 'OK') {
          commit('start', { category, timer: 0 })
        }
        return response.res_code === 'OK'
      })
  },
  finish ({ state, commit }, category) {
    // api
    commit('finish', category)
  },
  uploadSourceCode ({ state, commit }, data) {
    if (!state.tests[data.category]) {
      return
    }

    FileAPI.upload({
      url: '/api/progs/upload',
      headers: {
        'Access-Controll-Request-Method': 'POST'
      },
      files: {
        files: data.file
      },
      complete: (err, xhr) => {
        if (!err) {
          const res = JSON.parse(xhr.responseText)
          res.Status === 'OK' ? data.success() : data.fail()
        } else {
          data.fail()
        }
      }
    })
  },
  requestAnswers ({ state, commit }, category) {
    if (!state.tests[category]) {
      return
    }

    commit('setAnswers', {
      category,
      answers: [],
      status: false
    })

    return api('test_answers', {}, 'GET')
      .then(response => {
        if (response.res_code === 'OK') {
          commit('setAnswers', {
            status: true,
            category,
            answers: response.res_data
          })
        }
        return response
      })
  },
  requestSource ({ state, commit }, data) {
    if (!state.tests[data.category]) {
      return
    }

    commit('setAnswerSource', {
      id: data.id,
      category: data.category,
      status: false,
      text: ''
    })

    return api(data.url, { force: true }, 'GET')
      .then(response => {
        console.log(response)
        commit('setAnswerSource', {
          id: data.id,
          category: data.category,
          status: true,
          text: response
        })
        return response
      })
  }
}

const mutations = {
  createCategory (state, category) {
    if (!state.tests[category]) {
      state.tests[category] = {
        status: false,
        errid: false,
        data: {
          type: '',
          started: -1,
          duration: 14100,
          list: [],
          answers: {
            status: false,
            list: []
          }
        }
      }
    }
    state = Object.assign({}, state)
  },
  setTestStartTime (state, data) {
    state.tests[data.category].data.type = data.type
    state.tests[data.category].data.started = data.time
    state.tests = Object.assign({}, state.tests)
  },
  setTasksList (state, data) {
    state.tests[data.category].data.list = data.list
    state.tests[data.category].status = true
    state.tests = Object.assign({}, state.tests)
  },
  start (state, data) {
    state.tests[data.category].data.started = data.timer
    state.tests = Object.assign({}, state.tests)
  },
  finish (state, category) {
    state.tests[category].data.started = state.tests[category].data.duration
    state.tests = Object.assign({}, state.tests)
  },
  setAnswers (state, data) {
    state.tests[data.category].data.answers.status = data.status
    state.tests[data.category].data.answers.list = data.answers.map(a => {
      return Object.assign({ status: false, text: `${a.task_id}`, ...a })
    })
    state.tests = Object.assign({}, state.tests)
  },
  setAnswerSource (state, data) {
    const list = state.tests[data.category].data.answers.list
    list.map(a => {
      if (a.task_id === data.id) {
        a.text = data.text
        a.status = data.status
      }
      return a
    })
    state.tests = Object.assign({}, state.tests)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
