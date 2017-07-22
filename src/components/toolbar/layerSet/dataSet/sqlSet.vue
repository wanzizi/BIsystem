<template lang="html">
  <section>
    <label class="sql-text" for="">查询SQL</label>
    <Input v-model="sql" type="textarea" :autosize="{minRows: 7,maxRows: 16}" placeholder="请输入..."></Input>
    <Button class="sql-btn" type="primary" :loading="sqlLoading" @click="getSql">
        <span v-if="!sqlLoading">查询</span>
        <span v-else>Loading...</span>
    </Button>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      sql: ''
    }
  },
  computed: {
    ...mapGetters([
      'sqlLoading'
    ])
  },
  methods: {
    ...mapActions([
      'getData'
    ]),
    getSql () {
      if (this.sql) {
        this.getData({sql: this.sql})
      } else {
        this.$Message.error('请输入sql语句!')
      }
    }
  }
}
</script>

<style  type="text/less" lang="less" scoped>
  .sql-text{
    display: inline-block;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .sql-btn{
    margin-top: 10px;
  }
</style>
