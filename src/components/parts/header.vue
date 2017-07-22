<template lang="html">
  <section>
    <Modal v-model="confirmModal" width="360">
        <div style="text-align:center;font-size:16px;">
            <p>确认保存并预览?</p>
        </div>
        <div slot="footer">
            <Button type="info" size="large" long :loading="modal_loading" @click="save">确认</Button>
        </div>
    </Modal>
    <Menu mode="horizontal" :theme="theme1" active-name="1" @on-open-change="openSubMenu" @on-select="selectMenu">
      <Menu-item v-for="(item,index) in showMenu" v-if="!item.children" :name="(index+1)" :key="(index+1)">
        <Icon :type="item.icon"></Icon>
        {{item.name}}
      </Menu-item>
      <Submenu v-else :name="(index+1)" :key="(index+1)">
        <template :slot="item.slot">
          <Icon :type="item.icon"></Icon>
          {{item.name}}
        </template>
        <Menu-group v-for="subItem in item.children" :title="subItem.name" :key="subItem.name">
          <Menu-item v-for="(listItem,listIndex) in subItem.list" :name="(index+1)+'-'+listItem.index" :ref="listItem.ref" :key="listItem.ref">{{listItem.name}}</Menu-item>
        </Menu-group>
      </Submenu>

      <Button class="button-set" type="success">发布</Button>
      <Button class="button-set" type="primary" @click=""><router-link :to="'/preview/'+id" style="color:#fff">预览</router-link></Button>
      <Button class="button-set" type="info" @click="confirmModal=true">保存</Button>

      <div class="preview-tooltip" :style="tipLocation" v-show="isShowTooltip" v-bind:key="tipLocation">
        <img :src="toolTipImage" alt="">
      </div>
      <loading v-show="headLoading" :load-msg="loadingTips"></loading>
    </Menu>
  </section>
