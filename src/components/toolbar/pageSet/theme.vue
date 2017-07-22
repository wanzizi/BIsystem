<template lang="html">
  <section class="theme">
    <Modal v-model="deleteModal" width="360">
        <div style="text-align:center;font-size:16px;">
            <p>确认删除?</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long @click="deleteModal=false;remove_theme(deleteId)">删除</Button>
        </div>
    </Modal>
    <h3 class="theme-title">新增主题</h3>
    <Form :model="formItem" :label-width="80">
        <Form-item label="主题名称">
            <Input v-model="formItem.name" placeholder="必填,否则无法上传主题"></Input>
        </Form-item>
        <a href="http://echarts.baidu.com/theme-builder/" style="color:#57a3f3" target="_blank">链接：请先确保主题名称已填写,点击此处生成图表主题</a>
        <p class="red">TIP：点击链接,选择主题,选择“下载主题”->“JSON版本”->“下载”,不可使用“导出配置”</p>
        <div class="theme-upload">
          <Upload v-show="formItem.name" action="/api/cms/material/uploadMaterial" :data="upload.img" :show-upload-list="false" :before-upload="()=>{upload.active='img';imgLoad=true;}" :on-success="handleSuccess" :on-error="handleError">
            <Button type="success" icon="ios-cloud-upload-outline">上传主题缩略图</Button>
            <label for="" v-text="imgFileName"></label>
          </Upload>
          <span class="form-load form-img-load" v-show="imgLoad">
            <loading></loading>
          </span>
        </div>
        <div class="theme-upload">
          <Upload v-show="formItem.name" action="/api/cms/material/uploadMaterial" :data="upload.json" :show-upload-list="false" :before-upload="()=>{upload.active='json';themeLoad=true;}" :on-success="handleSuccess" :on-error="handleError">
            <Button type="info" icon="ios-cloud-upload-outline">上传主题</Button>
            <label for="" v-text="jsonFileName"></label>
          </Upload>
          <span class="form-load" v-show="themeLoad">
            <loading></loading>
          </span>
        </div>
        <Button class="theme-upload-btn" type="primary" @click="uploadTheme" :disabled="((formItem.name&&formItem.url)?false:true)">确认上传主题</Button>
    </Form>
    <h3 class="theme-title">已上传的主题列表</h3>
    <ul v-show="themeList.length">
      <li class="theme-list" v-for="(item,i) in themeList" :key="item.id">
        <span v-text="'名称：'+item.name"></span>
        <Button type="info" size="small" @click="select_theme(item.id)"><i v-show="item.id===page.params.theme" class="ivu-icon ivu-icon-checkmark"></i>选中</Button>
        <Button type="error" size="small" @click="()=>{deleteModal=true;deleteId=item.id}">删除</Button>
        <img :src="item.image||require('@/assets/timg.jpg')" alt="">
      </li>
    </ul>
    <Page v-show="themeList.length" class="theme-page" :total="themeList.length"></Page>
    <p v-show="!themeList.length">暂无主题数据</p>
  </section>
</template>

<script>
import loading from '@/components/parts/loading.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      formItem: {
        url: '',
        name: '',
        image: ''
      },
      imgFileName: '',
      jsonFileName: '',
      imgLoad: false,
      themeLoad: false,
      deleteModal: false,
      deleteId: '',
      upload: {
        active: '',
        img: {
          file: 'img'
        },
        json: {
          file: 'json'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'page'
    ]),
    themeList: function () {
      let arr = []
      if (this.page.theme.list && this.page.theme.list.length) {
        this.page.theme.list.map((item, index) => {
          arr.push(item)
        })
      }
      return arr
    }
  },
  components: {loading},
  methods: {
    ...mapActions([
      'select_theme',
      'add_theme',
      'remove_theme'
    ]),
    uploadTheme () {
      this.add_theme(JSON.parse(JSON.stringify(this.formItem)))
      for (let attr in this.formItem) {
        this.formItem[attr] = ''
      }
      this.imgFileName = ''
      this.jsonFileName = ''
    },
    handleSuccess (response, file, fileList) {
      if (response.data && response.data[0]) {
        switch (this.upload.active) {
          case 'img':
            this.imgLoad = false
            this.imgFileName = file.name
            this.formItem.image = response.data[0].url
            break
          case 'json':
            this.themeLoad = false
            this.jsonFileName = file.name
            this.formItem.url = response.data[0].url
            break
        }
      } else {
        this.$Message.error('无返回值!')
      }
    },
    handleError (response) {
      switch (this.upload.active) {
        case 'img':
          this.imgLoad = false
          break
        case 'json':
          this.themeLoad = false
          break
      }
      this.$Message.error('上传失败!')
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
  .page-setting{
    .red{
      color: red
    }
    .theme{
      padding:0 20px;
      .theme-title{
        margin: 10px 0;
      }
      .theme-upload{
        margin: 10px 0 0;
        .form-load{
          display: inline-block;
          position: relative;
          top: -40px;
          left: 110px;
        }
        .form-load.form-img-load{
          left: 145px;
        }
      }
      .theme-upload-btn{
        margin: 10px 0 0;
      }
      .theme-list{
        margin: 10px 0;
        height: auto!important;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
          display: block;
          margin: 5px 0
        }
      }
      .theme-page{
        margin: 10px 0
      }
    }
  }
</style>
