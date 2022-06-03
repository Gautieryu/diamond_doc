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
    path: '/recently',
    name: 'recently',
    component: () => import('../views/recently.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('../views/create.vue')
  },
  {
    path: '/collect',
    name: 'collect',
    component: () => import('../views/collect.vue')
  },
  {
    path: '/trash',
    name: 'trash',
    component: () => import('../views/trash.vue')
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
    path: '/createFile',
    name: 'createFile',
    component: () => import('../views/createFile.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
