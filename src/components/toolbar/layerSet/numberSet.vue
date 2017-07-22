<template lang="html">
  <section class="text-setting">
    <Tabs type="card">
        <Tab-pane class="data-set" label="数据绑定">
          <sql-set></sql-set>
          <section class="data-axis">
            <label class="label-set" for="">字段</label>
            <Select v-model="select.field">
                <Option v-for="a in select.fields" :value="a" :key="a"></Option>
            </Select>
          </section>
          <refresh-set></refresh-set>
          <Button class="preview-btn" type="primary" @click="getData">预览</Button>
        </Tab-pane>
        <Tab-pane label="样式设置">
          <Form class="form" :model="formItem" :label-width="80">
            <Collapse v-model="value1" accordion>
              <Panel name="1">
                  内容设置
                  <p slot="content">
                    <Form-item label="显示千分号">
                      <i-switch v-model="formItem.showPermil">
                        <Icon type="android-done" slot="open"></Icon>
                        <Icon type="android-close" slot="close"></Icon>
                      </i-switch>
                    </Form-item>
                    <Form-item class="form-color" label="文本颜色">
                        <Input style="margin-bottom:10px;" v-model="formItem.color.hex" placeholder="颜色值,格式为#111111"></Input>
                        <p v-show="fontColorTip" class="error-tip">颜色格式不正确!</p>
                        <slider-picker v-model="formItem.color"></slider-picker>
                    </Form-item>
                    <Form-item class="form-common" label="字体大小">
                        <Input-number :min="1" v-model="formItem.fontSize"></Input-number>
                    </Form-item>
                    <Form-item class="form-common" label="字体粗细">
                        <Radio-group v-model="formItem.fontWeight">
                            <Radio label="normal">普通</Radio>
                            <Radio label="bold">加粗</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item class="form-common" label="水平位置">
                        <Radio-group v-model="formItem.textAlign">
                            <Radio label="left">居左</Radio>
                            <Radio label="center">居中</Radio>
                            <Radio label="right">居右</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item class="form-common" label="垂直位置">
                        <Radio-group v-model="formItem.verticalAlign">
                            <Radio label="top">居上</Radio>
                            <Radio label="middle">居中</Radio>
                            <Radio label="bottom">居下</Radio>
                        </Radio-group>
                    </Form-item>
                  </p>
              </Panel>
              <Panel name="2">
                  边框设置
                  <p slot="content">
                    <Form-item label="显示数值边框">
                      <i-switch v-model="formItem.showBorder">
                        <Icon type="android-done" slot="open"></Icon>
                        <Icon type="android-close" slot="close"></Icon>
                      </i-switch>
                    </Form-item>
                    <Form-item class="form-color" label="边框颜色">
                        <Input style="margin-bottom:10px;" v-model="formItem.borderColor.hex" placeholder="颜色值,格式为#111111"></Input>
                        <p v-show="borderColorTip" class="error-tip">颜色格式不正确!</p>
                        <slider-picker v-model="formItem.borderColor"></slider-picker>
                    </Form-item>
                    <Form-item class="form-common" label="边框粗细">
                        <Input-number :min="1" :max="10" v-model="formItem.borderWidth"></Input-number>
                    </Form-item>
                    <Form-item class="form-common" label="边框弧度">
                        <Input-number :min="1" :max="50" v-model="formItem.borderRadius"></Input-number>
                    </Form-item>
                  </p>
              </Panel>
            </Collapse>
          </Form>
        </Tab-pane>
    </Tabs>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Slider } from 'vue-color'
