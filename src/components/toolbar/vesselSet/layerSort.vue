<template lang="html">
  <ul class="layer-list">
    <p class="red">tips：越往下排序,层级越高</p>
    <li class="layer-item" v-if="page.container_info && page.container_info[page.vesselI] && page.container_info[page.vesselI].legend_info && page.container_info[page.vesselI].legend_info.length" v-for="(item,index) in page.container_info[page.vesselI].legend_info" :key="item.id" :data-id="item.id">
      <span class="layer-link" v-text="item.type+' ('+(/text|number/.test(item.type)?(decodeURI(item.options.text).substring(0,10)+'...'):'')+(/image/.test(item.type)?(item.options.name.substring(0,10)+'...'):'')+((!/text|number|image/.test(item.type))?('编号:'+item.sort):'')+')'" @click="toLayer({id:item.id,index:index})"></span>
      <span class="arrows">
        <i class="icon-style ivu-icon ivu-icon-arrow-up-c" v-show="index!==0" @click="changeSort([-1,index])"></i>
        <i class="icon-style ivu-icon ivu-icon-arrow-down-c" v-show="index!==page.container_info[page.vesselI].legend_info.length-1" @click="changeSort([1,index])"></i>
      </span>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'page'
    ])
  },
  methods: {
    ...mapActions([
      'changeSort',
      'toLayer'
    ])
  }
}
</script>

<style  type="text/less" lang="less" scoped>
  .text-setting{
    .layer-list{
      .red{
        color: red
      }
      padding: 0 12px;
      li{
        font-size:14px;
        padding: 5px;
        &:hover{
          background-color: #eaf4fe
        }
        .layer-link{
          cursor: pointer;
        }
        .arrows{
          float: right;
          .ivu-icon{
            float:right;
            font-size:18px;
            cursor: pointer;
          }
          .ivu-icon-arrow-up-c{
            margin-left:10px;
          }
        }

      }
    }
  }
</style>
