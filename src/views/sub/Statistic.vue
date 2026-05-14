<template>
  <el-main class="statistic-main">
    <div class="statistic-content">
      <el-header height="400px" class="statistic-header">
        <div class="statistic-card">
          <el-statistic :value="totalVisits">
            <template #title>
              <div class="statistic-title-row">
                总调用次数
                <el-tooltip effect="dark" content="自 2025/12/23 起的指令使用总次数 (数据统计启用于该日)" placement="top">
                  <el-icon class="statistic-title-icon" :size="12"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
        <LineChart :title="'每日访问量 (近30日)'" :y_name="'调用次数'" :data="visitsData" :xAxis="visitsXAxis"
          :height="'400px'" :width="'90%'" />
      </el-header>
      <el-scrollbar height="calc(100vh - 600px)">
        <BarChart :title="'指令访问量 (Top20)'" :y_name="'调用次数'" :data="topCommandsData" :xAxis="topCommandsAxis"
          :height="'235px'" :width="'100%'" />
        <BarChart :title="'用户访问量 (Top20)'" :y_name="'调用次数'" :data="topUsersData" :xAxis="topUsersAxis"
          :height="'235px'" :width="'100%'" />
        <BarChart :title="'群聊访问量 (Top20)'" :y_name="'调用次数'" :data="topGroupsData" :xAxis="topGroupsAxis"
          :height="'235px'" :width="'100%'" />
      </el-scrollbar>
    </div>
  </el-main>
</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import LineChart from '@/components/LineChart.vue'
import BarChart from '@/components/BarChart.vue'
import { getStatisticApi } from '@/api/statistic'

const syncTrigger = inject('syncTrigger')

const totalVisits = ref(0)
const visitsData = ref([])
const visitsXAxis = ref([])
const topGroupsData = ref([])
const topGroupsAxis = ref([])
const topUsersData = ref([])
const topUsersAxis = ref([])
const topCommandsData = ref([])
const topCommandsAxis = ref([])

const getStatistic = async () => {
  const res = await getStatisticApi()
  if (res.code === 1) {
    totalVisits.value = res.data.statistic.totalVisits
    visitsXAxis.value = res.data.statistic.visitsXAxis
    visitsData.value = res.data.statistic.visitsData
    topGroupsAxis.value = res.data.statistic.topGroupsAxis
    topGroupsData.value = res.data.statistic.topGroupsData
    topUsersAxis.value = res.data.statistic.topUsersAxis
    topUsersData.value = res.data.statistic.topUsersData
    topCommandsAxis.value = res.data.statistic.topCommandsAxis
    topCommandsData.value = res.data.statistic.topCommandsData
  } else {
    ElMessage.error(res.message)
  }
}

onMounted(() => {
  getStatistic()
})

watch(syncTrigger, () => {
  getStatistic()
})
</script>

<style scoped>
.statistic-main {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: clip;
  padding: 20px;
}

.statistic-content {
  margin-right: 40px;
  margin-top: 10px;
}

.statistic-header {
  padding: 0 0;
  display: flex;
  justify-content: left;
  align-items: center;
}

.statistic-card {
  height: 295px;
  width: 10%;
  min-width: 110px;
  margin-left: 36px;
  margin-top: 0;
  margin-bottom: 25px;
  padding: 25px;
  border-radius: 8px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-card :deep(.el-statistic) {
  --el-statistic-content-font-size: 28px;
}

.statistic-title-row {
  display: inline-flex;
  align-items: center;
}

.statistic-title-icon {
  margin-left: 4px;
}
</style>
