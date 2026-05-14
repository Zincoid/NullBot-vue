<template>
  <el-main class="system-main">
    <div class="system-content">
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
            :autosize="{ minRows: 25, maxRows: 50 }" class="system-result-input" />
        </el-form-item>
      </el-form>
    </div>
  </el-main>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Grid } from '@element-plus/icons-vue'
import { invokeApi } from '@/api/system'

const invokeCommand = ref('')
const invokeResult = ref('')

const invoke = async () => {
  const res = await invokeApi(invokeCommand.value)
  if (res.code === 1) {
    ElMessage.success('调用成功')
    invokeResult.value = invokeResult.value + res.data.result + '\n'
  } else {
    ElMessage.error('调用失败')
    invokeResult.value = invokeResult.value + res.message + '\n'
  }
}
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
}

.system-invoke-row {
  display: flex;
  width: 100%;
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
