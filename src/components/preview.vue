<template lang="html">
  <section class="content" ref="content" :style="{'background-image':'url('+page.params.background_image+')'}">
    <loading v-show="loading" :load-msg="loadingTips"></loading>
    <div class="item-style" v-for="(item,index) in page.container_info" :style="{width:(singleWidth*item.col_num+'px'),height:(singleheight*item.row_num+1.5+'px'),top:(singleheight*item.offset_row+1+'px'),left:(singleWidth*item.offset_col+'px'),paddingTop:item.padding_top+'px',paddingBottom:item.padding_bottom+'px',paddingLeft:item.padding_left+'px',paddingRight:item.padding_right+'px'}">
      <div class="item-top-layer">
        <h3 v-show="item.title_show" class="item-title" style="opacity:0" :style="{height:item.title_height+'px'}"></h3>
        <p class="item-time" v-if="item.date_selector===true"></p>
        <div class="item-inner" :style="{width:(((singleWidth*item.col_num-item.padding_left-item.padding_right)>0?(singleWidth*item.col_num-item.padding_left-item.padding_right):0)+'px'),height:(((singleheight*item.row_num-item.padding_top-item.padding_bottom)>0?(singleheight*item.row_num-item.padding_top-item.padding_bottom):0)+'px'),backgroundColor:item.background_color,borderTop:((item.border_top===true)?('1px solid '+(page.params.border_color?page.params.border_color:'#fff')):'none'),borderBottom:((item.border_bottom===true)?('1px solid '+(page.params.border_color?page.params.border_color:'#fff')):'none'),borderLeft:((item.border_left===true)?('1px solid '+(page.params.border_color?page.params.border_color:'#fff')):'none'),borderRight:((item.border_right===true)?('1px solid '+(page.params.border_color?page.params.border_color:'#fff')):'none')}">
          <h3 v-show="item.title_show" class="item-title" :class="[item.title_bordered?'bordered':'']" :style="{color:item.title_color,fontSize:item.title_fontsize+'px',height:item.title_height+'px',lineHeight:item.title_height+'px',borderColor:(page.params.border_color?page.params.border_color:'#fff')}" v-text="item.title"></h3>
          <p class="item-time" v-if="item.date_selector===true" :style="{textAlign:item.horizontal_position,backgroundColor:item.time_background}">
            <ul>
              <li :class="[btn.active?'active':'']" v-for="btn in item.time_condition" v-if="(btn.type === 'week'||btn.type === 'month')" :key="btn.type" v-text="timeNames[btn.type]" @click="selectTime({v_index:index,t_type:btn.type})"></li>
              <li v-for="btn in item.time_condition" v-if="(btn.type !== 'week'&&btn.type !== 'month')" style="padding:0;z-index:100;" :key="btn.type" @click="selectTime({v_index:index,t_type:btn.type})">
                <Date-picker value="[item.start_time,item.end_time]" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="自定义" @on-change="changeTime" style="display:inline-block;width:172px;"></Date-picker>
              </li>
            </ul>
          </p>
          <div class="item-inner-group">
            <div class="item-inner-layer" v-for="(inItem,i) in item.legend_info" :style="{'z-index':(i+1),width:((singleWidth*item.col_num-item.padding_left-item.padding_right)/item.inner_col)*inItem.z_col+1+'px',height:((singleheight*item.row_num-(item.title_show?item.title_height:0)-(item.date_selector?40:0)-item.padding_top-item.padding_bottom)/item.inner_row)*inItem.z_row+'px',top:((singleheight*item.row_num-(item.title_show?item.title_height:0)-(item.date_selector?40:0)-item.padding_top-item.padding_bottom)/item.inner_row)*inItem.offset_row+'px',left:((singleWidth*item.col_num-item.padding_left-item.padding_right)/item.inner_col)*inItem.offset_col-1+'px'}">
              <div class="layer-frame">
                <div class="layer-content" v-if="(/text/.test(inItem.type)&&inItem.options&&inItem.options.style)" :style="inItem.options.style" v-html="decodeURI(inItem.options.text)"></div>
                <div class="layer-content no-back" v-if="(/number/.test(inItem.type)&&inItem.options&&inItem.options.style)" :style="inItem.options.style">
                  <span :class="inItem.options.style.showBorder?'number-text':''" v-for="n in inItem.options.text" :style="(!isNaN(parseInt(n))&&inItem.options.style.showBorder)?{borderColor:inItem.options.style.borderColor,borderWidth:inItem.options.style.borderWidth,borderRadius:inItem.options.style.borderRadius}:{}" v-text="n"></span>
                </div>
                <div class="layer-content" v-else-if="(/image/.test(inItem.type))&&inItem.options&&inItem.options.name" :style="inItem.options.style">
                  <img :width="((inItem.options.setSize=='auto')?'auto':'100%')" :height="(inItem.options.setSize=='auto')?'auto':((singleheight*item.row_num-item.padding_top-item.padding_bottom-(item.title_show?item.title_height:0)-(item.date_selector?40:0))/item.inner_row)*inItem.z_row" :src="(inItem.options.src||require('@/assets/timg.jpg'))" :alt="inItem.options.name">
                </div>
                <div class="layer-content" v-else-if="(/table/.test(inItem.type))">
                  <div class="ivu-table-wrapper">
                    <div class="ivu-table ivu-table-border" v-show="inItem.options&&inItem.options.data">
                      <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                        <thead v-if="inItem.options&&inItem.options.data && inItem.options.data.head && inItem.options.hasHead">
                          <tr>
                            <th :style="[inItem.options.headStyle,{borderColor:inItem.options.borderColor}]" v-for="a in inItem.options.data.head" v-text="a.text">
                            </th>
                          </tr>
                        </thead>
                        <tbody class="ivu-table-tbody" v-if="inItem.options&&inItem.options.data && inItem.options.data.body">
                          <tr class="ivu-table-row" v-for="a in inItem.options.data.body">
                            <td :style="[inItem.options.bodyStyle,{borderColor:inItem.options.borderColor}]" v-for="b in inItem.options.data.head" v-text="a[b.value]">
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="layer-content" v-else-if="(/timestamp/.test(inItem.type))" :ref="inItem.id" :style="inItem.options.style"></div>
                <div class="layer-content js-chart" :class="inItem.id" :style="{width:((singleWidth*item.col_num-item.col_num-4)/item.inner_col)*inItem.z_col+'px',height:((singleheight*item.row_num-item.row_num-4-(item.title_show?item.title_height:0)-(item.date_selector?40:0))/item.inner_row)*inItem.z_row+'px'}" v-else-if="!/text|number|image|table/.test(inItem.type)" :ref="inItem.id">
                    <img width="100%" height="100%" :src="require('@/assets/' + inItem.type + '.png')" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import loading from '@/components/parts/loading.vue'
