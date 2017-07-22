<template lang="html">
  <section class="content"  ref="content" :style="{'background-image':'url('+page.params.background_image+')'}">
    <loading v-show="contentLoading" :load-msg="loadingTips"></loading>
    <Modal v-model="deleteModal" width="360">
        <div style="text-align:center;font-size:16px;">
            <p>确认删除?</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="deleteModal=false;remove({type:deleteType,vessel:page.vessel,layer:page.layer,vesselI:page.vesselI,layerI:page.layerI})">删除</Button>
        </div>
    </Modal>
    <div class="row-set" v-for='(r,index) in page.params.row_num' :class="[(((page.params.show_grid===true||page.params.show_grid===false)?page.params.show_grid:true)&&index<(page.params.row_num-1))?'line-row':'']" :style="{height:((height-60-1)/page.params.row_num)+'px'}">
      <div class="col-set" v-for="(c,index1) in page.params.col_num" :class="[((page.params.show_grid===true||page.params.show_grid===false)?page.params.show_grid:true)?'line-col':'']" :style="{width:((width-1)/page.params.col_num)+'px'}"></div>
    </div>
    <div class="item-style" v-for="(item,index) in page.container_info"  @click.stop="selectVessel(index)" :class="{active:page.isVessel&&(item.id==page.vessel)}" :style="{width:(singleWidth*item.col_num+'px'),height:(singleheight*item.row_num+'px'),top:(singleheight*item.offset_row+'px'),left:(singleWidth*item.offset_col+'px'),paddingTop:item.padding_top+'px',paddingBottom:item.padding_bottom+'px',paddingLeft:item.padding_left+'px',paddingRight:item.padding_right+'px'}">
      <div class="item-top-layer">
        <h3 v-show="item.title_show" class="item-title" style="opacity:0" :style="{height:item.title_height+'px'}"></h3>
        <p class="item-time" v-show="item.date_selector"></p>
        <div class="row-set" v-for='(r,index) in item.inner_row' :class="[(((item.grid_show===true||item.grid_show===false)?item.grid_show:true)&&index<(item.inner_row-1)&&(item.id==page.vessel))?'line-row':'']" :style="{height:((singleheight*item.row_num-item.row_num-(item.title_show?item.title_height:0)-(item.date_selector?40:0)-item.padding_top-item.padding_bottom)/item.inner_row)+'px'}">
          <div class="col-set" v-for="(c,index1) in item.inner_col" :class="[((item.grid_show===true||item.grid_show===false)?item.grid_show:true)&&(item.id==page.vessel)?'line-col':'']" :style="{width:((singleWidth*item.col_num-item.col_num-item.padding_left-item.padding_right)/item.inner_col)+'px'}">
          </div>
        </div>
        <div class="item-inner" :style="{width:((((singleWidth-1)*item.col_num-item.padding_left-item.padding_right)>0?((singleWidth-1)*item.col_num-item.padding_left-item.padding_right):0)+'px'),height:(((singleheight*item.row_num-item.padding_top-item.padding_bottom)>0?(singleheight*item.row_num-item.padding_top-item.padding_bottom):0)+'px'),backgroundColor:item.background_color}">
          <h3 v-show="item.title_show" class="item-title" :class="[(item.id==page.vessel?'bordered':'')]" :style="{color:item.title_color,fontSize:item.title_fontsize+'px',height:item.title_height+'px',lineHeight:item.title_height+'px'}" v-text="item.title"></h3>
          <p v-show="item.date_selector" class="item-time" :style="{textAlign:item.horizontal_position,backgroundColor:item.time_background}">
            <ul>
              <li :class="[btn.active?'active':'']" v-for="btn in item.time_condition" v-if="(btn.type === 'week'||btn.type === 'month')" :key="btn.type" v-text="timeNames[btn.type]" @click="selectTime({v_index:index,t_type:btn.type})"></li>
              <li v-for="btn in item.time_condition" v-if="(btn.type !== 'week'&&btn.type !== 'month')" style="padding:0;z-index:100;" :key="btn.type" @click="selectTime({v_index:index,t_type:btn.type})">
                <Date-picker value="[item.start_time,item.end_time]" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="自定义" @on-change="changeTime" style="display:inline-block;width:172px;"></Date-picker>
              </li>
            </ul>
          </p>
          <div class="item-inner-group">
            <div class="item-inner-layer" :class="{active:(item.id==page.vessel&&inItem.id==page.layer&&page.isLayer)}" v-for="(inItem,i) in item.legend_info" @click.stop="selectLayer([index,i])" :style="{'z-index':(i+1),width:((singleWidth*item.col_num-item.col_num-4-item.padding_left-item.padding_right)/item.inner_col)*inItem.z_col+'px',height:((singleheight*item.row_num-item.row_num+2-(item.title_show?item.title_height:0)-(item.date_selector?40:0)-item.padding_top-item.padding_bottom)/item.inner_row)*inItem.z_row+'px',top:((singleheight*item.row_num-(item.title_show?item.title_height:0)-(item.date_selector?40:0)-item.padding_top-item.padding_bottom)/item.inner_row)*inItem.offset_row+'px',left:((singleWidth*item.col_num-item.col_num-item.padding_left-item.padding_right+2)/item.inner_col)*inItem.offset_col+'px'}">
              <div class="layer-frame">
                <div class="layer-content no-back" v-if="(/text/.test(inItem.type)&&inItem.options&&inItem.options.style)" :style="inItem.options.style" v-html="decodeURI(inItem.options.text)"></div>
                <div class="layer-content no-back" v-if="(/number/.test(inItem.type)&&inItem.options&&inItem.options.style)" :style="inItem.options.style">
                  <span :class="inItem.options.style.showBorder?'number-text':''" v-for="n in inItem.options.text" :style="(!isNaN(parseInt(n))&&inItem.options.style.showBorder)?{borderColor:inItem.options.style.borderColor,borderWidth:inItem.options.style.borderWidth,borderRadius:inItem.options.style.borderRadius}:{}" v-text="n"></span>
                </div>
                <div class="layer-content" v-else-if="(/image/.test(inItem.type))&&inItem.options&&inItem.options.name" :style="inItem.options.style">
                  <img :width="((inItem.options.setSize=='auto')?'auto':'100%')" :height="(inItem.options.setSize=='auto')?'auto':((singleheight*item.row_num-item.row_num-item.padding_top-item.padding_bottom-(item.title_show?item.title_height:0)-(item.date_selector?40:0))/item.inner_row)*inItem.z_row" :src="(inItem.options.src||require('@/assets/timg.jpg'))" :alt="inItem.options.name">
                </div>
                <div class="layer-content" v-else-if="(/table/.test(inItem.type))">
                  <div class="ivu-table-wrapper">
                    <div class="ivu-table ivu-table-border" v-show="inItem.options&&inItem.options.data">
                      <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;height:100%">
                        <thead v-if="inItem.options && inItem.options.data && inItem.options.data.head && inItem.options.hasHead">
                          <tr>
                            <th :style="[inItem.options.headStyle,{borderColor:inItem.options.borderColor}]" v-for="a in inItem.options.data.head" v-text="a.text">
                            </th>
                          </tr>
                        </thead>
                        <tbody class="ivu-table-tbody" v-if="inItem.options && inItem.options.data && inItem.options.data.body">
                          <tr class="ivu-table-row" v-for="a in inItem.options.data.body">
                            <td :style="[inItem.options.bodyStyle,{borderColor:inItem.options.borderColor}]" v-for="b in inItem.options.data.head" v-text="a[b.value]">
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p v-show="!(inItem.options&&inItem.options.data)">请先选择数据</p>
                </div>
                <div class="layer-content timestamp-set" v-else-if="(/timestamp/.test(inItem.type))" :ref="inItem.id" :style="inItem.options.style"></div>
                <div class="layer-content" v-else-if="!/text|number|image|table|timestamp/.test(inItem.type)" :ref="inItem.id">
                    <span class="layer-tip">请选择数据,展示的是示例图表！</span>
                    <img width="100%" height="100%" :src="require('@/assets/' + inItem.type + '.png')" alt="">
                </div>
              </div>

              <Button-group class="btn-group"v-show="inItem.id===page.layer">
                <Button icon="arrow-up-b" :disabled="inItem.offset_row===0" @click="topdown([0,-1])"></Button>
                <Button icon="arrow-down-b" :disabled="(item.inner_row-inItem.offset_row-inItem.z_row)===0" @click="topdown([0,1])"></Button>
                <Button icon="arrow-left-b" :disabled="inItem.offset_col===0" @click="leftright([0,-1])"></Button>
                <Button icon="arrow-right-b" :disabled="(item.inner_col-inItem.offset_col-inItem.z_col)===0" @click="leftright([0,1])"></Button>

                <Button icon="arrow-up-c" :disabled="inItem.z_row<2" @click="addrow([0,-1])"></Button>
                <Button icon="arrow-down-c" :disabled="(item.inner_row-inItem.offset_row-inItem.z_row)===0" @click="addrow([0,1])"></Button>
                <Button icon="arrow-left-c" :disabled="inItem.z_col<2" @click="addcol([0,-1])"></Button>
                <Button icon="arrow-right-c" :disabled="(item.inner_col-inItem.offset_col-inItem.z_col)===0" @click="addcol([0,1])"></Button>
                <Button @click="deleteModal=true;deleteType='child'" icon="close-round"></Button>
              </Button-group>
            </div>
          </div>
        </div>

        <Button-group class="btn-group" v-show="item.id==page.vessel&&page.isVessel">
          <Button icon="arrow-up-b" :disabled="item.offset_row===0" @click="topdown([-1,0])"></Button>
          <Button icon="arrow-down-b" :disabled="(page.params.row_num-item.offset_row-item.row_num)===0" @click="topdown([1,0])"></Button>
          <Button icon="arrow-left-b" :disabled="item.offset_col===0" @click="leftright([-1,0])"></Button>
          <Button icon="arrow-right-b" :disabled="(page.params.col_num-item.offset_col-item.col_num)===0" @click="leftright([1,0])"></Button>

          <Button icon="arrow-up-c" :disabled="item.row_num<2" @click="addrow([-1,0])"></Button>
          <Button icon="arrow-down-c" :disabled="(page.params.row_num-item.offset_row-item.row_num)===0" @click="addrow([1,0])"></Button>
          <Button icon="arrow-left-c" :disabled="item.col_num<2" @click="addcol([-1,0])"></Button>
          <Button icon="arrow-right-c" :disabled="(page.params.col_num-item.offset_col-item.col_num)===0" @click="addcol([1,0])"></Button>
          <Button @click="deleteModal=true;deleteType='list'" icon="close-round"></Button>
        </Button-group>
      </div>
    </div>
  </section>
