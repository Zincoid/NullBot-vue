<template>
  <div class="app-root">
    <el-container>
      <!-- 头部区域 -->
      <el-header class="el-header" height="auto">
        <el-menu class="el-header-menu" mode="horizontal" :ellipsis="false">
          <el-menu-item index="logo" class="menu-logo" :default-active="''">
            <h1>NullBot <el-icon size="25">
                <MostlyCloudy />
              </el-icon></h1>
          </el-menu-item>

          <div class="el-header-center">
            <!-- 文件管理：搜索栏 -->
            <div v-show="routePath === '/index/file'" class="search-container">
              <el-icon size="20">
                <Files />
              </el-icon>
              <el-input class="search-input" placeholder="在此目录中搜索" v-model="searchKey" clearable />
              <el-button plain @click="searchTrigger++">
                <el-icon size="15">
                  <Search />
                </el-icon>&nbsp;搜索
              </el-button>
            </div>

            <!-- 个人中心：问候语 -->
            <h3 v-show="routePath === '/index/center'" class="section-title nowrap">
              <span style="font-weight: bold;">{{ currentTime }}</span>
            </h3>

            <!-- 语录管理 -->
            <h3 v-show="routePath === '/index/saying'" class="section-title">
              <el-icon>
                <ChatDotSquare />
              </el-icon><span>语录管理</span>
            </h3>

            <!-- 数据统计 -->
            <h3 v-show="routePath === '/index/statistic'" class="section-title">
              <el-icon>
                <Histogram />
              </el-icon><span>访问统计</span>
            </h3>

            <!-- 用户管理 -->
            <h3 v-show="routePath === '/index/user'" class="section-title">
              <el-icon>
                <Cellphone />
              </el-icon><span>用户管理</span>
            </h3>

            <!-- 群组管理 -->
            <h3 v-show="routePath === '/index/group'" class="section-title">
              <el-icon>
                <OfficeBuilding />
              </el-icon><span>群组管理</span>
            </h3>

            <!-- 物品管理 -->
            <h3 v-show="routePath === '/index/item'" class="section-title">
              <el-icon>
                <Box />
              </el-icon><span>物品管理</span>
            </h3>

            <!-- 系统调用 -->
            <h3 v-show="routePath === '/index/system'" class="section-title">
              <span>{{ currentTime }}</span>
            </h3>
          </div>

          <!-- 右侧用户信息 -->
          <el-sub-menu index="user" class="menu-user">
            <div class="user-dropdown-info">
              <div class="user-dropdown-row">
                <el-avatar :size="40" :src="info.avatar" class="user-avatar">
                  <template #default>
                    <el-icon size="20px">
                      <User />
                    </el-icon>
                  </template>
                </el-avatar>
                <div class="user-dropdown-text">
                  <div class="user-dropdown-name">{{ info.username || '未设置' }}</div>
                  <div class="user-dropdown-role">{{ userType === 0 ? '访客' : '管理员' }}</div>
                </div>
              </div>
            </div>
            <div class="menu-action-item">
              <el-button :disabled="userType === 0" type="warning" plain class="menu-action-btn" @click="initRootFile">
                <el-icon size="15">
                  <Coin />
                </el-icon>根初始化
              </el-button>
            </div>
            <div class="menu-action-item">
              <el-button :disabled="userType === 0" type="primary" plain class="menu-action-btn" @click="sync">
                <el-icon size="15">
                  <Switch />
                </el-icon>数据同步
              </el-button>
            </div>
            <div class="menu-action-item">
              <el-button type="danger" plain class="menu-action-btn" @click="logout">
                <el-icon size="15">
                  <SwitchButton />
                </el-icon>退出登录
              </el-button>
            </div>
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <el-text size="large" tag="b">&nbsp;{{ info.username || '未设置' }}</el-text>
            </template>
          </el-sub-menu>
        </el-menu>
      </el-header>

      <el-container>
        <!-- 左侧导航 -->
        <el-aside class="el-aside">
          <el-menu :default-active="activeMenu" :default-openeds="defaultOpeneds" class="el-aside-menu" :ellipsis="false"
            @select="handleMenuSelect">
            <h3 align="center"><el-icon>
                <Promotion />
              </el-icon>&nbsp;导航</h3>
            <el-menu-item index="/index/file">
              <el-icon>
                <Files />
              </el-icon><span>文件存储</span>
            </el-menu-item>
            <el-sub-menu index="management">
              <template #title>
                <el-icon>
                  <Setting />
                </el-icon><span>数据管理</span>
              </template>
              <el-menu-item index="/index/saying">
                <el-icon>
                  <ChatDotSquare />
                </el-icon><span>语录</span>
              </el-menu-item>
              <el-menu-item index="/index/user">
                <el-icon>
                  <Cellphone />
                </el-icon><span>用户</span>
              </el-menu-item>
              <el-menu-item index="/index/group">
                <el-icon>
                  <OfficeBuilding />
                </el-icon><span>群组</span>
              </el-menu-item>
              <el-menu-item index="/index/item">
                <el-icon>
                  <Box />
                </el-icon><span>物品</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/index/statistic">
              <el-icon>
                <Histogram />
              </el-icon><span>访问统计</span>
            </el-menu-item>
            <el-menu-item index="/index/center">
              <el-icon>
                <UserFilled />
              </el-icon><span>个人中心</span>
            </el-menu-item>
            <el-menu-item index="/index/system" v-if="userType === 1">
              <el-icon>
                <Platform />
              </el-icon><span>系统调用</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 右侧内容区域 -->
        <el-container class="content-container">
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
  Histogram, UserFilled, Platform, Search, Setting
} from '@element-plus/icons-vue'  // 不可移除
import FilingInfo from '@/components/FilingInfo.vue'
import { getInfoApi } from '@/api/system'
import { initApi, syncApi } from '@/api/file'

