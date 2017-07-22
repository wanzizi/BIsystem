<template lang="html">
  <section class="text-setting">
    <Form class="form" :model="formItem" :label-width="80">
        <Form-item class="form-common" label="文本内容">
           <Input v-model="formItem.value" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
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
    </Form>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Slider } from 'vue-color'
import { colorHex } from 'static/common'
export default {
  data () {
    return {
      value1: '1',
      formItem: {
        value: '请输入文本',
        color: {
          hex: '',
          rgba: {
            r: 25,
            g: 77,
            b: 51,
            a: 1
          }
        },
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'center',
        verticalAlign: 'middle',
        backColor: {
          hex: '',
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          }
        }
      },
      fontColorTip: false,
      backColorTip: false
    }
  },
  components: {'slider-picker': Slider},
  computed: {
    ...mapGetters([
      'page'
    ])
  },
  mounted () {
    this.textInit()
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
    formItem: {
      deep: true,
      handler: function (val, oldVal) {
        if (this.flag) {
          let sendSetting = {
            text: encodeURI(this.formItem.value),
            style: {
              color: this.formItem.color.hex,
              fontSize: this.formItem.fontSize + 'px'
            }
          }
          for (let attr in this.formItem) {
            if (!/value|color|fontSize|backColor/.test(attr)) {
              sendSetting.style[attr] = this.formItem[attr]
            }
          }
          this.text_change(sendSetting)
        }
      }
    },
    'page.layer': function () {
      this.textInit()
    }
  },
  methods: {
    ...mapActions([
      'text_change'
    ]),
    textInit () {
      if (this.page.container_info && this.page.container_info.length && this.page.container_info[this.page.vesselI].legend_info && this.page.container_info[this.page.vesselI].legend_info.length && this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options) {
        let obj = this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options
        if (obj && Object.keys(obj).length) {
          this.formItem.value = decodeURI(obj.text)
          this.formItem.color.hex = obj.style.color
          this.formItem.fontSize = parseInt(obj.style.fontSize) ? parseInt(obj.style.fontSize) : 0

          for (let attr in obj.style) {
            if (!/value|color|fontSize/.test(attr)) {
              this.formItem[attr] = obj.style[attr]
            }
          }
        }
      }
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
  @font-size-base:14px;
  .text-setting{
    height: 100%;
    border-top: 1px solid #ddd;
    padding: 10px 10px 0 0;
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