</template>

<script>
import loading from '@/components/parts/loading.vue'
import { mapGetters, mapActions } from 'vuex'
import { addZero } from 'static/common'
var echarts = require('echarts')
var TWEEN = require('@tweenjs/tween.js')
export default {
  props: ['parentCol'],
  data () {
    return {
      width: '',
      height: '',
      singleWidth: '',
      singleheight: '',
      deleteModal: false,
      deleteType: '',
      modal_loading: false,
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
  computed: {
    ...mapGetters([
      'page',
      'contentLoading',
      'chartModify',
      'timeModify'
    ])
  },
  updated () {
    if (this.isInit) {
      this.resetChartsAndTime(false)
    }
  },
  watch: {
    'page.params.col_num': function (val, oldVal) {
      this.singleWidth = (this.width - 1) / this.page.params.col_num
      if (oldVal && this.width && this.page.params.col_num) {
        this.resetChartsAndTime(true)
      }
    },
    'page.params.row_num': function (val, oldVal) {
      this.singleheight = (this.height - 60 - 1) / this.page.params.row_num
      if (oldVal && this.height && this.page.params.row_num) {
        this.resetChartsAndTime(true)
      }
    },
    'page.params.theme': function () {
      if (!this.isInit) {
        this.resetChartsAndTime(true)
      }
    },
    parentCol: function () {
      this.setThisSize()
    },
    chartModify: function (val, oldVal) {
      if (val - oldVal === 1) {
        this.setContChart()
      } else if (val - oldVal) {
        this.resetChartsAndTime(true)
      } else {
        this.setChart()
      }
    },
    timeModify: function (val, oldVal) {
      this.setTime()
    },
    numberModify: {
      deep: true,
      handler: function (newValue, oldValue) {
        var vm = this
        function animate () {
          if (TWEEN.update()) {
            requestAnimationFrame(animate)
          }
        }
        new TWEEN.Tween({ tweeningNumber: newValue.oldVal })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue.newVal }, 500)
        .onUpdate(function () {
          vm.page.container_info[newValue.vId].legend_info[newValue.lId].options.number = this.tweeningNumber.toFixed(0)
        })
        // .onComplete(function () {
        //   cancelAnimationFrame(animationFrame)
        // })
        .start()
        animate()
      }
    }
  },
  components: {loading},
  mounted () {
    this.getList()

    this.setThisSize()
    window.onresize = () => {
      this.setThisSize()
    }
  },
  methods: {
    ...mapActions([
      'getList',
      'selectVessel',
      'selectLayer',
      'topdown',
      'leftright',
      'addrow',
      'addcol',
      'remove',
      'selectTime',
      'changeTime'
    ]),
    setThisSize () {
      this.width = this.$refs.content.offsetWidth
      this.height = this.$refs.content.offsetHeight

      this.singleWidth = (this.width - 1) / this.page.params.col_num
      this.singleheight = (this.height - 60 - 1) / this.page.params.row_num
      if (this.width && this.page.params.col_num && this.height && this.page.params.row_num) {
        this.resetChartsAndTime(false)
      }
    },
    getTheme () {
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
      return theme
    },
    setTime () {
      let layer = this.page.layer
      let thisVessel = this.page.container_info[this.page.vesselI]
      if (thisVessel.legend_info && thisVessel.legend_info.length) {
        let thisLayer = thisVessel.legend_info[this.page.layerI]
        if (layer && this.$refs[layer] && thisLayer.options) {
          this.showTime(layer)
        }
      }
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
    setChart () { // 某个容器内某个chart重载
      // console.log('set')
      let theme = this.getTheme()
      let layer = this.page.layer
      let thisVessel = this.page.container_info[this.page.vesselI]
      if (thisVessel.legend_info && thisVessel.legend_info.length) {
        let thisLayer = thisVessel.legend_info[this.page.layerI]
        if (layer && this.$refs[layer] && thisLayer.options) {
          echarts.dispose(this.$refs[layer][0])
          this.$refs[layer][0].style.width = ((this.singleWidth * thisVessel.col_num) / thisVessel.inner_col) * thisLayer.z_col + 'px'
          this.$refs[layer][0].style.height = ((this.singleheight * thisVessel.row_num) / thisVessel.inner_row) * thisLayer.z_row - (thisVessel.title_show ? thisVessel.title_height : 0) - (thisVessel.date_selector ? 40 : 0) + 'px'
          var myChart = echarts.init(this.$refs[layer][0], theme || '')
          if (this.$refs[layer][0].style.width && this.$refs[layer][0].style.height) {
            setTimeout(() => {
              myChart.setOption(thisLayer.options)
              myChart.resize()
            }, 500)
          }
        }
      }
    },
    setContChart () { // 某个容器内的所有chart重载
      // console.log('setCon')
      let theme = this.getTheme()
      let thisVessel = this.page.container_info[this.page.vesselI]
      if (thisVessel.legend_info && thisVessel.legend_info.length) {
        thisVessel.legend_info.map((item, index) => {
          if (this.$refs[item.id] && item.options) {
            echarts.dispose(this.$refs[item.id][0])
            this.$refs[item.id][0].style.width = ((this.singleWidth * thisVessel.col_num) / thisVessel.inner_col) * item.z_col + 'px'
            this.$refs[item.id][0].style.height = ((this.singleheight * thisVessel.row_num) / thisVessel.inner_row) * item.z_row - (thisVessel.title_show ? thisVessel.title_height : 0) - (thisVessel.date_selector ? 40 : 0) + 'px'
            var myChart = echarts.init(this.$refs[item.id][0], theme || '')
            if (this.$refs[item.id][0].style.width && this.$refs[item.id][0].style.height) {
              setTimeout(() => {
                myChart.setOption(item.options)
                myChart.resize()
              }, 500)
            }
          }
        })
      }
    },
    resetChartsAndTime (isResize) { // 整个页面所有的chart重载
      // console.log('re')
      let theme = this.getTheme()
      if (this.page.container_info && this.page.container_info.length) {
        this.page.container_info.map((item, index) => {
          if (item.legend_info && item.legend_info.length) {
            item.legend_info.map((item1, index1) => {
              if (this.$refs[item1.id] && item1.options) {
                if (item1.type === 'timestamp' && !isResize && this.$refs[item1.id][0]) {
                  this.showTime(item1.id)
                } else {
                  echarts.dispose(this.$refs[item1.id][0])
                  var myChart = echarts.init(this.$refs[item1.id][0], theme || '')
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
    width: 100%;
    height: 100%;
    overflow: hidden;
    .line-row{
      border-bottom: 1px solid #ddd;
    }
    .line-col{
      border-right: 1px solid #ddd;
    }
    .row-set{
      overflow: hidden;
    }
    .col-set{
      float: left;
      height: 100%;
    }
    .item-style{
      position: absolute;
      border: 2px dotted #ccc;
      border-radius: 3px;
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
              border:2px dashed transparent;
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
                  .layer-tip{
                    position: absolute;
                    color: #999;
                  }
                  .number-text{
                    border:1px solid transparent;
                    margin: 0 3px;
                    padding: 3px;
                  }
                }
                .layer-content.no-back{
                  background-color: transparent;
                }
                .layer-content.timestamp-set{
                  padding: 0 5px;
                }
              }
              .btn-group{
                top: 0;
                right: 0;
                display: none;
                button{
                  padding:0 3px;
                }
              }
              &:hover{
                .btn-group{
                  display: block;
                }
              }
            }
            .item-inner-layer.active{
              border:2px dashed orange!important;
            }
          }
        }
        .btn-group{
          z-index: 100;
          position: absolute;
          bottom: 0;
          right: 0;
          button{
            padding:1px 5px;
            opacity: .8
          }
        }
      }
    }
    .item-style.active{
      border-color: red;
      .item-inner-layer{
        border:2px dashed #ccc!important;
      }
    }
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
