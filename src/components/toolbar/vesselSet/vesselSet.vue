<template lang="html">
  <section class="text-setting">
    <Tabs type="card">
        <Tab-pane label="样式设置">
          <vessel-style></vessel-style>
        </Tab-pane>
        <Tab-pane label="图层顺序">
          <layer-sort></layer-sort>
        </Tab-pane>
    </Tabs>
  </section>
</template>

<script>
import vesselStyle from '@/components/toolbar/vesselSet/vesselStyle.vue'
import layerSort from '@/components/toolbar/vesselSet/layerSort.vue'
export default {
  data () {
    return {
    }
  },
  components: {'vessel-style': vesselStyle, 'layer-sort': layerSort}
}
</script>

<style  type="text/less" lang="less" scoped>
  @font-size-base:14px;
  .text-setting{
    height: 100%;
  }
</style>
