<template lang="html">
  <section class="index" >
    <loading v-show="loading" :load-msg="loadingTips"></loading>
    <app-header></app-header>
    <Row class="common-set">
        <Col class="common-set" :span="contentCol">
          <app-content :parent-col="contentCol"></app-content>
        </Col>
        <app-breadcrumb :class="[(!isClose)?'ivu-col-span-5':'']" v-on:changecol="baseChildChangeCol" v-show="!isClose"></app-breadcrumb>
        <Col class="common-set toolvar-set" :span="toolbarCol" v-show="!isClose">
          <loading v-show="sidebarLoading" :load-msg="loadingTips"></loading>
          <router-view></router-view>
        </Col>
        <Col class="common-set toolvar-set" :span="toolbarCol" v-show="isClose">
          <header class="header">
            <i class="header-icon ivu-icon ivu-icon-chevron-left" @click="baseChildChangeCol"></i>
          </header>
        </Col>
    </Row>
  </section>
</template>

<script>
import appHeader from '@/components/parts/header.vue'
import appContent from '@/components/parts/content.vue'
import appBreadcrumb from '@/components/parts/breadcrumb.vue'
import loading from '@/components/parts/loading.vue'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      isClose: false,
      contentCol: 19,
      toolbarCol: 5,
      standard: 5,
      loadingTips: '加载中...'
    }
  },
  computed: {
    ...mapGetters([
      'loading',
      'sidebarLoading'
    ])
  },
  components: {appHeader, appContent, appBreadcrumb, loading},
  methods: {
    baseChildChangeCol: function (opt) {
      this.isClose = !this.isClose
      if (this.toolbarCol !== this.standard) {
        this.toolbarCol = this.standard
      } else {
        this.toolbarCol = 1
      }
      this.contentCol = 24 - this.toolbarCol
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
  @media screen and (max-width: 990px) {
    .index {
        width: 990px;
        overflow-x: scroll;
    }
  }
  .index{
    min-width: 990px;
    height: 100%;
    background-color: #f5f5f5;
    .common-set{
      height: 100%;
    }
    .toolvar-set{
      background-color: #fff;
      .page-setting,
      .text-setting{
        padding-bottom: 85px;
        overflow-y: auto;
      }
    }
    .header{
      height: 40px;
      line-height: 40px;
      color: #2d8cf0;
      font-size: 14px;
      text-align: center;
      background-color: #ddd;
      .header-icon{
        cursor: pointer;
      }
    }
  }
</style>
