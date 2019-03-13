import api from '../../modules/api'

const state = {
  /*
    categoryName: {
      status: false,
      errid: false,
      data: {
        startTime: Date(),
        duration: 3600, // seconds
        list: [{
          id: Number,
          file: String
        }],
        answers: [{
          id: Number
          file: File,
          text: String
        }]
      }
    }
  */
}

const getters = {
  get: state => state
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

    return api('test_tasks', {}, 'GET')
      .then(response => {
        commit('setTasksList', {
          category: data.category,
          list: apiFormatter(response)
        })
        return response
      })
  }
}

const mutations = {
  createCategory (state, category) {
    if (!state[category]) {
      state[category] = {
        status: false,
        errid: false,
        data: {
          startTime: -1,
          duration: 0,
          list: [],
          answers: []
        }
      }
    }
  },
  setTasksList (state, data) {
    state[data.category].data.list = data.list
    state[data.category].status = true
    state = Object.assign({}, state)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
