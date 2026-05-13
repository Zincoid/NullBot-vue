<template>
  <el-main style="height: 100%; width: 100%; overflow-y: auto; overflow-x: clip; padding: 20px;">
    <div style="margin-right: 20px;">
      <el-form>
        <el-form-item label="调用指令" prop="invokeCommand">
          <div style="display: flex; width: 100%">
            <el-input placeholder="请输入指令... 格式: [Bean名] [方法名] [参数...]" v-model="invokeCommand"
              style="flex: 1; min-width: 0;" />
            <el-button type="danger" plain @click="invokeResult = ''" style="white-space: nowrap; margin-left: 0">
              <el-icon size="15"><Delete /></el-icon>&nbsp;清空
            </el-button>
            <el-button type="primary" plain @click="invoke" style="white-space: nowrap; margin-left: 0">
              <el-icon size="15"><Grid /></el-icon>&nbsp;调用
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="执行结果" prop="invokeResult">
          <el-input placeholder="无指令输出..." v-model="invokeResult" type="textarea"
            :autosize="{ minRows: 25, maxRows: 50 }" style="width: 100%" />
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
