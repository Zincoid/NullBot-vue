import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/Login.vue'
import RegistView from '@/views/Regist.vue'
import IndexView from '@/views/Index.vue'
import FileView from '@/views/sub/File.vue'
import CenterView from '@/views/sub/Center.vue'
import SayingView from '@/views/sub/Saying.vue'
import StatisticView from '@/views/sub/Statistic.vue'
import UserView from '@/views/sub/User.vue'
import GroupView from '@/views/sub/Group.vue'
import ItemView from '@/views/sub/Item.vue'
import SystemView from '@/views/sub/System.vue'

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
    component: IndexView,
    children: [
      { path: '', redirect: '/index/file' },
      { path: 'file', name: 'File', component: FileView },
      { path: 'center', name: 'Center', component: CenterView },
      { path: 'saying', name: 'Saying', component: SayingView },
      { path: 'statistic', name: 'Statistic', component: StatisticView },
      { path: 'user', name: 'User', component: UserView },
      { path: 'group', name: 'Group', component: GroupView },
      { path: 'item', name: 'Item', component: ItemView },
      { path: 'system', name: 'System', component: SystemView },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
