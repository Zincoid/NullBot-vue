<template>
  <div>
    <el-container>
      <!-- 头部 -->
      <el-header height="auto">
        <el-menu class="el-menu-1" mode="horizontal" :ellipsis="false" style="min-width: 100%;">
          <el-menu-item index="logo">
            <h1>NullBot <el-icon size="25"><MostlyCloudy /></el-icon></h1>
          </el-menu-item>

          <div class="header-center"
            style="margin-bottom: 8px; flex: 1; display: flex; align-items: center; justify-content: center;">
            <!-- 文件管理：搜索栏 -->
            <div v-show="routePath === '/index/file'" class="search-container"
              style="display: flex; align-items: center; gap: 10px; width: 100%; max-width: 700px; padding: 0 0;">
              <el-icon size="20"><Files /></el-icon>
              <el-input placeholder="在此目录中搜索" v-model="searchKey" clearable style="flex: 1; min-width: 20px;" />
              <el-button plain @click="searchTrigger++">
                <el-icon size="15"><Search /></el-icon>&nbsp;搜索
              </el-button>
            </div>

            <!-- 个人中心：问候语 -->
            <h3 v-show="routePath === '/index/center'"
              style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; white-space: nowrap">
              <span>Ciallo～(∠・ω&lt; ) <span style="font-weight: bold;">{{ currentTime }}</span> ⌒☆</span>
            </h3>

            <!-- 语录管理 -->
            <h3 v-show="routePath === '/index/saying'"
              style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><ChatDotSquare /></el-icon>语录管理
            </h3>

            <!-- 数据统计 -->
            <h3 v-show="routePath === '/index/statistic'"
              style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><Histogram /></el-icon>数据统计
            </h3>

            <!-- 用户管理 -->
            <h3 v-show="routePath === '/index/user'"
              style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><Cellphone /></el-icon>用户管理
            </h3>

            <!-- 群组管理 -->
            <h3 v-show="routePath === '/index/group'"
              style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><OfficeBuilding /></el-icon>群组管理
            </h3>

            <!-- 物品管理 -->
            <h3 v-show="routePath === '/index/item'"
              style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <el-icon><Box /></el-icon>物品管理
            </h3>

            <!-- 系统调用、其他 -->
            <h3 v-show="!['/index/file', '/index/center', '/index/saying', '/index/statistic', '/index/user', '/index/group', '/index/item'].includes(routePath)"
              style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
              <span>{{ currentTime }}</span>
            </h3>
          </div>

          <!-- 右侧用户信息 -->
          <el-sub-menu index="user" style="margin-left: auto;">
            <div style="padding: 10px; margin-bottom: 2px">
              <div style="display: flex; align-items: center; gap: 10px;">
                <el-avatar :size="40" :src="info.avatar" style="background-color: #433d3d;">
                  <template #default>
                    <el-icon size="20px"><User /></el-icon>
                  </template>
                </el-avatar>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">{{ info.username || '未设置' }}</div>
                  <div style="font-size: 12px">{{ userType === 0 ? '访客' : '管理员' }}</div>
                </div>
              </div>
            </div>
            <el-menu-item index="init" style="background-color: transparent !important; --el-menu-hover-bg-color: transparent;">
              <el-button :disabled="userType === 0" type="warning" plain style="width: 100%; justify-content: center;" @click="initRootFile">
                <el-icon size="15"><Coin /></el-icon>根初始化
              </el-button>
            </el-menu-item>
            <el-menu-item index="sync" style="background-color: transparent !important; --el-menu-hover-bg-color: transparent;">
              <el-button type="primary" plain style="width: 100%; justify-content: center;" @click="sync">
                <el-icon size="15"><Switch /></el-icon>数据同步
              </el-button>
            </el-menu-item>
            <el-menu-item index="logout" style="background-color: transparent !important; --el-menu-hover-bg-color: transparent;">
              <el-button type="danger" plain style="width: 100%; justify-content: center;" @click="logout">
                <el-icon size="15"><SwitchButton /></el-icon>退出登录
              </el-button>
            </el-menu-item>
            <template #title>
              <el-icon><User /></el-icon>
              <el-text size="large" tag="b">&nbsp;{{ info.username || '未设置' }}</el-text>
            </template>
          </el-sub-menu>
        </el-menu>
      </el-header>

      <el-container>
        <!-- 左侧导航 -->
        <el-aside style="width: 10%; min-width: 150px;">
          <el-menu :default-active="activeMenu" class="el-menu-2" :ellipsis="false" style="min-width: 100%;" @select="handleMenuSelect">
            <h3 align="center"><el-icon><Promotion /></el-icon>&nbsp;导航</h3>
            <el-menu-item index="/index/file" style="display: flex; justify-content: center;">
              <span><el-icon><Files /></el-icon>文件管理</span>
            </el-menu-item>
            <el-menu-item index="/index/saying" style="display: flex; justify-content: center;">
              <span><el-icon><ChatDotSquare /></el-icon>语录管理</span>
            </el-menu-item>
            <el-menu-item index="/index/user" style="display: flex; justify-content: center;">
              <span><el-icon><Cellphone /></el-icon>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/index/group" style="display: flex; justify-content: center;">
              <span><el-icon><OfficeBuilding /></el-icon>群组管理</span>
            </el-menu-item>
            <el-menu-item index="/index/item" style="display: flex; justify-content: center;">
              <span><el-icon><Box /></el-icon>物品管理</span>
            </el-menu-item>
            <el-menu-item index="/index/statistic" style="display: flex; justify-content: center;">
              <span><el-icon><Histogram /></el-icon>数据统计</span>
            </el-menu-item>
            <el-menu-item index="/index/center" style="display: flex; justify-content: center;">
              <span><el-icon><UserFilled /></el-icon>个人中心</span>
            </el-menu-item>
            <el-menu-item index="/index/system" v-if="userType === 1" style="display: flex; justify-content: center;">
              <span><el-icon><Platform /></el-icon>系统调用</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 右侧内容区域 -->
        <el-container style="height: 100%;">
          <router-view />
        </el-container>
      </el-container>
    </el-container>

    <FilingInfo />
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import {
  MostlyCloudy, User, Coin, Switch, SwitchButton, Promotion,
  Files, ChatDotSquare, Cellphone, OfficeBuilding, Box,
  Histogram, UserFilled, Platform, Search
} from '@element-plus/icons-vue'
import FilingInfo from '@/components/FilingInfo.vue'
import { getInfoApi } from '@/api/system'
import { initApi, syncApi } from '@/api/file'

