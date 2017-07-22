<template lang="html">
  <section class="text-setting">
    <Tabs type="card">
        <Tab-pane class="data-set" label="数据绑定">
          <sql-set></sql-set>
          <section class="data-axis" v-for="(item,index) in select">
            <label class="label-set" for="" v-text="item.name||'第'+(index+1)+'列'"></label>
            <Select v-model="item.value">
                <Option v-for="a in item.list" :value="a" :key="a"></Option>
            </Select>
          </section>
          <refresh-set></refresh-set>
          <Button class="preview-btn" type="primary" @click="getData">预览</Button>
        </Tab-pane>
        <Tab-pane label="样式设置">
          <Form class="form" ref="formItem" :model="formItem" :label-width="80">
            <Collapse accordion v-model="value1">
              <Panel name="4">
                  表格设置
                  <p slot="content">
                    <Form-item class="form-common" label="边框颜色">
                      <Input style="margin-bottom:10px;" v-model="formItem.borderColor.hex" placeholder="颜色值,格式为#111111"></Input>
                      <p v-show="borderColorTip" class="error-tip">颜色格式不正确!</p>
                      <chrome-picker v-model="formItem.borderColor"></chrome-picker>
                    </Form-item>
                  </p>
              </Panel>
              <Panel name="1">
                  表头
                  <p slot="content">
                    <Form-item label="显示表头">
                      <i-switch v-model="formItem.hasHead">
                        <Icon type="android-done" slot="open"></Icon>
                        <Icon type="android-close" slot="close"></Icon>
                      </i-switch>
                    </Form-item>
                    <Form-item class="form-common" label="字体大小">
                        <Input-number :min="1" v-model="formItem.headStyle.fontSize"></Input-number>
                    </Form-item>
                    <Form-item class="form-color" label="字体颜色">
                        <Input style="margin-bottom:10px;" v-model="formItem.headStyle.color.hex" placeholder="颜色值,格式为#111111"></Input>
                        <p v-show="headColorTip" class="error-tip">颜色格式不正确!</p>
                        <slider-picker v-model="formItem.headStyle.color"></slider-picker>
                    </Form-item>
                    <Form-item class="form-common" label="字体粗细">
                        <Radio-group v-model="formItem.headStyle.fontWeight">
                            <Radio label="normal">普通</Radio>
                            <Radio label="bold">加粗</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item class="form-common" label="对齐方式">
                        <Radio-group v-model="formItem.headStyle.textAlign">
                          <Radio label="left">居左</Radio>
                          <Radio label="center">居中</Radio>
                            <Radio label="right">居右</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item class="form-common" label="背景颜色">
                      <Input style="margin-bottom:10px;" v-model="formItem.headStyle.backgroundColor.hex" placeholder="颜色值,格式为#111111"></Input>
                      <p v-show="headBackTip" class="error-tip">颜色格式不正确!</p>
                      <chrome-picker v-model="formItem.headStyle.backgroundColor"></chrome-picker>
                    </Form-item>
                  </p>
              </Panel>
              <Panel name="2">
                  单元格
                  <p slot="content">
                    <Form-item class="form-common" label="字体大小">
                        <Input-number :min="1" v-model="formItem.bodyStyle.fontSize"></Input-number>
                    </Form-item>
                    <Form-item class="form-color" label="字体颜色">
                        <Input style="margin-bottom:10px;" v-model="formItem.bodyStyle.color.hex" placeholder="颜色值,格式为#111111"></Input>
                        <p v-show="bodyColorTip" class="error-tip">颜色格式不正确!</p>
                        <slider-picker v-model="formItem.bodyStyle.color"></slider-picker>
                    </Form-item>
                    <Form-item class="form-common" label="字体粗细">
                        <Radio-group v-model="formItem.bodyStyle.fontWeight">
                            <Radio label="normal">普通</Radio>
                            <Radio label="bold">加粗</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item class="form-common" label="对齐方式">
                        <Radio-group v-model="formItem.bodyStyle.textAlign">
                          <Radio label="left">居左</Radio>
                          <Radio label="center">居中</Radio>
                            <Radio label="right">居右</Radio>
                        </Radio-group>
                    </Form-item>
                  </p>
              </Panel>
              <Panel name="3">
                  分页
                  <p slot="content">
                    <Form-item label="每页条数">
                      <Input-number :min="1" :max="50" v-model="formItem.pageSize"></Input-number>
                    </Form-item>
                    <Form-item label="显示分页">
                      <i-switch v-model="formItem.hasPage">
                        <Icon type="android-done" slot="open"></Icon>
                        <Icon type="android-close" slot="close"></Icon>
                      </i-switch>
                    </Form-item>
                  </p>
              </Panel>
            </Collapse>
          </Form>
        </Tab-pane>
    </Tabs>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import sqlSet from '@/components/toolbar/layerSet/dataSet/sqlSet'
