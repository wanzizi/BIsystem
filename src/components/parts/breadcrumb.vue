<template lang="html">
  <Breadcrumb class="breadcrumb-set">
      <Breadcrumb-item v-for="(item,index) in showPath" :href="(index === showPath.length-1)?'':item.lastHref" :key="item.href">{{item.name}}</Breadcrumb-item>
      <i class="header-icon header-icon-right ivu-icon ivu-icon-chevron-right" @click="changecol"></i>
  </Breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      paths: [
        {
          href: '/page',
          id: this.$route.params.id,
          name: '页面设置',
          lastHref: '/page/' + this.$route.params.id
        },
        {
          href: '/vessel',
          id: this.$route.params.v_id ? this.$route.params.v_id : '',
          name: '容器设置',
          lastHref: ''
        },
        {
          list: [
            {
              href: '/chart',
              id: this.$route.params.l_id ? this.$route.params.l_id : '',
              name: '图表设置'
            },
            {
              href: '/text',
              id: this.$route.params.l_id ? this.$route.params.l_id : '',
              name: '文本设置'
            },
            {
              href: '/image',
              id: this.$route.params.l_id ? this.$route.params.l_id : '',
              name: '图片设置'
            },
            {
              href: '/table',
              id: this.$route.params.l_id ? this.$route.params.l_id : '',
              name: '表格设置'
            },
            {
              href: '/number',
              id: this.$route.params.l_id ? this.$route.params.l_id : '',
              name: '数值设置'
            },
            {
              href: '/timestamp',
              id: this.$route.params.l_id ? this.$route.params.l_id : '',
              name: '时间戳设置'
            }
          ]
        }
      ],
      showPath: [
      ]
    }
  },
  computed: {
    ...mapGetters([
      'page'
    ])
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.matched[1].path === '/page/:id') {
        this.$store.dispatch('routeChange', 'page')
      } else if (this.$route.matched[1].path === '/page/:id/vessel') {
        this.$store.dispatch('routeChange', 'vessel')
      }
    },
    page: {
      handler: function (val, oldVal) {
        this.changeRoute()
      },
      deep: true
    }
  },
  methods: {
    changecol: function () {
      this.$emit('changecol')
    },
    changeRoute: function () {
      this.showPath = []
      this.showPath.push(this.paths[0])
      this.$router.replace({path: '/page/' + this.$route.params.id})

      if (this.page.container_info && this.page.container_info.length && this.page.isVessel) {
        this.$router.replace({path: '/page/' + this.$route.params.id + '/vessel'})
        this.paths[1].lastHref = this.paths[0].lastHref + this.paths[1].href
        this.showPath.push(this.paths[1])
      }
      if (this.page.container_info && this.page.container_info.length && this.page.container_info[this.page.vesselI] && this.page.isVessel && this.page.container_info[this.page.vesselI].legend_info && this.page.container_info[this.page.vesselI].legend_info.length && this.page.container_info[this.page.vesselI].legend_info[this.page.layerI] && this.page.isLayer) {
        let type = this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].type
        let sendType = ''
        for (var i = 0; i < this.paths[2].list.length; i++) {
          if (this.paths[2].list[i].href === '/' + type) {
            sendType = this.paths[2].list[i].href
            this.showPath.push(this.paths[2].list[i])
            break
          }
        }
        if (!sendType) {
          sendType = this.paths[2].list[0].href
          this.showPath.push(this.paths[2].list[0])
        }
        this.$router.replace({path: '/page/' + this.$route.params.id + sendType})
      }
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
  .breadcrumb-set{
    padding-left: 5px;
    background-color: #fff;
    span{
      display: inline-block;
      padding: 8px 0;
    }
    .header-icon{
      cursor: pointer;
    }
    .header-icon.header-icon-right{
      float: right;
      margin: 10px 10px 0 0;
    }
  }
</style>
