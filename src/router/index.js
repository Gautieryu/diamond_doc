import Vue from 'vue'
import VueRouter from 'vue-router'
import userInfo from '../views/userInfo.vue'
import App from '../App.vue'
import Welcome from '../views/Welcome.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Welcome
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
  {
    path: '/vimGroupDoc',
    name: 'vimGroupDoc',
    component: () => import('../views/vimGroupDoc.vue')
  },
  {
    path: '/vimShareReadOnly',
    name: 'vimShareReadOnly',
    component: () => import('../views/vimShareReadOnly.vue')
  },
  {
    path: '/vimShareWrite',
    name: 'vimShareWrite',
    component: () => import('../views/vimShareWrite.vue')
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('../views/message.vue')
  },
  {
    path: '/Welcome',
    name: 'Welcome',
    component: () => import('../views/Welcome.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