const router = useRouter()
const route = useRoute()

const routePath = computed(() => route.path)
const activeMenu = computed(() => route.path)

const managementRoutes = ['/index/saying', '/index/user', '/index/group', '/index/item']
const defaultOpeneds = computed(() => managementRoutes.includes(route.path) ? ['management'] : [])

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
        ElMessage({ message: `本地与数据库 - 同步失败: ${res.message}`, type: 'error', placement: 'bottom-left' })
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
.app-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-root > .el-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.app-root > .el-container > .el-container {
  min-height: 0;
  overflow: hidden;
}

/* ===== 头部区域 ===== */
.el-header {
  --el-header-padding: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.el-header-menu {
  width: 100%;
  --el-menu-horizontal-height: 70px;
  min-width: 100%;
  padding: 0 20px 0 10px;
}

.el-header-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 700px;
  padding: 0;
}

.search-input {
  flex: 1;
  min-width: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.section-title.nowrap {
  white-space: nowrap;
}

/* ===== 用户子菜单 ===== */
.menu-user {
  margin-top: 5px;
}

.user-dropdown-info {
  padding: 10px;
  margin-bottom: 2px;
}

.user-dropdown-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  background-color: #433d3d;
}

.user-dropdown-text {
  flex: 1;
  min-width: 0;
}

.user-dropdown-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.user-dropdown-role {
  font-size: 12px;
}

.menu-action-item {
  padding: 2px 10px;
  background-color: transparent !important;
}

.menu-action-btn {
  width: 100%;
  justify-content: center;
}

.menu-action-btn :deep(.el-icon) {
  margin-right: 4px;
}

/* ===== 侧边导航 ===== */
.el-aside {
  width: 175px;
  overflow-y: auto;
  scrollbar-width: none;
}

.el-aside::-webkit-scrollbar {
  display: none;
}

.el-aside-menu {
  width: 100%;
  min-height: 100%;
  padding: 0 10px;
  border-right: none;
  background-image: linear-gradient(
    to bottom,
    transparent 15px,
    var(--el-menu-border-color) 15px,
    var(--el-menu-border-color) calc(100% - 15px),
    transparent calc(100% - 15px)
  );
  background-size: 1px 100%;
  background-position: right center;
  background-repeat: no-repeat;
}

.el-aside-menu h3 {
  position: sticky;
  top: 0;
  z-index: 1;
  margin: 0;
  padding-top: 1em;
  padding-bottom: 1em;
  background: var(--el-bg-color);
}

.el-aside-menu .el-menu-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.el-aside-menu .el-menu-item.is-active {
  background-color: var(--el-menu-hover-bg-color);
}

.el-aside-menu .el-menu-item:not(.is-active):hover {
  background-color: color-mix(in srgb, var(--el-menu-hover-bg-color) 50%, transparent);
}


.content-container {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
}

/* ===== File.vue 上传样式 ===== */
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

/* ===== Statistic.vue 统计卡片样式 ===== */
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

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.menu-logo {
  pointer-events: none;
  user-select: none;
  padding-top: 5px;
}

.el-header .el-sub-menu__title {
  justify-content: center;
}
</style>

<style>
/* ===== 侧边导航子菜单样式 ===== */
.el-aside-menu .el-sub-menu__title {
  border-radius: 8px;
  margin-bottom: 4px;
}
</style>
