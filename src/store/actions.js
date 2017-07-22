import Vue from 'vue'
var vm = new Vue()
import axios from 'axios'
axios.defaults.withCredentials = true

const containerInfoDetail = {
  row_num: 1,
  col_num: 1,
  offset_col: 0,
  offset_row: 0,
  background_color: 'rgba(255,255,255,0.1)',
  title_color: undefined,
  title_bordered: false,
  title: '',
  title_height: 40,
  title_fontsize: 12,
  inner_col: 2,
  inner_row: 2,
  grid_show: true,
  border_left: false,
  border_right: false,
  border_top: false,
  border_bottom: false,
  horizontal_position: '',
  date_selector: '',
  time_condition: '',
  time_background: 'rgba(255,255,255,0.1)',
  startTime: '',
  endTime: '',
  title_show: true,
  vertical_position: '',
  padding_top: 0,
  padding_bottom: 0,
  padding_left: 0,
  padding_right: 0
}

const actions = {
  getList: function ({ commit }, params) {
    commit('LOADING', {loading: 'loading', value: true})

    let data = new URLSearchParams()
    data.append('id', (window.location.href.substring(window.location.href.indexOf('page/')).split('/')[1] || window.location.href.substring(window.location.href.indexOf('preview/')).split('/')[1]))
    data.append('searchContainer', true)
    data.append('searchLegendInfo', true)

    let data1 = new URLSearchParams()
    data1.append('current_page', 1)
    data1.append('page_size', 10)

    axios.all([
      axios.post('/api/screen/detail', data),
      axios.post('/api/theme/findList', data1)
    ])
    .then(axios.spread(function (response1, response2) {
      commit('LOADING', {loading: 'loading', value: false})
      commit('GET_THEME_LIST', response2.data)
      if (response1.data.success) {
        let params = response1.data.data
        params.row_num = params.row_num ? params.row_num : 4
        params.col_num = params.col_num ? params.col_num : 3

        if (params.container_info && params.container_info.length) {
          params.container_info.map((item, index) => {
            item.grid_show = item.grid_show === 'true'
            item.title_show = item.title_show === 'true'
            item.title_bordered = item.title_bordered === 'true'
            item.date_selector = item.date_selector === 'true'
            item.border_left = item.border_left === 'true'
            item.border_right = item.border_right === 'true'
            item.border_top = item.border_top === 'true'
            item.border_bottom = item.border_bottom === 'true'
          })

          commit('GET_LIST', params)
        } else {
          var datas = new URLSearchParams()
          datas.append('screen_id', window.location.href.substring(window.location.href.indexOf('page/')).split('/')[1])
          for (var attr in containerInfoDetail) {
            datas.append(attr, containerInfoDetail[attr])
          }

          axios.post('/api/container/merge', datas)
          .then((response) => {
            if (response.data.success) {
              params.container_info = [{}]
              params.container_info[0].id = response.data.id
              for (var attr in containerInfoDetail) {
                params.container_info[0][attr] = containerInfoDetail[attr]
              }

              commit('GET_LIST', params)
            } else {
              vm.$Message.error(response.data.message)
            }
          })
          .catch((error) => {
            console.log(error.data)
            vm.$Message.error('无法新增容器!')
          })
        }
      } else {
        vm.$Message.error(response1.data.message)
      }
    }))
    .catch((error1, error2) => {
      // console.log(error1)
      // console.log(error2)
      commit('LOADING', {loading: 'loading', value: false})
      if (error1.data) {
        console.log(error1.data)
        vm.$Message.error('无法加载页面数据!')
      }
      if (error2.data) {
        console.log(error2.data)
        vm.$Message.error('无法获取主题列表!')
      }
    })
  },
  routeChange: function ({commit}, value) {
    commit('ROUTE_CHANGE', value)
  }
}

export {actions, containerInfoDetail}
