import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/index.vue'),
      children: [
        {
          path: 'page/:id',
          component: require('@/components/toolbar/pageSet/pageSet.vue')
        },
        {
          path: 'page/:id/vessel',
          component: require('@/components/toolbar/vesselSet/vesselSet.vue')
        },
        {
          path: 'page/:id/chart',
          component: require('@/components/toolbar/layerSet/chartSet.vue')
        },
        {
          path: 'page/:id/text',
          component: require('@/components/toolbar/layerSet/textSet.vue')
        },
        {
          path: 'page/:id/image',
          component: require('@/components/toolbar/layerSet/imgSet.vue')
        },
        {
          path: 'page/:id/table',
          component: require('@/components/toolbar/layerSet/tableSet.vue')
        },
        {
          path: 'page/:id/number',
          component: require('@/components/toolbar/layerSet/numberSet.vue')
        },
        {
          path: 'page/:id/timestamp',
          component: require('@/components/toolbar/layerSet/timeSet.vue')
        }
      ]
    },
    {
      path: '/preview/:id',
      name: 'preview',
      component: require('@/components/preview.vue')
    }
  ]
})
