<template lang="html">
  <section class="text-setting">
    <Tabs type="card">
        <Tab-pane class="data-set" label="数据绑定">
          <sql-set></sql-set>
          <section class="data-axis">
            <label class="label-set" for="">X轴</label>
            <Select v-model="select.selectX">
                <Option v-for="a in select.x" :value="a" :key="a"></Option>
            </Select>
            <label class="label-set" for="">Y轴</label>
            <Select v-model="select.selectY">
                <Option v-for="b in select.y" :value="b" :key="b"></Option>
            </Select>
            <label class="label-set" for="">图例</label>
            <Select v-model="select.selectLegend">
                <Option v-for="b in select.legend" :value="b" :key="b"></Option>
            </Select>
          </section>
          <refresh-set></refresh-set>
          <Button class="preview-btn" type="primary" @click="getData">预览</Button>
        </Tab-pane>
        <Tab-pane label="样式设置">
          <Collapse v-model="value2" accordion>
              <Panel name="1">
                  标题设置
                  <p slot="content">
                    <Form class="form" :model="form.title" :label-width="80">
                      <Form-item label="显示标题">
                        <i-switch v-model="form.title.show">
                          <Icon type="android-done" slot="open"></Icon>
                          <Icon type="android-close" slot="close"></Icon>
                        </i-switch>
                      </Form-item>
                      <Form-item label="标题内容">
                          <Input v-model="form.title.text" placeholder="标题内容"></Input>
                      </Form-item>
                      <Form-item label="字体大小">
                         <Input-number :max="100" :min="1" v-model="form.title.textStyle.fontSize"></Input-number>
                      </Form-item>
                      <Form-item label="字体粗细">
                          <Radio-group v-model="form.title.textStyle.fontWeight">
                              <Radio label="normal">普通</Radio>
                              <Radio label="bold">加粗</Radio>
                          </Radio-group>
                      </Form-item>
                    </Form>
                  </p>
              </Panel>
              <Panel name="2">
                  图例设置
                  <p slot="content">
                    <Form class="form" :model="form.legend" :label-width="80">
                      <Form-item label="显示图例">
                        <i-switch v-model="form.legend.show">
                          <Icon type="android-done" slot="open"></Icon>
                          <Icon type="android-close" slot="close"></Icon>
                        </i-switch>
                      </Form-item>
                      <Form-item class="form-common" label="分布方式">
                          <Radio-group v-model="form.legend.orient">
                              <Radio label="horizontal">水平分布</Radio>
                              <Radio label="vertical">垂直分布</Radio>
                          </Radio-group>
                      </Form-item>
                      <Form-item class="form-common" label="水平位置">
                          <Radio-group v-model="form.legend.left">
                              <Radio label="left">居左</Radio>
                              <Radio label="center">居中</Radio>
                              <Radio label="right">居右</Radio>
                          </Radio-group>
                      </Form-item>
                      <Form-item class="form-common" label="垂直位置">
                          <Radio-group v-model="form.legend.top">
                              <Radio label="top">居上</Radio>
                              <Radio label="middle">居中</Radio>
                              <Radio label="bottom">居下</Radio>
                          </Radio-group>
                      </Form-item>
                    </Form>
                  </p>
              </Panel>
          </Collapse>

        </Tab-pane>
    </Tabs>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import sqlSet from '@/components/toolbar/layerSet/dataSet/sqlSet'
import refreshSet from '@/components/toolbar/layerSet/dataSet/refreshSet'
export default {
  data () {
    return {
      value2: '1',
      form: {
        title: {
          show: false,
          text: '',
          textStyle: {
            // color: '',
            fontSize: 12,
            fontWeight: 'normal'
          }
        },
        legend: {
          show: true,
          orient: 'horizontal',
          left: 'center',
          top: 'top'
        }
      },
      select: {
        x: [],
        selectX: '',
        y: [],
        selectY: '',
        legend: [],
        selectLegend: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'page'
    ])
  },
  mounted () {
    this.chartInit()
  },
  watch: {
    form: {
      deep: true,
      handler: function (val, oldVal) {
        this.getChart({legend: this.form.legend, title: this.form.title, type: this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].type})
      }
    },
    'page.layer': function () {
      this.chartInit()
    }
  },
  components: {'sql-set': sqlSet, 'refresh-set': refreshSet},
  methods: {
    ...mapActions([
      'getChart'
    ]),
    chartInit () {
      if (this.page && this.page.container_info && this.page.container_info.length && this.page.container_info[this.page.vesselI].legend_info && this.page.container_info[this.page.vesselI].legend_info.length && this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options) {
        let obj = this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options
        for (let attr in obj.legend) {
          this.form.legend[attr] = obj.legend[attr]
        }
        for (let attr in obj.title) {
          this.form.title[attr] = obj.title[attr]
        }
      }
    },
    getData () {
      if (this.sql) {
        this.getChart({legend: this.legend, type: this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].type})
      } else {
        this.$Message.error('请先选择数据!')
      }
    }
  }
}
</script>

<style  type="text/less" lang="less" scoped>
  @font-size-base:14px;
  .text-setting{
    height: 100%;
    .data-set{
      padding: 0 15px;
      .data-axis{
        margin: 15px 0;
        .label-set{
          display: inline-block;
          font-size: 14px;
          margin: 5px 0;
        }
      }
      .preview-btn{
        margin-top: 10px;
      }
    }
    .ivu-form-item{
      margin-bottom: 10px;
    }
  }
</style>
