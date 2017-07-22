import Vue from 'vue'
var vm = new Vue()
import axios from 'axios'
// actions
const actions = {
  IMG_CHANGE: function ({ commit }, params) {
    commit('LOADING', {loading: 'sqlLoading', value: true})
    var datas = new URLSearchParams()
    datas.append('sql', params.sql)
    axios.post('', datas)
    .then((response) => {
      commit('LOADING', {loading: 'sqlLoading', value: false})
      if (response.data.success) {
        commit('SET_DATA', response.data)
      } else {
        vm.$Message.error(response.data.message)
      }
    })
    .catch((error) => {
      console.log(error)
      commit('LOADING', {loading: 'sqlLoading', value: false})
      vm.$Message.error('请求失败!')
    })
  }
}

export default {
  actions
}
