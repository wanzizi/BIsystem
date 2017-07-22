const getters = {
  page: state => state.page,
  loading: state => state.loading,
  headLoading: state => state.headLoading,
  contentLoading: state => state.contentLoading,
  sidebarLoading: state => state.sidebarLoading,
  sqlLoading: state => state.sqlLoading,
  chartModify: state => state.chartModify,
  timeModify: state => state.timeModify,
  pageNotModify: state => state.pageNotModify
}

export default getters
