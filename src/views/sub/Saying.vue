<template>
  <el-container>
    <!-- 头部操作 -->
    <el-header height="20px"
      style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; flex: 1; min-width: 0; margin-right: 20px; overflow: hidden;">
        <el-icon size="18px"><Filter /></el-icon>&nbsp;
        <el-form :inline="true"
          style="display: flex; width: 70%; gap: 0; align-items: center; flex-wrap: nowrap; justify-content: flex-start;">
          <el-form-item label="过滤器" style="margin: 0; flex-shrink: 0; white-space: nowrap;" />
          <el-form-item style="margin: 0; flex: 2; min-width: 310px; max-width: 740px">
            <el-input placeholder="请输入关键字..." :prefix-icon="Search" v-model="sayingSearchKey" clearable
              style="width: 100%" />
          </el-form-item>
        </el-form>
      </div>
      <div style="display: flex; align-items: center; flex-shrink: 0;">
        <el-button-group style="display: inline-flex; margin-right: 1px">
          <el-button round plain @click="sayingImportVisible = true" :disabled="userType === 0">
            <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入语录
          </el-button>
          <el-button round plain @click="exportSayingCsv()" :disabled="userType === 0">
            <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出语录
          </el-button>
        </el-button-group>
      </div>
    </el-header>

    <el-main style="height: 100%; width: 100%; overflow-y: auto; overflow-x: auto; padding: 20px;">
      <el-table :data="filteredSayingTableData" style="width: 100%" height="calc(100vh - 250px)">
        <template #empty>
          <el-empty description="暂无语录" />
        </template>
        <el-table-column v-if="hasSayingFilter" type="index" label="序号" width="60" align="center" />
        <el-table-column v-if="!hasSayingFilter" type="index" label="序号" width="60" align="center"
          :index="(sayingPageInfo.current - 1) * sayingPageInfo.size + 1" />
        <el-table-column label="语录ID" width="90" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="用户ID" min-width="120" align="center">
          <template v-slot="scope">{{ scope.row.userId }}</template>
        </el-table-column>
        <el-table-column label="昵称" min-width="120" prop="userName" align="center" show-overflow-tooltip />
        <el-table-column label="内容" min-width="750" prop="text" show-overflow-tooltip />
        <el-table-column label="时间" width="180" align="center">
          <template v-slot="scope">{{ scope.row.time.replace('T', ' ') }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="110" align="center">
          <template v-slot="scope">
            <el-popconfirm title="确认删除吗?" @confirm="deleteSaying(scope.row)">
              <template #reference>
                <el-button type="danger" plain size="small" title="删除" :disabled="userType === 0">
                  <el-icon size="14"><Delete /></el-icon>
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 分页 -->
    <el-footer height="60px" style="padding: 10px 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <el-text v-if="hasSayingFilter"
          style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
          <el-icon><InfoFilled /></el-icon> 共 {{ filteredSayingTableData.length }} 条记录
        </el-text>
        <el-text v-if="!hasSayingFilter"
          style="flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 30px;">
          <el-icon><InfoFilled /></el-icon> 共 {{ sayingPageInfo.total }} 条记录
        </el-text>
        <el-pagination v-if="!hasSayingFilter" background @size-change="handleSayingSizeChange"
          @current-change="handleSayingCurrentChange" layout="sizes, prev, pager, next"
          :page-sizes="[10, 20, 30, 40]" :page-size="sayingPageInfo.size" :total="sayingPageInfo.total"
          :current-page="sayingPageInfo.current" :pager-count="7" />
      </div>
    </el-footer>

    <!-- 导入对话框 -->
    <el-dialog v-model="sayingImportVisible" title="导入 - 语录 CSV 文件" width="500px">
      <el-upload class="upload-import-saying" drag :before-upload="isCsv" :headers="uploadHeaders"
        :action="uploadAction('/saying/importCsv')" :on-success="refreshSaying" :on-error="(error, file, fileList) => {
          refreshSaying()
          ElMessage.warning('CSV 文件存在数据结构或约束问题 - 可用数据已导入')
        }" multiple>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Drop csv file here or <em>click to import</em></div>
      </el-upload>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter, Search, DocumentAdd, DocumentCopy, Delete, InfoFilled, UploadFilled } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { getSayingListApi, getSayingPageApi, deleteSayingApi, exportSayingCsvApi } from '@/api/saying'

const userType = inject('userType')
const syncTrigger = inject('syncTrigger')

const sayingTableData = ref([])
const allSayingTableData = ref([])
const sayingPageInfo = ref({ total: 0, size: 20, current: 1, pages: 0 })
const sayingSearchKey = ref('')
const sayingImportVisible = ref(false)

const hasSayingFilter = computed(() => sayingSearchKey.value !== '')

const filteredSayingTableData = computed(() => {
  if (hasSayingFilter.value) {
    return allSayingTableData.value.filter(saying => {
      return sayingSearchKey.value === '' ||
        String(saying.userId).includes(sayingSearchKey.value) ||
        saying.userName.includes(sayingSearchKey.value) ||
        saying.text.includes(sayingSearchKey.value)
    })
  }
  return sayingTableData.value
})

const uploadHeaders = computed(() => {
  const t = localStorage.getItem('token') || ''
  return { token: `${t}` }
})

const uploadAction = (url) => {
  const baseURL = request?.defaults?.baseURL || ''
  return `${baseURL}${url}`
}

const isCsv = (file) => {
  const isCSVByExt = file.name.toLowerCase().endsWith('.csv')
  if (!isCSVByExt) {
    ElMessage.error('仅支持 CSV 文件')
    return false
  }
  return true
}

const refreshSaying = () => {
  getSayingList()
  getSayingPage(sayingPageInfo.value.current, sayingPageInfo.value.size)
}

const getSayingList = async () => {
  const res = await getSayingListApi()
  allSayingTableData.value = JSON.parse(JSON.stringify(res.data.sayings))
}

const getSayingPage = async (current, size) => {
  const res = await getSayingPageApi(current, size)
  sayingTableData.value = JSON.parse(JSON.stringify(res.data.sayingPage.data))
  sayingPageInfo.value.total = res.data.sayingPage.total
  sayingPageInfo.value.size = res.data.sayingPage.size
  sayingPageInfo.value.current = res.data.sayingPage.current
  sayingPageInfo.value.pages = res.data.sayingPage.pages
}

const deleteSaying = async (saying) => {
  const res = await deleteSayingApi(saying.id)
  if (res.code === 1) {
    ElMessage.success(res.message)
    refreshSaying()
  } else {
    ElMessage.error(res.message)
  }
}

const exportSayingCsv = async () => {
  try {
    const res = await exportSayingCsvApi()
    const blob = new Blob([res])
    const elink = document.createElement('a')
    elink.download = `Sayings_${new Date().toLocaleString()}.csv`
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const handleSayingCurrentChange = (current) => {
  getSayingPage(current, sayingPageInfo.value.size)
  getSayingList()
}

const handleSayingSizeChange = (size) => {
  getSayingPage(1, size)
  getSayingList()
}

onMounted(() => {
  refreshSaying()
})

watch(syncTrigger, () => {
  refreshSaying()
})
</script>
