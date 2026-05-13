import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/Login.vue'
import RegistView from '@/views/Regist.vue'
import IndexView from '@/views/Index.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },

  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },

  {
    path: '/regist',
    name: 'Regist',
    component: RegistView
  },

  {
    path: '/index',
    name: 'Index',
    component: IndexView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router