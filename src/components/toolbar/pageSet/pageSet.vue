<template lang="html">
  <section class="page-setting">
    <Tabs type="card">
        <Tab-pane label="样式设置">
          <page-style></page-style>
        </Tab-pane>
        <Tab-pane label="主题管理">
          <theme></theme>
        </Tab-pane>
    </Tabs>
  </section>
</template>

<script>
import pageStyle from '@/components/toolbar/pageSet/pageStyle.vue'
import theme from '@/components/toolbar/pageSet/theme.vue'
export default {
  data () {
    return {
      value1: '1'
    }
  },
  components: {'page-style': pageStyle, theme}
}
</script>

<style type="text/less" lang="less" scoped>
  @font-size-base:14px;
  .page-setting{
    height: 100%;
    .header{
      height: 40px;
      line-height: 40px;
      color: #2d8cf0;
      font-size: 14px;
      text-align: center;
      background-color: #ddd;
    }
  }
</style>
