<template>
  <el-main class="system-main">
    <div class="system-content">

      <div class="system-row">

      <!-- 模型设置 -->
      <div class="function-section model-section">
        <div class="section-header">
          <el-icon><Cpu /></el-icon>
          <span class="section-title">模型设置</span>
        </div>
        <div class="section-body">
          <div class="model-row">
            <el-select v-model="modelSelected" placeholder="选择供应商..." class="model-select">
              <el-option v-for="p in modelProviders" :key="p.name" :label="p.name" :value="p.name" />
            </el-select>
            <el-button type="primary" plain class="model-btn" :disabled="modelSelected === modelActive"
              @click="switchModel">{{ modelSelected === modelActive ? '当前' : '切换' }}</el-button>
          </div>
          <el-table :data="modelProviders" class="model-table" height="100%">
            <template #empty>
              <el-empty description="暂无供应商" />
            </template>
            <el-table-column label="供应商" min-width="160" align="center">
              <template v-slot="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="模型" min-width="160" align="center">
              <template v-slot="scope">{{ scope.row.model }}</template>
            </el-table-column>
            <el-table-column label="状态" min-width="160" align="center">
              <template v-slot="scope">
                <el-tag v-if="scope.row.name === modelActive" type="success">使用中</el-tag>
                <el-tag v-else type="info">可用</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 全局设置 -->
      <div class="function-section func-section">
        <div class="section-header">
          <el-icon><Setting /></el-icon>
          <span class="section-title">全局设置</span>
        </div>
        <div class="section-body">
          <el-table :data="funcFlags" class="func-table" height="100%">
            <template #empty>
              <el-empty description="暂无功能开关" />
            </template>
            <el-table-column label="功能" min-width="180" align="center" prop="name" />
            <el-table-column label="状态" min-width="180" align="center">
              <template v-slot="scope">
                <el-switch v-model="scope.row.enabled" inline-prompt class="func-switch"
                  :active-icon="Check" :inactive-icon="Close" @change="saveFunc(scope.row.name)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      </div>

      <!-- 系统调用 -->
      <div class="function-section">
        <div class="section-header">
          <el-icon><Platform /></el-icon>
          <span class="section-title">系统调用</span>
        </div>
        <el-form class="system-form">
          <el-form-item label="调用指令" prop="invokeCommand">
            <div class="system-invoke-row">
              <el-input placeholder="请输入指令... 格式: [Bean名] [方法名] [参数...]" v-model="invokeCommand"
                class="system-invoke-input" />
              <el-button type="danger" plain class="system-invoke-btn" @click="invokeResult = ''">
                <el-icon size="15"><Delete /></el-icon>&nbsp;清空
              </el-button>
              <el-button type="primary" plain class="system-invoke-btn" @click="invoke">
                <el-icon size="15"><Grid /></el-icon>&nbsp;调用
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="执行结果" prop="invokeResult">
            <el-input placeholder="无指令输出..." v-model="invokeResult" type="textarea"
              :autosize="{ minRows: 18, maxRows: 40 }" class="system-result-input" />
          </el-form-item>
        </el-form>
      </div>

    </div>
  </el-main>
</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Cpu, Setting, Platform, Grid, Check, Close } from '@element-plus/icons-vue'
import {
  invokeApi, getSystemModelApi, setSystemModelApi, getSystemFuncApi, setSystemFuncApi
} from '@/api/system'

const syncTrigger = inject('syncTrigger')

const modelActive = ref('')
const modelSelected = ref('')
const modelProviders = ref([])

const funcFlags = ref([])

const invokeCommand = ref('')
const invokeResult = ref('')

const loadModel = async () => {
  const res = await getSystemModelApi()
  if (res.code === 1) {
    modelActive.value = res.data.active
    modelSelected.value = res.data.active
    modelProviders.value = res.data.providers
  } else {
    ElMessage.error(res.message)
  }
}

const switchModel = async () => {
  const res = await setSystemModelApi(modelSelected.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    loadModel()
  } else {
    ElMessage.error(res.message)
  }
}

const loadFunc = async () => {
  const res = await getSystemFuncApi()
  if (res.code === 1) {
    funcFlags.value = Object.entries(res.data).map(([name, enabled]) => ({ name, enabled }))
  } else {
    ElMessage.error(res.message)
  }
}

const saveFunc = async (name) => {
  const res = await setSystemFuncApi(name, null)
  if (res.code === 1) {
    ElMessage.success(res.message)
  } else {
    ElMessage.error(res.message)
    loadFunc()
  }
}

const invoke = async () => {
  const res = await invokeApi(invokeCommand.value)
  if (res.code === 1) {
    ElMessage.success('调用成功')
    invokeResult.value = invokeResult.value + res.data + '\n'
  } else {
    ElMessage.error('调用失败')
    invokeResult.value = invokeResult.value + res.message + '\n'
  }
}

onMounted(() => {
  loadModel()
  loadFunc()
})

watch(syncTrigger, () => {
  loadModel()
  loadFunc()
})
</script>

<style scoped>
.system-main {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: clip;
  padding: 20px;
}

.system-content {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== 分区块 ===== */
.function-section {
  border: 1px solid #555555;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #555555;
}

.section-header :deep(.el-icon) {
  color: #409eff;
  font-size: 15px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
}

/* ===== 同行双栏 ===== */
.system-row {
  display: flex;
  gap: 24px;
  align-items: stretch;
}

.system-row > .function-section {
  flex: 1;
  min-width: 0;
}

.system-row > .func-section {
  flex: 0 0 33%;
}

/* 双栏区块尺寸与系统调用一致 */
.system-row .function-section {
  padding: 16px;
}

.system-row .section-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
}

.system-row :deep(.el-table__cell) {
  padding: 4px 0;
}

/* ===== 模型设置 ===== */
.model-section {
  height: 250px;
}

.func-section {
  height: 250px;
}

.section-body {
  height: calc(100% - 55px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.model-table,
.func-table {
  flex: 1;
  min-height: 0;
}

.model-row {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.model-select {
  flex: 1;
  width: 100%;
}

.model-btn {
  margin-top: 0;
}

.model-table {
  width: 100%;
}

/* ===== 功能开关 ===== */
.func-table {
  width: 100%;
}

.func-table :deep(.el-table__cell) {
  vertical-align: middle;
}

.func-switch {
  --el-switch-on-color: rgba(19, 206, 102, 0.75);
}

/* ===== 系统调用 ===== */
.system-form :deep(.el-form-item) {
  margin-bottom: 10px;
}

.system-invoke-row {
  display: flex;
  width: 100%;
  gap: 12px;
}

.system-invoke-input {
  flex: 1;
  min-width: 0;
}

.system-invoke-btn {
  white-space: nowrap;
  margin-left: 0;
}

.system-invoke-row :deep(.el-button + .el-button) {
  margin-left: 0;
}

.system-result-input :deep(.el-textarea) {
  width: 100%;
}
</style>
