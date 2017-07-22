import Vue from 'vue'
var vm = new Vue()
import * as types from './mutation-types'
import fn from 'static/demo'
import * as actions from './actions'

const mutations = {
  [types.LOADING]: (state, params) => {
    state[params.loading] = params.value
  },
  // 获取接口列表
  [types.GET_LIST]: (state, params) => {
    for (let attr in params) {
      if (!/container_info/.test(attr)) {
        Vue.set(state.page.params, attr, params[attr])
      }
    }
    state.page.params.show_grid = state.page.params.show_grid === 'true'
    if (params.container_info && params.container_info.length) {
      Vue.set(state.page.container_info, params.container_info)
      params.container_info.map((item, index) => {
        Vue.set(state.page.container_info, index, item)
        if (item.time_condition) {
          item.time_condition = JSON.parse(item.time_condition)
        } else {
          item.time_condition = []
        }
        for (let attr in item) {
          if (attr === 'legend_info') {
            item[attr].map((item1, index1) => {
              if (item1.options) {
                item1.options = JSON.parse(item1.options)
              } else {
                item1.options = {}
              }
            })
          }
        }
      })
    }
  },
  [types.GET_THEME_LIST]: (state, params) => {
    state.page.theme.list = params.data
    state.page.theme.total = params.total_page
  },
  [types.SELECT_THEME]: (state, id) => {
    state.page.params.theme = id
  },
  [types.REMOVE_THEME]: (state, id) => {
    state.page.theme.list.map((item, index) => {
      if (item.id === id) {
        state.page.theme.list.splice(index, 1)
      }
    })
  },
  // 页面设置
  [types.CHANGE_PAGE]: (state, params) => {
    let oldRow = state.page.params.row_num
    let oldCol = state.page.params.col_num
    let newRow = params.row_num
    let newCol = params.col_num
    for (let attr in params) {
      if (!/row_num|col_num/.test(attr)) {
        Vue.set(state.page.params, attr, params[attr])
      }
    }
    if (oldRow > params.row_num || oldCol > params.col_num) {
      if (state.page.container_info && state.page.container_info.length) {
        let matrix = []// 变化前的矩阵
        let containerArr = []
        for (let m = 0; m < oldRow; m++) {
          matrix[m] = []
          for (let n = 0; n < oldCol; n++) {
            matrix[m].push(-1)
          }
        }

        state.page.container_info.map((item, index) => {
          containerArr.push(0)
          for (let m = 0; m < item.row_num; m++) {
            for (let n = 0; n < item.col_num; n++) {
              matrix[item.offset_row + m][item.offset_col + n] = index
            }
          }
        })// 按照container_info顺序取到的矩阵

        console.log(JSON.stringify(matrix))
        if (oldRow > params.row_num) {
          let difference = oldRow - params.row_num
          let flag = true

          matrix[0].map((item, index) => {
            let thisDifference = difference

            for (let m = 0; m < matrix.length; m++) {
              if (matrix[m][index] === -1 && m < matrix.length - 1) {
                for (let n = m; n < matrix.length; n++) {
                  if (n < matrix.length - 1) {
                    let temp = matrix[n][index]
                    matrix[n][index] = matrix[n + 1][index]
                    matrix[n + 1][index] = temp
                  }
                }
                --thisDifference
                if (thisDifference < 1) {
                  break
                }
              }
            }
          })

          console.log(JSON.stringify(matrix))

          for (let i = matrix.length - 1; i > (matrix.length - 1 - difference); i--) {
            matrix[i].map((item, index) => {
              if (item !== (-1)) {
                flag = false
              }
            })
          }

          if (flag) {
            matrix.map((item, index) => {
              let count = 0

              for (let i = 0; i < item.length; i++) {
                let temp = item[i]
                if (temp !== (-1) && containerArr[temp] === 0) {
                  state.page.container_info[temp].offset_row = index
                }
                for (let j = 0; j < item.length; j++) {
                  if (item[j] === temp) {
                    count++
                    item[j] = -1
                  }
                }
                if (temp !== (-1) && count > 0) {
                  containerArr[temp]++
                }
              }
            })

            containerArr.map((item, index) => {
              state.page.container_info[index].row_num = item
            })
          } else {
            newRow = oldRow
            state.pageNotModify = {
              row_num: newRow
            }
            vm.$Notice.error({
              title: '内容将少于行数,不能再减少!'
            })
          }
        }
        if (oldCol > params.col_num) {
          let difference = oldCol - params.col_num
          let flag = true

          matrix.map((item, index) => {
            let thisDifference = difference
            for (let m = 0; m < item.length; m++) {
              if (item[m] === -1 && m < item.length - 1) {
                for (let n = m; n < item.length; n++) {
                  if (n < matrix.length - 1) {
                    let temp = item[n]
                    item[n] = item[n + 1]
                    item[n + 1] = temp
                  }
                }
                --thisDifference
                if (thisDifference < 1) {
                  break
                }
              }
            }
          })

          // console.log(JSON.stringify(matrix))
          for (let i = matrix[0].length - 1; i > (matrix[0].length - 1 - difference); i--) {
            for (let l = 0; l < matrix.length; l++) {
              if (matrix[l][i] !== (-1)) {
                flag = false
              }
            }
          }

          if (flag) {
            matrix.map((item, index) => {
              for (let i = 0; i < item.length; i++) {
                let count = 0
                let temp = item[i]
                if (temp !== (-1) && containerArr[temp] === 0) {
                  state.page.container_info[temp].offset_col = i
                }
                for (let j = 0; j < item.length; j++) {
                  if (item[j] === temp) {
                    count++
                    item[j] = -1
                  }
                }
                if (temp !== (-1) && count > 0) {
                  containerArr[temp] = count
                }
              }
            })
            containerArr.map((item, index) => {
              state.page.container_info[index].col_num = item
            })
          } else {
            newCol = oldCol
            state.pageNotModify = {
              col_num: newCol
            }
            vm.$Notice.error({
              title: '内容将少于列数,不能再减少!'
            })
          }
        }
      }
    }
    Vue.set(state.page.params, 'row_num', newRow)
    Vue.set(state.page.params, 'col_num', newCol)
  },
  [types.REMOVE_FILE]: (state, fileType) => {
    state.page.params[fileType] = null
  },
  // 选择容器/图层，容器大小
  [types.SELECT_VESSEL]: (state, index) => {
    state.page.vesselI = index
    state.page.vessel = state.page.container_info[index].id
    state.page.isVessel = true

    if (state.page.container_info[index].legend_info && state.page.container_info[index].legend_info.length) {
      state.page.layerI = 0
      state.page.layer = state.page.container_info[index].legend_info[0].id
    }
    state.page.isLayer = false
  },
  [types.SELECT_LAYER]: (state, params) => {
    let index = params[0]
    let i = params[1]
    state.page.vesselI = index
    state.page.layerI = i
    state.page.vessel = state.page.container_info[index].id
    state.page.layer = state.page.container_info[index].legend_info[i].id
    // if (state.page.container_info[index].legend_info[i]) {
    // } else {
    //   state.page.layer = state.page.container_info[index].legend_info[i - 1].id
    // }
    state.page.isVessel = true
    state.page.isLayer = true
  },
  [types.TOP_DOWN]: (state, params) => {
    let num = params[0]
    let cNum = params[1]
    if (num !== 0) {
      let result = fn(getKnockArr(state.page.container_info, state.page.vessel), {w: state.page.container_info[state.page.vesselI].col_num, h: state.page.container_info[state.page.vesselI].row_num, top: state.page.container_info[state.page.vesselI].offset_row + num, left: state.page.container_info[state.page.vesselI].offset_col}, state.page.params.col_num, state.page.params.row_num)
      if (result && result.length) {
        state.page.container_info[state.page.vesselI].offset_col = result[0]
        state.page.container_info[state.page.vesselI].offset_row = result[1]
      } else {
        vm.$Message.error('容器不能重叠!操作非法!')
      }
    }
    if (state.page.container_info[state.page.vesselI].legend_info && state.page.container_info[state.page.vesselI].legend_info.length) {
      state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].offset_row += cNum
    }
  },
  [types.LEFT_RIGHT]: (state, params) => {
    let num = params[0]
    let cNum = params[1]
    if (num !== 0) {
      let result = fn(getKnockArr(state.page.container_info, state.page.vessel), {w: state.page.container_info[state.page.vesselI].col_num, h: state.page.container_info[state.page.vesselI].row_num, top: state.page.container_info[state.page.vesselI].offset_row, left: state.page.container_info[state.page.vesselI].offset_col + num}, state.page.params.col_num, state.page.params.row_num)
      if (result && result.length) {
        state.page.container_info[state.page.vesselI].offset_col = result[0]
        state.page.container_info[state.page.vesselI].offset_row = result[1]
      } else {
        vm.$Message.error('容器不能重叠!操作非法!')
      }
    }
    if (state.page.container_info[state.page.vesselI].legend_info && state.page.container_info[state.page.vesselI].legend_info.length) {
      state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].offset_col += cNum
    }
  },
  [types.ADD_ROW]: (state, params) => {
    let num = params[0]
    let cNum = params[1]
    if (num !== 0) {
      let result = fn(getKnockArr(state.page.container_info, state.page.vessel), {w: state.page.container_info[state.page.vesselI].col_num, h: state.page.container_info[state.page.vesselI].row_num + num, top: state.page.container_info[state.page.vesselI].offset_row, left: state.page.container_info[state.page.vesselI].offset_col}, state.page.params.col_num, state.page.params.row_num)
      if (result && result.length) {
        state.page.container_info[state.page.vesselI].row_num += num
        state.page.container_info[state.page.vesselI].offset_col = result[0]
        state.page.container_info[state.page.vesselI].offset_row = result[1]
      } else {
        vm.$Message.error('容器不能重叠!操作非法!')
      }
    }
    if (state.page.container_info[state.page.vesselI].legend_info && state.page.container_info[state.page.vesselI].legend_info.length) {
      state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].z_row += cNum
    }
    state.chartModify++
  },
  [types.ADD_COL]: (state, params) => {
    let num = params[0]
    let cNum = params[1]
    if (num !== 0) {
      let result = fn(getKnockArr(state.page.container_info, state.page.vessel), {w: state.page.container_info[state.page.vesselI].col_num + num, h: state.page.container_info[state.page.vesselI].row_num, top: state.page.container_info[state.page.vesselI].offset_row, left: state.page.container_info[state.page.vesselI].offset_col}, state.page.params.col_num, state.page.params.row_num)
      if (result && result.length) {
        state.page.container_info[state.page.vesselI].col_num += num
        state.page.container_info[state.page.vesselI].offset_col = result[0]
        state.page.container_info[state.page.vesselI].offset_row = result[1]
      } else {
        vm.$Message.error('容器不能重叠!操作非法!')
      }
    }
    if (state.page.container_info[state.page.vesselI].legend_info && state.page.container_info[state.page.vesselI].legend_info.length) {
      state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].z_col += cNum
    }
    state.chartModify++
  },
  [types.REMOVE]: (state, params) => {
    if (params.type === 'list') {
      state.page.container_info.splice(params.vesselI, 1)
      state.page.vesselI = 0
      if (state.page.container_info && state.page.container_info.length) {
        // state.page.vesselI = state.page.container_info.length - 1
        state.page.vessel = state.page.container_info[state.page.vesselI].id
      } else {
        state.page.vessel = ''
      }
      state.chartModify += 5
    } else if (params.type === 'child') {
      state.page.container_info[params.vesselI].legend_info.map((item, index) => {
        if (item.id === params.layer) {
          state.page.container_info[params.vesselI].legend_info.splice(index, 1)
        }
      })
      if (state.page.container_info[params.vesselI].legend_info && state.page.container_info[params.vesselI].legend_info.length) {
        state.page.layerI = state.page.container_info[params.vesselI].legend_info.length - 1
        state.page.layer = state.page.container_info[params.vesselI].legend_info[state.page.layerI].id
      } else {
        state.page.layerI = 0
        state.page.layer = ''
      }
    }
  },
  // 新增容器/图层
  [types.ADD_PART]: (state, params) => {
    if (params.type === 'vessel') {
      let obj = {
        id: params.id
      }

      for (let attr in actions.containerInfoDetail) {
        if (attr !== 'offset_col' && attr !== 'offset_row') {
          obj[attr] = actions.containerInfoDetail[attr]
        }
      }
      if (params.result && params.result.length) {
        obj.offset_col = params.result[0]
        obj.offset_row = params.result[1]
      } else {
        obj.offset_col = 0
        obj.offset_row = 0
      }
      state.page.container_info.push(obj)

      state.page.vesselI = state.page.container_info.length - 1
      state.page.vessel = params.id
      state.page.isVessel = true

      state.page.layerI = 0
      state.page.layer = ''
      state.page.isLayer = false
    } else {
      let obj = {
        id: params.id,
        z_row: 1,
        z_col: 1,
        offset_col: 0,
        offset_row: 0,
        grid_show: true,
        type: params.type,
        options: {}
      }
      let rows = state.page.container_info[state.page.vesselI].inner_row
      if (rows > 5) {
        obj.z_row = parseInt(rows / 5) * 3
      }
      let cols = state.page.container_info[state.page.vesselI].inner_col
      if (cols > 5) {
        obj.z_col = parseInt(cols / 5) * 3
      }
      if (state.page.container_info[state.page.vesselI].legend_info) {
        state.page.container_info[state.page.vesselI].legend_info.push(obj)
      } else {
        Vue.set(state.page.container_info[state.page.vesselI], 'legend_info', [obj])
      }

      state.page.layerI = state.page.container_info[state.page.vesselI].legend_info.length - 1
      state.page.layer = params.id
      state.page.isLayer = true
    }
  },
  // 容器变化
  [types.CHANGE_VESSEL]: (state, params) => {
    for (let attr in params) {
      if (/inner_row|inner_col|title_show|date_selector/.test(attr)) {
        if (state.page.container_info[state.page.vesselI][attr] !== params[attr]) {
          state.chartModify++
          let row = params.inner_row
          let col = params.inner_col
          if (state.page.container_info[state.page.vesselI].legend_info && state.page.container_info[state.page.vesselI].legend_info.length) {
            state.page.container_info[state.page.vesselI].legend_info.map((item, index) => {
              if ((item.offset_row + item.z_row) > row) {
                if (row < 2) {
                  item.z_row = row
                  item.offset_row = 0
                } else {
                  item.z_row = row - item.offset_row
                }
              }
              if ((item.offset_col + item.z_col) > col) {
                if (col < 2) {
                  item.z_col = col
                  item.offset_col = 0
                } else {
                  item.z_col = col - item.offset_col
                }
              }
            })
          }
        }
      }
      state.page.container_info[state.page.vesselI][attr] = params[attr]
    }
  },
  [types.SELECT_TIME]: (state, params) => {
    state.page.container_info[params.v_index].time_condition.map((item, index) => {
      if (params.t_type === item.type) {
        item.active = true
      } else {
        item.active = false
      }
    })
  },
  [types.CHANGE_TIME]: (state, params) => {

  },
  // 图层顺序
  [types.CHANGE_SORT]: (state, params) => {
    let num = params[0]
    let i = params[1]
    console.log(JSON.stringify(state.page.container_info[state.page.vesselI].legend_info))
    for (let index = 0; index < state.page.container_info[state.page.vesselI].legend_info.length; index++) {
      if (i === index) {
        state.page.container_info[state.page.vesselI].legend_info[i] = state.page.container_info[state.page.vesselI].legend_info.splice((i + num), 1, state.page.container_info[state.page.vesselI].legend_info[i])[0]
        break
      }
    }
    console.log(JSON.stringify(state.page.container_info[state.page.vesselI].legend_info))
    state.chartModify++
  },
  [types.TO_LAYER]: (state, params) => {
    state.page.layer = params.id
    state.page.layerI = params.index
    state.page.isVessel = true
    state.page.isLayer = true
  },

  // 路由变化
  [types.ROUTE_CHANGE]: (state, value) => {
    if (value === 'page') {
      state.page.vessel = ''
      state.page.layer = ''
      state.page.isVessel = false
      state.page.isLayer = false
    } else if (value === 'vessel') {
      state.page.layer = ''
      state.page.isVessel = true
      state.page.isLayer = false
    }
  },
  // 文本图层变化
  [types.SET_TEXT]: (state, params) => {
    state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].options = {}
    for (let attr in params) {
      Vue.set(state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].options, attr, params[attr])
    }
  },
  // 图片图层变化
  [types.SET_IMG]: (state, params) => {
    for (let attr in params) {
      Vue.set(state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].options, attr, params[attr])
    }
  },
  // 数值变化
  [types.SET_NUMBER]: (state, params) => {
    state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].options = {}
    for (let attr in params) {
      Vue.set(state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].options, attr, params[attr])
    }
  },
  // 图表变化
  [types.SET_CHART]: (state, params) => {
    state.chartModify--
    state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].options = params
  },
  // 表格变化
  [types.SET_TABLE]: (state, params) => {
    params.headStyle.fontSize += 'px'
    params.headStyle.color = params.headStyle.color.hex
    if (typeof params.headStyle.backgroundColor === 'object') {
      params.headStyle.backgroundColor = `rgba(${params.headStyle.backgroundColor.rgba.r},${params.headStyle.backgroundColor.rgba.g},${params.headStyle.backgroundColor.rgba.b},${params.headStyle.backgroundColor.rgba.a})`
    }
    params.bodyStyle.fontSize += 'px'
    params.bodyStyle.color = params.bodyStyle.color.hex
    if (typeof params.borderColor === 'object') {
      params.borderColor = `rgba(${params.borderColor.rgba.r},${params.borderColor.rgba.g},${params.borderColor.rgba.b},${params.borderColor.rgba.a})`
    }
    state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].options = params
  },
  // 数据变化
  [types.SET_DATA]: (state, params) => {
    // state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].options = params
  },
  [types.SET_TIMES]: (state, params) => {
    state.timeModify++
    state.page.container_info[state.page.vesselI].legend_info[state.page.layerI].options = params
  }
}

function getKnockArr (arr, id) {
  let list = []
  arr.map((item, index) => {
    if (item.id !== id) {
      list.push({
        w: item.col_num,
        h: item.row_num,
        top: item.offset_row,
        left: item.offset_col
      })
    }
  })
  return list
}

export default mutations
