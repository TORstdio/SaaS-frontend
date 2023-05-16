import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../components/dashboard.vue')
  },
  {
    path: '/clients',
    component: () => import('../components/clients/container.vue')
  },
  {
    path: '/calendar',
    component: () => import('../components/calendar/container.vue')
  },
  {
    path: '/sales',
    component: () => import('../components/sales/container.vue')
  },
  {
    path: '/account',
    component: () => import('../components/account/container.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),//import.meta.env.BASE_URL
  routes
})

export default router
