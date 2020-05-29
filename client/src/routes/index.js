import Vue from 'vue'
import Router from 'vue-router'
import invoiceRoutes from './invoices'
import clientsRoutes from './clients'
import reportsRoutes from './reports'

Vue.use(Router)

const routes = [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/'
  },
  ...invoiceRoutes,
  ...clientsRoutes,
  ...reportsRoutes,
  {
    path: '/settings'
  }
]
const router = new Router({
    scrollBehavior () {
      return { x: 0, y: 0 }
    },
    routes,
    mode: 'history',
    default: '/'
  })
  
  export default router
