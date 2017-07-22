import Vue from 'vue'
var vm = new Vue()
import axios from 'axios'

// actions
const actions = {
  change_page: function ({ commit }, params) {
    commit('CHANGE_PAGE', params)
  },
  remove_file: function ({ commit }, fileType) {
    let datas = new URLSearchParams()
    datas.append('id', window.location.href.substring(window.location.href.indexOf('page/')).split('/')[1])
    datas.append(fileType, null)

    axios.post('/api/screen/merge', datas)
    .then((response) => {
      commit('LOADING', {loading: 'loading', value: false})
      if (response.data.success) {
        commit('REMOVE_FILE', fileType)
        vm.$Message.error('移除成功!')
      } else {
        vm.$Message.error(response.data.message)
      }
    })
    .catch((error) => {
      console.log(error)
      vm.$Message.error('请求失败!')
    })
  },
  select_theme: function ({ commit }, id) {
    commit('SELECT_THEME', id)
  },
  add_theme: function ({ commit }, params) {
    let datas = new URLSearchParams()
    for (let attr in params) {
      datas.append(attr, params[attr])
    }
    axios.post('/api/theme/merge', datas)
    .then((response) => {
      if (response.data.success) {
        // params.id = response.data.id
        let data1 = new URLSearchParams()
        data1.append('current_page', 1)
        data1.append('page_size', 10)
        axios.post('/api/theme/findList', data1)
        .then((response) => {
          commit('GET_THEME_LIST', response.data)
        })
        .catch((error) => {
          console.log(error)
          vm.$Message.error('无法获取主题列表!')
        })
        // commit('ADD_THEME', params)
      } else {
        vm.$Message.error(response.data.message)
      }
    })
    .catch((error) => {
      console.log(error)
      vm.$Message.error('新增主题失败!')
    })
  },
  remove_theme: function ({ commit }, id) {
    let datas = new URLSearchParams()
    datas.append('id', id)
    axios.post('/api/theme/delete', datas)
    .then((response) => {
      if (response.data.success) {
        commit('REMOVE_THEME', id)
      } else {
        vm.$Message.error(response.data.message)
      }
    })
    .catch((error) => {
      console.log(error)
      vm.$Message.error('删除主题失败!')
    })
  }
}

export default {
  actions
}
