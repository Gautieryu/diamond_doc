import Vue from 'vue'
import VueRouter from 'vue-router'
import userInfo from '../views/userInfo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: userInfo
  },
  {
    path: '/userInfo',
    name: 'userInfo',
    component: () => import('../views/userInfo.vue')
  },
  {
    path: '/WorkSpace',
    name: 'WorkSpace',
    component: () => import('../views/WorkSpace.vue')
  },
  {
    path: '/Group',
    name: 'Group',
    component: () => import('../views/Group.vue')
  },
  {
    path: '/GroupInfo',
    name: 'GroupInfo',
    component: () => import('../components/GroupInfo.vue')
  },
  {
    path: '/recently',
    name: 'recently',
    component: () => import('../views/recently.vue')
  },
  {
    path: '/collect',
    name: 'collect',
    component: () => import('../views/collect.vue')
  },
  {
    path: '/VimWord',
    name: 'VimWord',
    component: () => import('../views/VimWord.vue')
  },
  {
    path: '/vim_compo',
    name: 'vim_compo',
    component: () => import('../views/vim_compo.vue')
  },
  
]

const router = new VueRouter({
  routes
})

export default router
