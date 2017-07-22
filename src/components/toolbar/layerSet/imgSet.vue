<template lang="html">
  <section class="text-setting">
    <Form class="img" :label-width="80">
      <Form-item label="图片上传">
        <Upload
        action="/api/cms/material/uploadMaterial" :data="imgType" :before-upload="()=>{loading=true}" :show-upload-list="false"
        :on-success="handleSuccess"
        :on-error="handleError">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
        </Upload>
        <span class="form-load" v-show="loading">
          <loading></loading>
        </span>
      </Form-item>
      <Form-item label="图片名称" v-show="img.name&&!loading">
        <label for="" v-text="img.name"></label>
      </Form-item>
      <Form-item label="图片显示">
        <Radio-group v-model="img.setSize" @on-change="sizeChange">
          <Radio label="auto">原图大小</Radio>
          <Radio label="full">拉伸</Radio>
        </Radio-group>
      </Form-item>
      <Form-item class="form-common" label="水平位置">
          <Radio-group v-model="img.style.textAlign" @on-change="textAlignChange">
              <Radio label="left">居左</Radio>
              <Radio label="center">居中</Radio>
              <Radio label="right">居右</Radio>
          </Radio-group>
      </Form-item>
      <Form-item class="form-common" label="垂直位置">
          <Radio-group v-model="img.style.verticalAlign" @on-change="verticalChange">
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
import loading from '@/components/parts/loading.vue'
export default {
  data () {
    return {
      img: {
        src: '',
        name: '',
        setSize: 'full',
        style: {
          textAlign: 'center',
          verticalAlign: 'middle'
        }
      },
      imgType: {
        file: 'img'
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'page'
    ])
  },
  components: {loading},
  mounted () {
    this.getImg()
  },
  watch: {
    page: {
      deep: true,
      handler: function (val, oldVal) {
        this.getImg()
      }
    },
    'page.layer': function () {
      this.getImg()
    }
  },
  methods: {
    ...mapActions([
      'imgChange'
    ]),
    getImg () {
      if (this.page.container_info && this.page.container_info.length && this.page.container_info[this.page.vesselI].legend_info && this.page.container_info[this.page.vesselI].legend_info[this.page.layerI] && this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options) {
        this.img = JSON.parse(JSON.stringify(this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options))
      }
    },
    sizeChange (value) {
      this.imgChange({setSize: value})
    },
    textAlignChange (value) {
      this.imgChange({
        style: {
          textAlign: value,
          verticalAlign: this.img.style.verticalAlign
        }
      })
    },
    verticalChange (value) {
      this.imgChange({
        style: {
          textAlign: this.img.style.textAlign,
          verticalAlign: value
        }
      })
    },
    handleSuccess (response, file) {
      this.loading = false
      if (response.data && response.data[0]) {
        this.imgChange({src: response.data[0].url, name: file.name})
      } else {
        this.$Message.error('无返回值!')
      }
    },
    handleError (res, file) {
      this.loading = false
      this.$Message.error('请求失败!')
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
  @font-size-base:14px;
  .text-setting{
    height: 100%;
    border-top: 1px solid #ddd;
    padding: 10px 0;
    .ivu-form-item{
      margin-bottom: 10px;
    }
    .form-load{
      display: inline-block;
      position: relative;
      top: -47px;
      left: 110px;
    }
  }
</style>