const router = useRouter()
const route = useRoute()

const routePath = computed(() => route.path)
const activeMenu = computed(() => route.path)

const handleMenuSelect = (index) => {
  router.push(index)
}

const currentTime = ref('')
const timer = ref(null)

const token = ref('')
const userType = ref(0)
const info = ref({ id: 0, username: '', email: '' })

provide('userType', userType)
provide('info', info)

// 文件搜索（搜索栏在头部，通过 provide 传给 File.vue）
const searchKey = ref('')
const searchTrigger = ref(0)
provide('searchKey', searchKey)
provide('searchTrigger', searchTrigger)

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const getInfo = async () => {
  const res = await getInfoApi()
  if (res.code === 1) {
    info.value = JSON.parse(JSON.stringify(res.data.info))
    userType.value = res.data.userType
  } else {
    ElMessage.error(res.message)
  }
}

const initRootFile = async () => {
  const res = await initApi()
  if (res.code === 1) {
    ElMessage({ message: `Root 文件 - ${res.message}`, type: 'success', placement: 'bottom-left' })
  } else {
    ElMessage({ message: `Root 文件 - ${res.message}`, type: 'warning', placement: 'bottom-left' })
  }
}

const sync = async (isFileSync = true) => {
  const loading = ElLoading.service({ lock: true, text: '同步中...', background: 'rgba(0, 0, 0, 0.7)' })
  try {
    if (isFileSync) {
      const res = await syncApi()
      if (res.code === 1) {
        ElMessage({ message: '本地与数据库 - 已同步', type: 'success', placement: 'bottom-left' })
      } else {
        ElMessage({ message: '本地与数据库 - 同步失败', type: 'error', placement: 'bottom-left' })
      }
    }
    await getInfo()
    syncTrigger.value++
    loading.close()
    ElMessage({ message: '全部浏览数据 - 已更新', type: 'success', placement: 'bottom-left' })
  } catch (error) {
    loading.close()
    ElMessage({ message: "同步更新异常: " + (error.message || '未知错误'), type: 'error', placement: 'bottom-left' })
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

const syncTrigger = ref(0)
provide('syncTrigger', syncTrigger)

// created
token.value = localStorage.getItem("token")
if (!token.value) {
  router.push('/login')
}

getInfo()

// mounted
onMounted(() => {
  updateTime()
  timer.value = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value)
})
</script>

<style scoped>
::v-deep .upload .el-upload-list {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 9999;
  width: 300px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable;
  border-radius: 4px;
  background: #141414;
  margin-top: 5px;
}

.upload {
  position: relative;
  display: inline-block;
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 295px;
  width: 10%;
  margin-left: 36px;
  margin-top: 0;
  margin-bottom: 25px;
  padding: 25px;
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green { color: var(--el-color-success); }
.red { color: var(--el-color-error); }
</style>
