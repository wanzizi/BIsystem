<template lang="html">
  <Spin fix>
      <Icon type="load-c" size=22 class="demo-spin-icon-load"></Icon>
      <div v-text="loadMsg"></div>
  </Spin>
</template>

<script>
export default {
  props: ['loadMsg']
}
</script>

<style  type="text/less" lang="less" scoped>
  .ivu-spin-fix {
    z-index: 108;
  }
  .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
      height: 100px;
      position: relative;
      border: 1px solid #eee;
  }
</style>