import sqlSet from '@/components/toolbar/layerSet/dataSet/sqlSet'
import refreshSet from '@/components/toolbar/layerSet/dataSet/refreshSet'
import { colorHex } from 'static/common'
export default {
  data () {
    return {
      value1: '1',
      formItem: {
        number: 100000,
        showPermil: false,
        color: {
          hex: '#194d33'
        },
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'center',
        verticalAlign: 'middle',
        showBorder: false,
        borderColor: {
          hex: '#194d33'
        },
        borderWidth: 2,
        borderRadius: 4
      },
      select: {
        field: '',
        fields: []
      },
      fontColorTip: false,
      borderColorTip: false
    }
  },
  computed: {
    ...mapGetters([
      'page'
    ])
  },
  components: {'slider-picker': Slider, 'sql-set': sqlSet, 'refresh-set': refreshSet},
  mounted () {
    this.numberInit()
  },
  watch: {
    'formItem.color.hex': function () {
      if (this.formItem.color.hex && !colorHex(this.formItem.color.hex)) {
        this.flag = false
        this.fontColorTip = true
      } else {
        this.flag = true
        this.fontColorTip = false
      }
    },
    'formItem.borderColor.hex': function () {
      if (this.formItem.borderColor.hex && !colorHex(this.formItem.borderColor.hex)) {
        this.flag = false
        this.borderColorTip = true
      } else {
        this.flag = true
        this.borderColorTip = false
      }
    },
    formItem: {
      deep: true,
      handler: function (val, oldVal) {
        if (this.flag) {
          let settings = {
            number: this.formItem.number,
            text: this.formItem.showPermil ? this.addCommas(this.formItem.number) : this.formItem.number,
            showPermil: this.formItem.showPermil,
            style: {
              color: this.formItem.color.hex,
              fontSize: this.formItem.fontSize + 'px',
              borderColor: this.formItem.borderColor.hex,
              borderWidth: this.formItem.borderWidth + 'px',
              borderRadius: this.formItem.borderRadius + 'px'
            }
          }
          for (let attr in this.formItem) {
            if (!/showPermil|color|fontSize|borderColor|borderWidth|borderRadius/.test(attr)) {
              settings.style[attr] = this.formItem[attr]
            }
          }
          this.number_change(settings)
        }
      }
    },
    'page.layer': function () {
      this.numberInit()
    }
  },
  methods: {
    ...mapActions([
      'number_change'
    ]),
    numberInit () {
      if (this.page.container_info && this.page.container_info.length && this.page.container_info[this.page.vesselI].legend_info && this.page.container_info[this.page.vesselI].legend_info.length && this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options) {
        let obj = this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options
        if (obj && Object.keys(obj).length) {
          this.formItem.number = obj.number
          this.formItem.showPermil = obj.showPermil
          this.formItem.color.hex = obj.style.color
          this.formItem.fontSize = parseInt(obj.style.fontSize)
          this.formItem.borderColor.hex = obj.style.borderColor
          this.formItem.borderWidth = parseInt(obj.style.borderWidth) ? parseInt(obj.style.borderWidth) : 0
          this.formItem.borderRadius = parseInt(obj.style.borderRadius) ? parseInt(obj.style.borderRadius) : 0

          for (let attr in obj.style) {
            if (!/number|color|fontSize|borderColor|borderWidth|borderRadius/.test(attr)) {
              this.formItem[attr] = obj.style[attr]
            }
          }
        }
      }
    },
    getData () {

    },
    addCommas (val) {
      if (val) {
        while (/(\d+)(\d{3})/.test(val.toString())) {
          val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2')
        }
        return val
      }
    }
  }
}
</script>

<style  type="text/less" lang="less" scoped>
  @font-size-base:14px;
  .text-setting{
    height: 100%;
    .form{
      padding-right: 10px;
    }
    .data-set{
      padding: 0 15px;
      .data-axis{
        margin: 15px 0;
        .label-set{
          display: inline-block;
          font-size: 14px;
          margin: 5px 0;
        }
      }
      .preview-btn{
        margin-top: 10px;
      }
    }
    .ivu-form-item{
      margin-bottom: 10px;
    }
    .vue-color__slider{
      width: 100%
    }
    .error-tip{
      color:red;
      line-height: 1;
      margin-bottom: 5px;
    }
  }
</style>
