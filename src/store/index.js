import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import mutations from './mutations'
import getters from './getters'
import content from './modules/content'
import pageSet from './modules/pageSet'
import vesselSet from './modules/vesselSet'
import chartSet from './modules/chartSet'
import textSet from './modules/textSet'
import imgSet from './modules/imgSet'
import tableSet from './modules/tableSet'
import numberSet from './modules/numberSet'
import timeSet from './modules/timeSet'
import heads from './modules/heads'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions: actions.actions,
  getters,
  state: {
    page: {
      isVessel: false,
      isLayer: false,
      vessel: '',
      layer: '',
      vesselI: 0,
      layerI: 0,
      container_info: [{}],
      params: {},
      theme: {
        list: [],
        current_page: 1,
        page_size: 10,
        total: 0
      }
    },
    pageNotModify: '',
    chartModify: 0,
    timeModify: 0,
    numberModify: {
      vId: '',
      lId: '',
      oldVal: '',
      newVal: ''
    },
    loading: false,
    headLoading: false,
    contentLoading: false,
    sidebarLoading: false,
    sqlLoading: false
  },
  mutations,
  modules: {
    heads,
    content,
    pageSet,
    vesselSet,
    chartSet,
    textSet,
    imgSet,
    tableSet,
    numberSet,
    timeSet
  },
  strict: debug
})
