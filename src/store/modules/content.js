import Vue from 'vue'
var vm = new Vue()
import axios from 'axios'

// actions
const actions = {
  selectVessel: function ({ commit }, index) {
    commit('SELECT_VESSEL', index)
  },
  selectLayer: function ({ commit }, params) {
    commit('SELECT_LAYER', params)
  },
  selectTime: function ({ commit }, params) {
    commit('SELECT_TIME', params)
  },
  changeTime: function ({ commit }, params) {
    commit('CHANGE_TIME', params)
  },
  topdown: function ({ commit }, params) {
    commit('TOP_DOWN', params)
  },
  leftright: function ({ commit }, params) {
    commit('LEFT_RIGHT', params)
  },
  addrow: function ({ commit }, params) {
    commit('ADD_ROW', params)
  },
  addcol: function ({ commit }, params) {
    commit('ADD_COL', params)
  },
  remove: function ({ commit }, params) {
    let url
    let datas = new URLSearchParams()
    if (params.type === 'list') {
      url = '/api/container/delete'
      datas.append('id', params.vessel)
    } else if (params.type === 'child') {
      url = '/api/legend/delete'
      datas.append('id', params.layer)
    }

    axios.post(url, datas)
      .then((response) => {
        if (response.data.success) {
          commit('REMOVE', params)
        } else {
          vm.$Message.error(response.data.message)
        }
      })
      .catch((error) => {
        console.log(error)
        vm.$Message.error('请求失败!')
      })
  }
}

export default {
  actions
}