</template>
<script>
import loading from '@/components/parts/loading.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      id: this.$route.params.id,
      theme1: 'light',
      chartMune: [
        {
          type: 'vessel',
          icon: 'ios-paper',
          name: '新增容器'
        },
        {
          type: 'chart',
          icon: 'stats-bars',
          name: '新增图表',
          slot: 'title',
          children: [
            {
              name: '柱状图',
              list: [
                {
                  index: '1',
                  ref: 'bar',
                  name: '标准柱状图'
                },
                {
                  index: '2',
                  ref: 'pileBar',
                  name: '堆叠柱状图'
                },
                {
                  index: '3',
                  ref: 'transverseBar',
                  name: '横向条形图'
                },
                {
                  index: '4',
                  ref: 'transversePileBar',
                  name: '横向堆叠条形图'
                }
              ]
            },
            {
              name: '折线图',
              list: [
                {
                  index: '5',
                  ref: 'line',
                  name: '标准折线图'
                },
                {
                  index: '6',
                  ref: 'pileLine',
                  name: '堆积折线图'
                }
              ]
            },
            {
              name: '饼图',
              list: [
                {
                  index: '7',
                  ref: 'pie',
                  name: '标准饼图'
                },
                {
                  index: '8',
                  ref: 'circlePie',
                  name: '环形饼图'
                },
                {
                  index: '9',
                  ref: 'rosePie',
                  name: '玫瑰图'
                }
              ]
            },
            {
              name: '仪表板',
              list: [
                {
                  index: '10',
                  ref: 'dashboard',
                  name: '标准仪表板'
                },
                {
                  index: '11',
                  ref: 'mutiDashboard',
                  name: '多仪表板'
                }
              ]
            },
            {
              name: '地图',
              list: [
                {
                  index: '12',
                  ref: 'migration',
                  name: '迁徙图'
                },
                {
                  index: '13',
                  ref: 'thermodynamic',
                  name: '热力图'
                }
              ]
            }
          ]
        },
        {
          type: 'text',
          icon: 'ios-list-outline',
          name: '新增文本'
        },
        {
          type: 'image',
          icon: 'image',
          name: '新增图片'
        },
        {
          type: 'table',
          icon: 'ios-grid-view',
          name: '新增表格'
        },
        {
          type: 'number',
          icon: 'drag',
          name: '新增数值'
        },
        {
          type: 'timestamp',
          icon: 'clock',
          name: '新增时间戳'
        }
      ],
      tipLocation: {
        top: 0,
        left: 0
      },
      showMenu: [],
      isShowTooltip: false,
      toolTipImage: '',
      loadingTips: '正在创建,请稍候...',
      confirmModal: false,
      modal_loading: false
    }
  },
  computed: {
    ...mapGetters([
      'page',
      'headLoading'
    ])
  },
  watch: {
    page: {
      deep: true,
      handler: function (val, oldVal) {
        this.showMenu = []
        if (this.page.container_info && this.page.container_info.length) {
          this.showMenu = this.chartMune
        } else {
          this.showMenu.push(this.chartMune[0])
        }
      }
    }
  },
  mounted () {
    if (this.page.container_info && this.page.container_info.length) {
      this.showMenu = this.chartMune
    } else {
      this.showMenu.push(this.chartMune[0])
    }
  },
  components: {loading},
  methods: {
    ...mapActions([
      'addPart'
    ]),
    openSubMenu (name) {
      let openMenu = this.chartMune[name[0] - 1]
      if (openMenu && openMenu.children && openMenu.children.length) {
        openMenu.children.map((item, index) => {
          item.list.map((subItem, subIndex) => {
            this.$refs[subItem.ref][0].$el.onmouseenter = (ev) => {
              this.tipLocation.top = 60 + ev.target.offsetTop + 'px'
              this.tipLocation.left = ev.target.parentNode.parentNode.parentNode.parentNode.offsetLeft + ev.target.offsetWidth + 10 + 'px'
              this.toolTipImage = require('@/assets/' + subItem.ref + '.png')
              this.isShowTooltip = true
            }
            this.$refs[subItem.ref][0].$el.onmouseleave = () => {
              this.isShowTooltip = false
            }
          })
        })
      }
    },
    selectMenu (name) {
      let nameArr, sendType

      if (isNaN(name)) {
        nameArr = name.split('-')
      }
      if (nameArr && nameArr.length) {
        this.chartMune[parseInt(nameArr[0]) - 1].children.map((item, index) => {
          item.list.map((item1, index1) => {
            if (nameArr[1] === item1.index) {
              sendType = this.chartMune[parseInt(nameArr[0]) - 1].children[index].list[index1].ref
            }
          })
        })
      } else {
        sendType = this.chartMune[name - 1].type
      }
      if (name !== 1) {
        if (this.page.isVessel) {
          this.addPart({name: name, type: sendType, vessel: this.page.vessel, vesselArr: this.page.container_info, row: this.page.params.row_num, col: this.page.params.col_num})
        } else {
          this.$Message.error('请先选择一个容器!')
        }
      } else {
        this.addPart({name: name, type: sendType, vessel: this.page.vessel, vesselArr: this.page.container_info, row: this.page.params.row_num, col: this.page.params.col_num})
      }
    },
    save () {
      this.confirmModal = false
      let detail = {}
      for (var attr in this.page.params) {
        if (attr !== 'create_time' && attr !== 'modified_time') { detail[attr] = this.page.params[attr] }
      }
      detail.container_info = JSON.parse(JSON.stringify(this.page.container_info))
      detail.container_info.map((item, index) => {
        delete item.create_time
        delete item.modified_time
        if (item.time_condition && Object.keys(item.time_condition).length) {
          item.time_condition = JSON.stringify(item.time_condition)
        } else {
          item.time_condition = ''
        }
        if (item.legend_info && item.legend_info.length) {
          item.legend_info.map((item1, index1) => {
            delete item1.create_time
            delete item1.modified_time
            if (item1.options && Object.keys(item1.options).length) {
              item1.options = JSON.stringify(item1.options)
            } else {
              item1.options = ''
            }
          })
        }
      })
      this.$http.post('/api/screen/saveAll', detail)
      .then((response) => {
        if (response.data.success) {
          this.$Message.success('保存成功!')
//        this.$router.replace({path: '/preview/' + this.id})
        } else {
          this.$Message.error(response.data.message)
        }
      })
      .catch((error) => {
        console.log(error)
        this.$Message.error('请求失败!')
      })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
  .narrow-common(@setLeft,@setColor){
    content: '';
    position: absolute;
    top: 15px;
    left: @setLeft;
    width: 0;
    height: 0;
    border-width: 8px 8px 8px 0;
    border-color:transparent @setColor transparent transparent;
    border-style:dashed;
  }
  .button-set{
    float: right;
    margin: 13px 10px 0 0;
  }
  .preview-tooltip{
    &:before {
	    .narrow-common(-9px,#e9e9e9);
    }
    &:after {
    	.narrow-common(-7px,#fff);
    }
  	z-index:102;
  	position: absolute;
  	padding: 4px;
  	border: 1px solid #ddd;
  	background: #fff;
    line-height: 1;
    img{
      max-width: 115px;
      max-height: 90px;
    }
  }
  .ivu-menu-submenu{
    z-index: 101!important;
  }
</style>
