// actions
const actions = {
  change_vessel: function ({ commit }, params) {
    commit('CHANGE_VESSEL', params)
  },
  changeSort: function ({ commit }, params) {
    commit('CHANGE_SORT', params)
  },
  toLayer: function ({ commit }, params) {
    commit('TO_LAYER', params)
  }
}

export default {
  actions
}
