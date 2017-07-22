import Vue from 'vue'
var vm = new Vue()
import axios from 'axios'
import fn from '../../../static/demo'
import * as chartAction from './chartSet'
import * as action from '../actions'

// actions
const actions = {
  addPart: function ({ dispatch, commit }, params) {
    var datas = new URLSearchParams()
    let result = []
    let flag = true
    if (params.name === 1) {
      datas.append('screen_id', window.location.href.substring(window.location.href.indexOf('page/')).split('/')[1])

      for (var attr in action.containerInfoDetail) {
        if (attr !== 'offset_col' && attr !== 'offset_row') {
          datas.append(attr, action.containerInfoDetail[attr])
        }
      }
      // 获取已有容器，用于判断碰撞
      if (params.vesselArr && params.vesselArr.length) {
        let arr = []
        params.vesselArr.map((item, index) => {
          arr.push({
            w: item.col_num,
            h: item.row_num,
            top: item.offset_row,
            left: item.offset_col
          })
        })
        result = fn(arr, {w: 1, h: 1}, params.col, params.row)
        if (result && result.length) {
          datas.append('offset_col', result[0])
          datas.append('offset_row', result[1])
        } else {
          flag = false
          vm.$Message.error('容器添加非法!')
        }
      } else {
        datas.append('offset_col', 0)
        datas.append('offset_row', 0)
      }
    } else {
      datas.append('container_id', params.vessel)
      datas.append('type', params.type)
      params.vesselArr.map((item, index) => {
        if (item.id === params.vessel) {
          if (item.inner_row > 5) {
            datas.append('z_row', parseInt(item.inner_row / 5) * 3)
          } else {
            datas.append('z_row', 1)
          }
          if (item.inner_col > 5) {
            datas.append('z_col', parseInt(item.inner_col / 5) * 3)
          } else {
            datas.append('z_col', 1)
          }
        }
      })
      datas.append('offset_col', 0)
      datas.append('offset_row', 0)
    }
    if (flag) {
      commit('LOADING', {loading: 'headLoading', value: true})
      axios.post(((params.name === 1) ? '/api/container/merge' : '/api/legend/merge'), datas)
      .then((response) => {
        commit('LOADING', {loading: 'headLoading', value: false})
        if (response.data.success) {
          commit('ADD_PART', {id: response.data.id, type: params.type, vessel: params.vessel, result: result})

          switch (true) {
            case /bar|pileBar|transverseBar|transversePileBar|line|pileLine|pie|circlePie|rosePie|dashboard|mutiDashboard|migration|thermodynamic/.test(params.type):
              commit('SET_CHART', chartAction.default.chartSet[params.type])
              break
            case /table/.test(params.type):
              commit('SET_TABLE', {
                headStyle: {
                  color: {
                    hex: '#194d33'
                  },
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0)'
                },
                bodyStyle: {
                  color: {
                    hex: '#194d33'
                  },
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center'
                },
                hasHead: true,
                hasPage: false,
                pageSize: 1,
                data: {
                  head: [
                    {
                      text: '姓名',
                      value: 'name'
                    },
                    {
                      text: '性别',
                      value: 'sex'
                    },
                    {
                      text: '地址',
                      value: 'addr'
                    }
                  ],
                  body: [
                    {
                      name: '叶子',
                      sex: '女',
                      addr: '杭州'
                    },
                    {
                      name: '叶子',
                      sex: '女',
                      addr: '杭州'
                    }
                  ]
                }
              })
              break
            case /number/.test(params.type):
              commit('SET_NUMBER', {
                number: 100000,
                text: '100000',
                style: {
                  color: '#194d33',
                  fontSize: '12px',
                  textAlign: 'center'
                }
              })
              break
            case /text/.test(params.type):
              commit('SET_TEXT', {
                text: '请输入文本',
                style: {
                  fontSize: '12px'
                }
              })
              break
            case /image/.test(params.type):
              commit('SET_IMG', {
                src: '',
                name: '暂无图片',
                setSize: 'full',
                style: {
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }
              })
              break
            case /timestamp/.test(params.type):
              commit('SET_TIMES', {
                style: {
                  color: '#00bfff',
                  fontSize: 12,
                  fontWeight: 'normal',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }
              })
              break
          }
        } else {
          vm.$Message.error(response.data.message)
        }
      })
      .catch((error) => {
        console.log(error)
        commit('LOADING', {loading: 'headLoading', value: false})
        vm.$Message.error('请求失败!')
      })
    }
  }
}

export default {
  actions
}