import { mapGetters, mapActions } from 'vuex'
import { addZero } from 'static/common'
var echarts = require('echarts')
export default {
  data () {
    return {
      width: '',
      height: '',
      loadingTips: '初始化,请稍候...',
      timeNames: {
        'week': '近一周',
        'month': '近一月',
        'time': ''
      },
      primary: {
        color: '#fff',
        backgroundColor: '#2d8cf0',
        borderColor: '#2d8cf0'
      },
      isInit: true
    }
  },
  mounted () {
    this.getList()

    this.setThisSize()
    window.onresize = () => {
      this.setThisSize()
    }
  },
  updated () {
    if (this.isInit) {
      this.resetChartsAndTime(false)
    }
  },
  components: {loading},
  computed: {
    ...mapGetters([
      'page',
      'loading'
    ]),
    singleWidth: function () {
      if (this.width && this.page.params.col_num && !this.isInit) {
        this.resetChartsAndTime(true)
      }
      return (this.width - 1) / this.page.params.col_num
    },
    singleheight: function () {
      if (this.height && this.page.params.row_num && !this.isInit) {
        this.resetChartsAndTime(true)
      }
      return (this.height - 1) / this.page.params.row_num
    }
  },
  methods: {
    ...mapActions([
      'getList',
      'selectTime',
      'changeTime'
    ]),
    setThisSize () {
      this.width = this.$refs.content.offsetWidth
      this.height = this.$refs.content.offsetHeight
    },
    showTime (id) {
      let t = null
      let _this = this
      let fnTime = function () {
        clearTimeout(t)// 清除定时器
        let dt = new Date()
        let y = dt.getFullYear()
        let m = dt.getMonth() + 1
        let d = dt.getDate()
        let h = dt.getHours()
        let mm = dt.getMinutes()
        let s = dt.getSeconds()
        _this.$refs[id][0].innerHTML = y + '-' + addZero(m) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(mm) + ':' + addZero(s)
        t = setTimeout(fnTime, 1000)
      }
      t = setTimeout(fnTime, 1000)
    },
    resetChartsAndTime (isResize) {
      // console.log(1)
      if (this.page.container_info && this.page.container_info.length) {
        this.page.container_info.map((item, index) => {
          if (item.legend_info && item.legend_info.length) {
            item.legend_info.map((item1, index1) => {
              if (this.$refs[item1.id] && item1.options) {
                if (item1.type === 'timestamp' && isResize) {
                  this.showTime(item1.id)// 时间戳组件
                } else {
                  echarts.dispose(this.$refs[item1.id][0])
                  let theme = ''
                  if (this.page.theme.list && this.page.theme.list.length) {
                    this.page.theme.list.map((item, index) => {
                      if (item.id === this.page.params.theme) {
                        let json = JSON.parse(item.json)
                        theme = item.name
                        echarts.registerTheme(theme, json)
                      }
                    })
                  }
                  var myChart = echarts.init(this.$refs[item1.id][0], theme)
                  if (this.$refs[item1.id][0].offsetWidth && this.$refs[item1.id][0].offsetHeight) {
                    this.isInit = false
                    setTimeout(() => {
                      myChart.setOption(item1.options)
                      myChart.resize()
                    }, 500)
                  }
                }
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
.content{
  position: relative;
  height: 100%;
  .item-style{
    position: absolute;
    background-color: transparent;
    overflow: hidden;
    .item-title{
      text-indent:10px;
      overflow: hidden;
    }
    .item-title.bordered{
      border-bottom: 1px solid #ddd;
    }
    .item-time{
      height: 39px;
      line-height: 37px;
      padding: 0 5px;
      ul{
        display: inline-block;
        width: 100%;
        height: 100%;
        li{
          display: inline;
          color: #ccc;
          margin-right: 10px;
          cursor: pointer;
        }
        li.active{
          color: #fff800;
          padding-bottom: 5px;
          border-bottom: 1px solid #fff800;
        }
      }
    }
    .item-top-layer{
      position: relative;
      width: 100%;
      height: 100%;
      .item-inner{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
        .item-inner-group{
          position: relative;
          .item-inner-layer{
            position: absolute;
            background-color: transparent;
            overflow: hidden;
            .layer-frame{
              display: table;
              width: 100%;
              height: 100%;
              .layer-content{
                display: table-cell;
                width: 100%;
                height: 100%;
                word-wrap: break-word;
                word-break: normal;
                .number-text{
                  border:1px solid transparent;
                  margin: 0 3px;
                  padding: 3px;
                }
              }
              .layer-content.no-back{
                background-color: transparent;
              }
            }
          }
          .item-inner-layer.active{
            border-color: orange;
          }
        }
      }
    }
  }
  // .item-style.active{
  //   border-color: red;
  // }
  .ivu-table-wrapper{
    border: none;
    .ivu-table-border td, .ivu-table-border th{
        border-right: none;
    }
  }
  .ivu-table{
    background-color: transparent!important;
    &:before,
    &:after{
      background-color: transparent!important;
    }
    td,th{
      height: auto!important;
      padding:8px 0!important;
      background-color: transparent!important;
    }
  }
}
</style>
<style lang="less">
.item-time{
  input{
    color:#ccc;
    background-color: transparent;
  }
  .ivu-date-picker{
    color:#495060!important;
  }
}
</style>
