<template lang="html">
  <Form class="form" :model="formItem" :label-width="80">
    <Modal v-model="deleteModal" width="360">
        <div style="text-align:center;font-size:16px;">
            <p>确认删除?</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long @click="deleteModal=false;formItem[removeType]='';remove_file(removeType)">删除</Button>
        </div>
    </Modal>
    <Form-item label="页面中文名">
        <Input v-model="formItem.cn_name" placeholder="页面中文名称"></Input>
        <p v-show="cnNameTip" class="error-tip">长度不能超过50！</p>
    </Form-item>
    <Form-item label="页面英文名">
        <Input v-model="formItem.en_name" placeholder="页面英文名称"></Input>
        <p v-show="enNameTip" class="error-tip">长度不能超过50,不包含非英文数字字符!</p>
    </Form-item>
    <Form-item label="图表类型">
        <Select v-model="formItem.type" placeholder="请选择">
            <Option value="t1">类型一</Option>
            <Option value="t2">类型二</Option>
            <Option value="t3">类型三</Option>
        </Select>
    </Form-item>
    <label class="form-label">创建网格设置--</label>
    <Form-item label="行数">
        <Input-number :min="1" v-model="formItem.row_num" @on-change="changePageRow"></Input-number>
    </Form-item>
    <Form-item label="列数">
        <Input-number :min="1" v-model="formItem.col_num" @on-change="changePageCol"></Input-number>
    </Form-item>
    <Form-item label="显示网格">
      <i-switch v-model="formItem.show_grid">
        <Icon type="android-done" slot="open"></Icon>
        <Icon type="android-close" slot="close"></Icon>
      </i-switch>
    </Form-item>
    <Form-item class="form-color" label="演示时页面统一显示边框颜色">
        <Input class="input-error" v-model="formItem.border_color.hex" placeholder="颜色值,格式为#111111"></Input>
        <p v-show="borderColorTip" class="error-tip">颜色格式不正确!</p>
        <chrome-picker v-model="formItem.border_color"></chrome-picker>
    </Form-item>
    <Form-item label="背景图" style="height:40px;margin-bottom:0">
      <Upload action="/api/cms/material/uploadMaterial" :data="{file: 'img'}" :show-upload-list="false" :before-upload="()=>{imgLoad=true}" :on-success="handleSuccess" :on-error="handleError">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
      </Upload>
      <span class="form-load" v-show="imgLoad">
        <loading></loading>
      </span>
    </Form-item>
    <Form-item label="" v-show="formItem.background_image&&formItem.background_image!=='null'">
     <Tag type="border" closable color="blue" @on-close="deleteModal=true;removeType='background_image';">图片已上传</Tag>
    </Form-item>
  </Form>
</template>

<script>
import loading from '@/components/parts/loading.vue'
import { mapGetters, mapActions } from 'vuex'
import { Chrome } from 'vue-color'
import { rgbaTransform, colorHex, getLength, engAndNumber } from 'static/common'
export default {
  data () {
    return {
      formItem: {
        id: '',
        cn_name: '',
        en_name: '',
        type: '',
        row_num: 4,
        col_num: 3,
        show_grid: true,
        border_color: {
          hex: '#fff',
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          }
        },
        theme: '',
        background_image: ''
      },
      loadingTips: '加载中,请稍候...',
      imgLoad: false,
      deleteModal: false,
      removeType: '',
      upload: '',
      flag: true,
      cnNameTip: false,
      enNameTip: false,
      borderColorTip: false
    }
  },
  computed: {
    ...mapGetters([
      'page',
      'loading',
      'pageNotModify'
    ])
  },
  components: {loading, 'chrome-picker': Chrome},
  mounted () {
    this.initPage()
  },
  watch: {
    'page.params.id': function () {
      this.initPage()
    },
    'pageNotModify': function () {
      for (let attr in this.pageNotModify) {
        this.formItem[attr] = this.page.params[attr]
      }
    },
    'formItem.cn_name': function () {
      if (getLength(this.formItem.cn_name) > 50) {
        this.flag = false
        this.cnNameTip = true
      } else {
        this.flag = true
        this.cnNameTip = false
      }
    },
    'formItem.en_name': function () {
      if (getLength(this.formItem.en_name) > 50) {
        this.flag = false
        this.enNameTip = true
      } else {
        this.flag = true
        this.enNameTip = false
      }
      if (!engAndNumber(this.formItem.en_name)) {
        this.flag = false
        this.enNameTip = true
      } else {
        this.flag = true
        this.enNameTip = false
      }
    },
    'formItem.border_color': {
      deep: true,
      handler: function (val, oldVal) {
        if (this.formItem.border_color.hex && !colorHex(this.formItem.border_color.hex)) {
          this.flag = false
          this.borderColorTip = true
        } else {
          this.flag = true
          this.borderColorTip = false
          this.change_page({
            border_color: `rgba(${this.formItem.border_color.rgba.r},${this.formItem.border_color.rgba.g},${this.formItem.border_color.rgba.b},${this.formItem.border_color.rgba.a})`
          })
        }
      }
    },
    formItem: {
      deep: true,
      handler: function (val, oldVal) {
        if (this.flag) {
          let obj = {}
          for (let attr in this.formItem) {
            if (!/border_color/.test(attr)) {
              obj[attr] = this.formItem[attr]
            }
          }
          this.change_page(obj)
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'change_page',
      'remove_file'
    ]),
    initPage () {
      for (var attr in this.formItem) {
        if (/border_color/.test(attr)) {
          if (this.page.params[attr] && this.page.params[attr].length > 7) { // rgba格式颜色
            this.formItem[attr] = rgbaTransform(this.page.params[attr])
          }
        } else {
          this.formItem[attr] = this.page.params[attr]
        }
      }
    },
    changePageRow (value) {
      this.formItem.row_num = value
    },
    changePageCol (value) {
      this.formItem.col_num = value
    },
    handleSuccess (response, file, fileList) {
      this.imgLoad = false
      if (response.data && response.data[0]) {
        this.formItem.background_image = response.data[0].url
      } else {
        this.$Message.error('无返回值!')
      }
    },
    handleError (response) {
      this.imgLoad = false
      this.$Message.error('上传失败!')
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
  @font-size-base:14px;
  .page-setting{
    .form{
      height: 100%;
      margin: 0 auto;
      padding: 20px;
      .form-label{
        display: inline-block;
        font-size: @font-size-base+1;
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
    .ivu-form-item{
      margin-bottom: 18px;
    }
    .form-load{
      display: inline-block;
      position: relative;
      top: -47px;
      left: 110px;
    }
    .vue-color__chrome{
      width: 100%
    }
    .error-tip{
      color:red;
      line-height: 1;
      margin-top: 5px;
    }
  }
</style>
