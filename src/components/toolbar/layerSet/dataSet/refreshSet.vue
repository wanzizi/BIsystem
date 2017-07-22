<template lang="html">
  <section>
    <Checkbox v-model="isRefresh">是否开启自动刷新</Checkbox>
    <p v-if="isRefresh">
      <Input-number :min="1" v-model="second"></Input-number>&nbsp;&nbsp;秒
    </p>
  </section>
</template>

<script>
export default {
  data () {
    return {
      isRefresh: false,
      second: 0
    }
  }
}
</script>

<style  type="text/less" lang="less" scoped>
</style>
