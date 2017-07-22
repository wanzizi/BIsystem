<template lang="html">
  <section class="style-setting">
    <!--<Modal
        v-model="modal1"
        title="请选择数据筛选时间段"
        @on-ok="ok"
        @on-cancel="cancel">
        <Date-picker :value="times" format="yyyy-MM-dd" @on-change="changeDate" type="daterange" placement="bottom-end" placeholder="选择日期"></Date-picker>
    </Modal>-->
    <Form class="form" :model="formItem" :label-width="80">
      <Collapse v-model="value1" accordion>
         <Panel name="1">
             容器标题
             <p slot="content">
               <Form-item label="是否显示">
                 <i-switch v-model="formItem.title_show">
                   <Icon type="android-done" slot="open"></Icon>
                   <Icon type="android-close" slot="close"></Icon>
                 </i-switch>
               </Form-item>
               <Form-item label="标题行高">
                   <Input-number :min="1" :max="100" v-model="formItem.title_height" @on-change="changeHeight"></Input-number>
               </Form-item>
               <Form-item label="字体大小">
                   <Input-number :min="1" v-model="formItem.title_fontsize" @on-change="changeFontSize"></Input-number>
               </Form-item>
               <Form-item label="标题内容">
                   <Input v-model="formItem.title" placeholder="标题内容" @on-change="changeTitle"></Input>
                   <p v-show="titleTip" class="error-tip">长度不能超过15！</p>
               </Form-item>
               <Form-item class="form-color" label="文本颜色">
                   <Input class="input-error" style="margin-bottom:10px" v-model="formItem.title_color.hex" placeholder="颜色值,格式为#111111"></Input>
                   <p v-show="titleColorTip" class="error-tip">颜色格式不正确!</p>
                   <slider-picker v-model="formItem.title_color"></slider-picker>
               </Form-item>
             </p>
         </Panel>
         <Panel name="2">
             容器内网格
             <p slot="content">
               <Form-item label="行数">
                   <Input-number :min="1" v-model="formItem.inner_row" @on-change="changePageRow"></Input-number>
               </Form-item>
               <Form-item label="列数">
                   <Input-number :min="1" v-model="formItem.inner_col" @on-change="changePageCol"></Input-number>
               </Form-item>
               <Form-item label="显示网格">
                 <i-switch v-model="formItem.grid_show" @on-change="isShowLine">
                   <Icon type="android-done" slot="open"></Icon>
                   <Icon type="android-close" slot="close"></Icon>
                 </i-switch>
               </Form-item>
             </p>
         </Panel>
         <Panel name="5">
           容器内边距设置
           <p slot="content">
             <Form-item label="上边距">
               <Input-number :min="0" v-model="formItem.padding_top" @on-change="changePaddingTop"></Input-number>
             </Form-item>
             <Form-item label="下边距">
               <Input-number :min="0" v-model="formItem.padding_bottom" @on-change="changePaddingBottom"></Input-number>
             </Form-item>
             <Form-item label="左边距">
               <Input-number :min="0" v-model="formItem.padding_left" @on-change="changePaddingLeft"></Input-number>
             </Form-item>
             <Form-item label="右边距">
               <Input-number :min="0" v-model="formItem.padding_right" @on-change="changePaddingRight"></Input-number>
             </Form-item>
           </p>
         </Panel>
         <Panel name="6">
           演示时容器边框设置
           <p slot="content">
             <Form-item label="显示标题边框">
               <i-switch v-model="formItem.title_bordered">
                 <Icon type="android-done" slot="open"></Icon>
                 <Icon type="android-close" slot="close"></Icon>
               </i-switch>
             </Form-item>
             <Form-item label="显示容器上边框">
               <i-switch v-model="formItem.border_top">
                 <Icon type="android-done" slot="open"></Icon>
                 <Icon type="android-close" slot="close"></Icon>
               </i-switch>
             </Form-item>
             <Form-item label="显示容器下边框">
               <i-switch v-model="formItem.border_bottom">
                 <Icon type="android-done" slot="open"></Icon>
                 <Icon type="android-close" slot="close"></Icon>
               </i-switch>
             </Form-item>
             <Form-item label="显示容器左边框">
               <i-switch v-model="formItem.border_left">
                 <Icon type="android-done" slot="open"></Icon>
                 <Icon type="android-close" slot="close"></Icon>
               </i-switch>
             </Form-item>
             <Form-item label="显示容器右边框">
               <i-switch v-model="formItem.border_right">
                 <Icon type="android-done" slot="open"></Icon>
                 <Icon type="android-close" slot="close"></Icon>
               </i-switch>
             </Form-item>
           </p>
         </Panel>
         <Panel name="3">
             背景设置
             <p slot="content">
               <Form-item class="form-common" label="背景颜色">
                   <Input v-model="formItem.background_color.hex" placeholder="颜色值,格式为#111111"></Input>
                   <p v-show="backColorTip" class="error-tip">颜色格式不正确!</p>
                   <chrome-picker v-model="formItem.background_color"></chrome-picker>
               </Form-item>
             </p>
         </Panel>
         <Panel name="4">
             日期筛选器
             <p slot="content">
               <Form-item class="form-common" label="是否启用">
                 <i-switch v-model="formItem.date_selector">
                   <Icon type="android-done" slot="open"></Icon>
                   <Icon type="android-close" slot="close"></Icon>
                 </i-switch>
               </Form-item>
               <Form-item class="form-common" label="日期格式">
                 <Checkbox-group v-model="formItem.time_condition">
                    <Checkbox label="week">
                      <Tag type="dot" color="blue">近一周</Tag>
                    </Checkbox>
                    <Checkbox label="month">
                      <Tag type="dot" color="green">近一月</Tag>
                    </Checkbox>
                    <Checkbox label="time">
                    	<Tag type="dot" color="yellow">自定义</Tag>
                      <!--<input type="text" style="display:inline-block;width:88%;" :value="((formItem.start_time && formItem.end_time)?(formItem.start_time+'-'+formItem.end_time):'')" placeholder="选择日期" class="ivu-input" @focus="modal1=true">-->
                    </Checkbox>
                </Checkbox-group>
               </Form-item>
               <Form-item class="form-common" label="水平位置">
                   <Radio-group v-model="formItem.horizontal_position">
                     <Radio label="left">居左</Radio>
                     <Radio label="center">居中</Radio>
                     <Radio label="right">居右</Radio>
                   </Radio-group>
               </Form-item>
               <Form-item class="form-common" label="背景颜色">
                   <Input v-model="formItem.time_background.hex" placeholder="颜色值,格式为#111111"></Input>
                   <p v-show="timeBackTip" class="error-tip">颜色格式不正确!</p>
                   <chrome-picker v-model="formItem.time_background"></chrome-picker>
               </Form-item>
                 <!-- <Form-item class="form-common" label="垂直位置">
                     <Radio-group v-model="formItem.vertical_position">
                         <Radio label="top">居上</Radio>
                         <Radio label="middle">居中</Radio>
                         <Radio label="bottom">居下</Radio>
                     </Radio-group>
                 </Form-item> -->
             </p>
         </Panel>
     </Collapse>
    </Form>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Slider, Chrome } from 'vue-color'