import refreshSet from '@/components/toolbar/layerSet/dataSet/refreshSet'
import { Slider, Chrome } from 'vue-color'
import { rgbaTransform, colorHex } from 'static/common'
export default {
  data () {
    return {
      value1: '1',
      formItem: {
        hasHead: true,
        borderColor: {
          hex: '#194d33',
          rgba: {
            r: 25,
            g: 77,
            b: 51,
            a: 0
          }
        },
        headStyle: {
          fontSize: 12,
          color: {
            hex: '#194d33'
          },
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: {
            hex: '#194d33',
            rgba: {
              r: 25,
              g: 77,
              b: 51,
              a: 0
            }
          }
        },
        bodyStyle: {
          fontSize: 12,
          color: {
            hex: '#194d33'
          },
          fontWeight: 'bold',
          textAlign: 'center'
        },
        hasPage: false,
        pageSize: 1,
        data: {
          head: [
            {
              text: '姓名',
              value: 'name'
            },
            {
              text: '性别',
              value: 'sex'
            },
            {
              text: '地址',
              value: 'addr'
            }
          ],
          body: [
            {
              name: '叶子',
              sex: '女',
              addr: '杭州'
            },
            {
              name: '叶子',
              sex: '女',
              addr: '杭州'
            }
          ]
        }
      },
      select: [
        {
          name: '',
          value: '',
          list: []
        }
      ],
      flag: true,
      headColorTip: false,
      bodyColorTip: false,
      headBackTip: false,
      borderColorTip: false
    }
  },
  computed: {
    ...mapGetters([
      'page'
    ])
  },
  mounted () {
    this.tableInit()
  },
  watch: {
    'formItem.headStyle.color.hex': function () {
      if (this.formItem.headStyle.color.hex && !colorHex(this.formItem.headStyle.color.hex)) {
        this.flag = false
        this.headColorTip = true
      } else {
        this.flag = true
        this.headColorTip = false
      }
    },
    'formItem.bodyStyle.color.hex': function () {
      if (this.formItem.bodyStyle.color.hex && !colorHex(this.formItem.bodyStyle.color.hex)) {
        this.flag = false
        this.bodyColorTip = true
      } else {
        this.flag = true
        this.bodyColorTip = false
      }
    },
    'formItem.headStyle.backgroundColor': {
      deep: true,
      handler: function (val, oldVal) {
        if (this.formItem.headStyle.backgroundColor.hex && !colorHex(this.formItem.headStyle.backgroundColor.hex)) {
          this.flag = false
          this.headBackTip = true
        } else {
          this.flag = true
          this.headBackTip = false
        }
      }
    },
    'formItem.borderColor': {
      deep: true,
      handler: function (val, oldVal) {
        if (this.formItem.borderColor.hex && !colorHex(this.formItem.borderColor.hex)) {
          this.flag = false
          this.borderColorTip = true
        } else {
          this.flag = true
          this.borderColorTip = false
        }
      }
    },
    formItem: {
      deep: true,
      handler: function (val, oldVal) {
        if (this.flag) {
          this.getTable(JSON.parse(JSON.stringify(this.formItem)))
        }
      }
    },
    'page.layer': function () {
      this.tableInit()
    }
  },
  components: {'slider-picker': Slider, 'chrome-picker': Chrome, 'sql-set': sqlSet, 'refresh-set': refreshSet},
  methods: {
    ...mapActions([
      'getTable'
    ]),
    tableInit () {
      if (this.page.container_info && this.page.container_info.length && this.page.container_info[this.page.vesselI].legend_info && this.page.container_info[this.page.vesselI].legend_info.length && this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options) {
        let obj = JSON.parse(JSON.stringify(this.page.container_info[this.page.vesselI].legend_info[this.page.layerI].options))
        if (obj && Object.keys(obj).length) {
          obj.borderColor = rgbaTransform(obj.borderColor)
          obj.headStyle.fontSize = parseInt(obj.headStyle.fontSize)
          obj.headStyle.backgroundColor = rgbaTransform(obj.headStyle.backgroundColor)
          if (obj.headStyle.color) {
            this.formItem.headStyle.color.hex = obj.headStyle.color
            obj.headStyle.color = this.formItem.headStyle.color
          } else {
            obj.headStyle.color = this.formItem.headStyle.color
          }
          obj.bodyStyle.fontSize = parseInt(obj.bodyStyle.fontSize)
          if (obj.bodyStyle.color) {
            this.formItem.bodyStyle.color.hex = obj.bodyStyle.color
            obj.bodyStyle.color = this.formItem.bodyStyle.color
          } else {
            obj.bodyStyle.color = this.formItem.bodyStyle.color
          }
          this.formItem = obj
        } else {
          this.$refs['formItem'].resetFields()
        }
      }
    },
    getData () {
      if (this.sql) {
        this.getTable(JSON.parse(JSON.stringify(this.formItem)))
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
    .vue-color__slider,
    .vue-color__chrome{
      width: 100%
    }
    .error-tip{
      color:red;
      line-height: 1;
      margin-bottom: 5px;
    }
  }
</style>