import { rgbaTransform, colorHex, getLength } from 'static/common'
export default {
  data () {
    return {
      value1: '1',
      formItem: {
        title_color: {
          hex: '#194d33'
        },
        title_bordered: false,
        title_show: true,
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
        start_time: '',
        end_time: '',
        background_color: {
          hex: '',
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          }
        },
        date_selector: true,
        time_condition: [],
        time_background: {
          hex: '',
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          }
        },
        horizontal_position: 'center',
        vertical_position: 'middle',
        padding_top: 0,
        padding_bottom: 0,
        padding_left: 0,
        padding_right: 0
      },
      times: ['2016-01-01', '2016-02-15'],
      isInit: false,
      modal1: false,
      titleTip: false,
      titleColorTip: false,
      backColorTip: false,
      timeBackTip: false,
      flag: true
    }
  },
  mounted () {
    this.initForm()
  },
  computed: {
    ...mapGetters([
      'page'
    ])
  },
  watch: {
    'formItem.title': function () {
      if (getLength(this.formItem.title) > 30) {
        this.flag = false
        this.titleTip = true
      } else {
        this.flag = true
        this.titleTip = false
      }
    },
    'formItem.title_color.hex': function () {
      if (this.formItem.title_color.hex && !colorHex(this.formItem.title_color.hex)) {
        this.flag = false
        this.titleColorTip = true
      } else {
        this.flag = true
        this.titleColorTip = false
      }
    },
    'formItem.background_color': {
      deep: true,
      handler: function (val, oldVal) {
        if (this.formItem.background_color.hex && !colorHex(this.formItem.background_color.hex)) {
          this.flag = false
          this.backColorTip = true
        } else {
          this.flag = true
          this.backColorTip = false
          this.change_vessel({
            background_color: `rgba(${this.formItem.background_color.rgba.r},${this.formItem.background_color.rgba.g},${this.formItem.background_color.rgba.b},${this.formItem.background_color.rgba.a})`
          })
        }
      }
    },
    'formItem.time_background': {
      deep: true,
      handler: function (val, oldVal) {
        if (this.formItem.time_background.hex && !colorHex(this.formItem.time_background.hex)) {
          this.flag = false
          this.timeBackTip = true
        } else {
          this.flag = true
          this.timeBackTip = false
          this.change_vessel({
            time_background: `rgba(${this.formItem.time_background.rgba.r},${this.formItem.time_background.rgba.g},${this.formItem.time_background.rgba.b},${this.formItem.time_background.rgba.a})`
          })
        }
      }
    },
    formItem: {
      deep: true,
      handler: function (val, oldVal) {
        if (!this.isInit && this.flag) {
          let obj = {}
          for (let attr in this.formItem) {
            if (!/background_color|time_background/.test(attr)) { obj[attr] = this.formItem[attr] }
          }
          obj.title_color = this.formItem.title_color.hex
          obj.time_condition = []
          if (this.formItem.time_condition && this.formItem.time_condition.length) {
            this.formItem.time_condition.map((item, index) => {
              obj.time_condition.push({
                type: item,
                active: false
              })
            })
          }
          this.change_vessel(obj)
        } else {
          this.isInit = false
        }
      }
    },
    'page.vessel': function () {
      this.isInit = true
      this.initForm()
    }
  },
  components: {'slider-picker': Slider, 'chrome-picker': Chrome},
  methods: {
    ...mapActions([
      'change_vessel'
    ]),
    // ok () {
    //   this.formItem.start_time = this.times[0]
    //   this.formItem.end_time = this.times[1]
    // },
    // cancel () {},
    changeDate (val) {
      this.times = val
    },
    initForm () {
      if (!isNaN(this.page.vesselI) && this.page.container_info[this.page.vesselI]) {
        let obj = this.page.container_info[this.page.vesselI]
        if (obj.background_color) {
          this.formItem.background_color = rgbaTransform(obj.background_color)
        }
        if (obj.time_background) {
          this.formItem.time_background = rgbaTransform(obj.time_background)
        }
        this.formItem.time_condition = []
        if (obj.time_condition && obj.time_condition.length) {
          obj.time_condition.map((item, index) => {
            this.formItem.time_condition.push(item.type)
          })
        }
        this.formItem.title_color.hex = (obj.title_color && obj.title_color !== 'undefined') ? obj.title_color : ''
        for (let attr in this.formItem) {
          if (!/background_color|time_condition|title_color|time_background/.test(attr)) {
            this.formItem[attr] = obj[attr]
          }
        }
      }
    },
    changeTitle (ev) {
      this.title = ev.target.value
    },
    changeHeight (value) {
      this.formItem.title_height = value
    },
    changeFontSize (value) {
      this.formItem.title_fontsize = value
    },
    changePaddingTop (value) {
      this.formItem.paddingTop = value
    },
    changePaddingBottom (value) {
      this.formItem.paddingBottom = value
    },
    changePaddingLeft (value) {
      this.formItem.paddingLeft = value
    },
    changePaddingRight (value) {
      this.formItem.paddingRight = value
    },
    isShowLine (value) {
      this.formItem.grid_show = value
    },
    changePageRow (value) {
      this.formItem.inner_row = value
    },
    changePageCol (value) {
      this.formItem.inner_col = value
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
  .text-setting{
    height: 100%;
    .ivu-form-item{
      margin-bottom: 10px;
    }
    .vue-color__slider,
    .vue-color__chrome{
      width: 100%
    }
    .error-tip{
      color:red;
      line-height: 1;
      margin: 2px 0;
    }
  }
</style>
