<template>
  <el-container>
    <!-- 头部操作 -->
    <el-header height="20px" class="group-header">
      <div class="group-header-left">
        <el-icon size="18px"><Filter /></el-icon>&nbsp;
        <el-form :inline="true" class="group-header-form">
          <el-form-item label="过滤器" class="group-header-label" />
          <el-form-item class="group-header-search">
            <el-input placeholder="请输入关键字..." :prefix-icon="Search" v-model="groupSearchKey" clearable />
          </el-form-item>
        </el-form>
      </div>
      <div class="group-header-right">
        <el-button-group class="group-header-btns">
          <el-button round plain @click="funcImportVisible = true" :disabled="userType === 0">
            <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入配置
          </el-button>
          <el-button round plain @click="exportFuncCsv()" :disabled="userType === 0">
            <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出配置
          </el-button>
          <el-button round plain @click="groupImportVisible = true" :disabled="userType === 0">
            <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入群组
          </el-button>
          <el-button round plain @click="exportGroupCsv()" :disabled="userType === 0">
            <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出群组
          </el-button>
        </el-button-group>
      </div>
    </el-header>

    <el-main class="group-main">
      <el-table :data="filteredGroupTableData" class="group-table" height="calc(100vh - 250px)">
        <template #empty>
          <el-empty description="暂无群组" />
        </template>
        <el-table-column v-if="hasGroupFilter" type="index" label="序号" width="60" align="center" />
        <el-table-column v-if="!hasGroupFilter" type="index" label="序号" width="60" align="center"
          :index="(groupPageInfo.current - 1) * groupPageInfo.size + 1" />
        <el-table-column label="群组ID" min-width="120" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="群名" min-width="300" show-overflow-tooltip>
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="限权" width="100" align="center">
          <template v-slot="scope">{{ scope.row.access }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="216" align="center">
          <template v-slot="scope">
            <div class="group-actions">
              <el-button type="primary" plain @click="handleGroupFunc(scope.row)" size="small" title="功能"
                :disabled="userType === 0">
                <el-icon size="14"><TurnOff /></el-icon>
              </el-button>
              <el-button type="warning" plain @click="handleGroupSetting(scope.row)" size="small" title="设置"
                :disabled="userType === 0">
                <el-icon size="14"><Setting /></el-icon>
              </el-button>
              <el-popconfirm title="确认删除吗?" @confirm="deleteGroup(scope.row)">
                <template #reference>
                  <el-button type="danger" plain size="small" title="删除" :disabled="userType === 0">
                    <el-icon size="14"><Delete /></el-icon>
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 分页 -->
    <el-footer height="60px" class="group-footer">
      <div class="group-footer-row">
        <el-text v-if="hasGroupFilter" class="group-footer-text">
          <el-icon><InfoFilled /></el-icon> 共 {{ filteredGroupTableData.length }} 条记录
        </el-text>
        <el-text v-if="!hasGroupFilter" class="group-footer-text">
          <el-icon><InfoFilled /></el-icon> 共 {{ groupPageInfo.total }} 条记录
        </el-text>
        <el-pagination v-if="!hasGroupFilter" background @size-change="handleGroupSizeChange"
          @current-change="handleGroupCurrentChange" layout="sizes, prev, pager, next"
          :page-sizes="[10, 20, 30, 40]" :page-size="groupPageInfo.size" :total="groupPageInfo.total"
          :current-page="groupPageInfo.current" :pager-count="7" />
      </div>
    </el-footer>

    <!-- 群组设置对话框 -->
    <el-dialog v-model="groupSettingVisible" title="群组设置" width="500px">
      <el-form ref="groupSettingFormRef" :model="groupForm" label-width="100px" class="setting-form">
        <el-form-item label="群组ID" prop="id">
          <el-input v-model="groupForm.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="群名" prop="name">
          <el-input v-model="groupForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限" prop="access">
          <el-select v-model="groupForm.access">
            <el-option label="II级 (超级管理)" :value="2" />
            <el-option label="I级 (管理)" :value="1" />
            <el-option label="0级 (用户)" :value="0" />
            <el-option label="-I级 (限制)" :value="-1" />
            <el-option label="-II级 (禁用)" :value="-2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain @click="groupSettingVisible = false">取消</el-button>
          <el-button plain type="primary" @click="handleGroupSettingSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 功能设置对话框 -->
    <el-dialog v-model="groupFuncVisible" :title="`功能设置 - 群聊 ${groupFuncForm.groupId}`" width="450px">
      <div class="function-sections">
        <div class="function-section">
          <div class="section-header">
            <el-icon><Odometer /></el-icon>
            <span class="section-title">Limit 设置</span>
          </div>
          <el-form ref="groupFuncLimitFormRef" :inline="true" :model="groupFuncForm" label-width="100px" class="func-form">
            <el-form-item label="限速范围" prop="limitScope">
              <el-select v-model="groupFuncForm.limitScope">
                <el-option label="GROUP" :value="'GROUP'" />
                <el-option label="USER" :value="'USER'" />
                <el-option label="CMD" :value="'CMD'" />
              </el-select>
            </el-form-item>
            <el-form-item label="限速容量" prop="limitCapacity" :required="true">
              <el-input v-model="groupFuncForm.limitCapacity" placeholder="请输入容量..." />
            </el-form-item>
            <el-form-item label="补充数量" prop="limitRefill" :required="true">
              <el-input v-model="groupFuncForm.limitRefill" placeholder="请输入补充数量..." />
            </el-form-item>
            <el-form-item label="补充间隔" prop="limitInterval" :required="true">
              <el-input v-model="groupFuncForm.limitInterval" placeholder="请输入补充间隔(单位:Min)..." />
            </el-form-item>
          </el-form>
        </div>

        <div class="function-section">
          <div class="section-header">
            <el-icon><Promotion /></el-icon>
            <span class="section-title">AIChat 设置</span>
          </div>
          <el-form ref="groupFuncAiFormRef" :inline="true" :model="groupFuncForm" label-width="100px" class="func-form">
            <el-form-item label="会话范围" prop="chatScope">
              <el-select v-model="groupFuncForm.chatScope">
                <el-option label="GROUP" :value="'GROUP'" />
                <el-option label="PERSONAL" :value="'PERSONAL'" />
                <el-option label="MONITOR" :value="'MONITOR'" />
              </el-select>
            </el-form-item>
            <el-form-item label="对话策略" prop="chatStrategy">
              <el-select v-model="groupFuncForm.chatStrategy">
                <el-option label="DIRECT" :value="'DIRECT'" />
                <el-option label="EMBEDDING" :value="'EMBEDDING'" />
                <el-option label="TOOLS" :value="'TOOLS'" />
              </el-select>
            </el-form-item>
            <el-form-item label="发言频率" prop="replyFrequency" :required="true">
              <el-input v-model="groupFuncForm.replyFrequency" placeholder="请输入频率(0~1)..." />
            </el-form-item>
            <el-form-item label="思考模式" prop="thinking" class="func-switch-indent">
              <el-switch v-model="groupFuncForm.thinking" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
            <el-form-item label="语音模式" prop="voice">
              <el-switch v-model="groupFuncForm.voice" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
            <el-form-item label="注入保护" prop="antiInjection" class="func-switch-indent">
              <el-switch v-model="groupFuncForm.antiInjection" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
            <el-form-item label="内令鉴权" prop="innerCmdAuth">
              <el-switch v-model="groupFuncForm.innerCmdAuth" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
            <el-form-item label="允许自定" prop="custom" class="func-switch-indent">
              <el-switch v-model="groupFuncForm.custom" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
            <el-form-item label="自主发言" prop="autoReply">
              <el-switch v-model="groupFuncForm.autoReply" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
          </el-form>
        </div>

        <div class="function-section">
          <div class="section-header">
            <el-icon><Monitor /></el-icon>
            <span class="section-title">Monitor 设置</span>
          </div>
          <el-form ref="groupFuncMonitorFormRef" :inline="true" :model="groupFuncForm" label-width="100px" class="func-form">
            <el-form-item label="图片收集" prop="imageCollect" class="func-switch-indent">
              <el-switch v-model="groupFuncForm.imageCollect" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
            <el-form-item label="消息收集" prop="messageCollect">
              <el-switch v-model="groupFuncForm.messageCollect" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
            <el-form-item label="词语检测" prop="keywordDetect" class="func-switch-indent">
              <el-switch v-model="groupFuncForm.keywordDetect" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
            <el-form-item label="戳戳检测" prop="pokeDetect">
              <el-switch v-model="groupFuncForm.pokeDetect" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
            <el-form-item label="撤回检测" prop="recallDetect" class="func-switch-indent">
              <el-switch v-model="groupFuncForm.recallDetect" inline-prompt class="func-switch"
                :active-icon="Check" :inactive-icon="Close" />
            </el-form-item>
          </el-form>
        </div>

        <div class="function-section">
          <div class="section-header">
            <el-icon><Grid /></el-icon>
            <span class="section-title">Guess 设置</span>
          </div>
          <el-form ref="groupFuncGuessFormRef" :inline="true" :model="groupFuncForm" label-width="100px" class="func-form">
            <el-form-item label="切割比例" prop="guessCropRatio" :required="true">
              <el-input v-model="groupFuncForm.guessCropRatio" placeholder="请输入切割比例..." />
            </el-form-item>
            <el-form-item label="透明比例" prop="guessTransparentRatio" :required="true">
              <el-input v-model="groupFuncForm.guessTransparentRatio" placeholder="请输入透明比例(最大)..." />
            </el-form-item>
            <el-form-item label="切割边距" prop="guessPadding" :required="true">
              <el-input v-model="groupFuncForm.guessPadding" placeholder="请输入切割边距..." />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="group-func-dialog-footer">
          <el-button plain @click="groupFuncVisible = false">取消</el-button>
          <el-button plain type="primary" @click="handleGroupFuncSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 群组导入对话框 -->
    <el-dialog v-model="groupImportVisible" title="导入 - 群组 CSV 文件" width="500px">
      <el-upload class="upload-import-group" drag :before-upload="isCsv" :headers="uploadHeaders"
        :action="uploadAction('/group/importCsv')" :on-success="refreshGroup" :on-error="() => {
          refreshGroup()
          ElMessage.warning('CSV 文件存在数据结构或约束问题 - 可用数据已导入')
        }" multiple>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Drop csv file here or <em>click to import</em></div>
      </el-upload>
    </el-dialog>

    <!-- 功能导入对话框 -->
    <el-dialog v-model="funcImportVisible" title="导入 - 配置 CSV 文件" width="500px">
      <el-upload class="upload-import-func" drag :before-upload="isCsv" :headers="uploadHeaders"
        :action="uploadAction('/setting/importCsv')" :on-success="refreshGroup" :on-error="() => {
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
import { Filter, Search, DocumentAdd, DocumentCopy, Delete, InfoFilled, Setting, TurnOff, Odometer, Promotion, Monitor, Grid, Check, Close, UploadFilled } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { saveFileToLocal } from '@/utils/save'
import {
  getGroupListApi, getGroupPageApi, deleteGroupApi, updateGroupApi, exportGroupCsvApi,
  getGroupSettingApi, updateGroupSettingApi, exportGroupSettingCsvApi
} from '@/api/group'

const userType = inject('userType')
const syncTrigger = inject('syncTrigger')

const groupTableData = ref([])
const allGroupTableData = ref([])
const groupPageInfo = ref({ total: 0, size: 20, current: 1, pages: 0 })
const groupSearchKey = ref('')
const groupImportVisible = ref(false)

const groupSettingVisible = ref(false)
const groupForm = ref({ id: '', name: '', access: 0 })

const groupFuncVisible = ref(false)
const groupFuncForm = ref({
  groupId: '',
  limitScope: null, limitCapacity: 25, limitRefill: 10, limitInterval: 1,
  chatScope: null, chatStrategy: null, antiInjection: false, thinking: false, voice: false,
  innerCmdAuth: false, custom: false, autoReply: false, replyFrequency: 0.01,
  imageCollect: false, messageCollect: false, keywordDetect: false, pokeDetect: false, recallDetect: false,
  guessCropRatio: 0.1, guessTransparentRatio: 0.75, guessPadding: 250
})

const funcImportVisible = ref(false)

const hasGroupFilter = computed(() => groupSearchKey.value !== '')

const filteredGroupTableData = computed(() => {
  if (hasGroupFilter.value) {
    return allGroupTableData.value.filter(group => {
      return groupSearchKey.value === '' ||
        String(group.id).includes(groupSearchKey.value) || group.name.includes(groupSearchKey.value)
    })
  }
  return groupTableData.value
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

const refreshGroup = () => {
  getGroupList()
  getGroupPage(groupPageInfo.value.current, groupPageInfo.value.size)
}

const getGroupList = async () => {
  const res = await getGroupListApi()
  allGroupTableData.value = JSON.parse(JSON.stringify(res.data))
}

const getGroupPage = async (current, size) => {
  const res = await getGroupPageApi(current, size)
  groupTableData.value = JSON.parse(JSON.stringify(res.data.data))
  groupPageInfo.value.total = res.data.total
  groupPageInfo.value.size = res.data.size
  groupPageInfo.value.current = res.data.current
  groupPageInfo.value.pages = res.data.pages
}

const deleteGroup = async (group) => {
  const res = await deleteGroupApi(group.id)
  if (res.code === 1) {
    ElMessage.success(res.message)
    refreshGroup()
  } else {
    ElMessage.error(res.message)
  }
}

const handleGroupSetting = (row) => {
  groupForm.value = JSON.parse(JSON.stringify(row))
  groupSettingVisible.value = true
}

const handleGroupSettingSubmit = async () => {
  const res = await updateGroupApi(groupForm.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    refreshGroup()
    groupSettingVisible.value = false
  } else {
    ElMessage.error(res.message)
  }
}

const handleGroupFunc = async (row) => {
  const res = await getGroupSettingApi(row.id)
  if (res.code === 1) {
    groupFuncForm.value = JSON.parse(JSON.stringify(res.data))
    groupFuncForm.value.groupId = row.id
    groupFuncVisible.value = true
  } else {
    ElMessage.error(res.message)
  }
}

const handleGroupFuncSubmit = async () => {
  const res = await updateGroupSettingApi(groupFuncForm.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    groupFuncVisible.value = false
  } else {
    ElMessage.error(res.message)
  }
}

const exportGroupCsv = async () => {
  try {
    const res = await exportGroupCsvApi()
    saveFileToLocal(res, `Groups_${new Date().toLocaleString()}.csv`)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const exportFuncCsv = async () => {
  try {
    const res = await exportGroupSettingCsvApi()
    saveFileToLocal(res, `Settings_${new Date().toLocaleString()}.csv`)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const handleGroupCurrentChange = (current) => {
  getGroupPage(current, groupPageInfo.value.size)
  getGroupList()
}

const handleGroupSizeChange = (size) => {
  getGroupPage(1, size)
  getGroupList()
}

onMounted(() => {
  refreshGroup()
})

watch(syncTrigger, () => {
  refreshGroup()
})
</script>

<style scoped>
/* ===== 头部 ===== */
.group-header {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  margin-right: 20px;
  overflow: hidden;
}

.group-header-form {
  display: flex;
  width: 100%;
  gap: 0;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.group-header-form :deep(.el-form-item) {
  margin: 0;
}

.group-header-label {
  flex-shrink: 0;
  white-space: nowrap;
}

.group-header-search {
  flex: 2;
}

.group-header-search :deep(.el-input) {
  width: 100%;
}

.group-header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.group-header-btns {
  display: inline-flex;
  margin-right: 1px;
}

/* ===== 主区域 ===== */
.group-main {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: auto;
  padding: 20px;
}

.group-table {
  width: 100%;
}

/* ===== 操作列 ===== */
.group-actions {
  display: flex;
  gap: 2px;
  justify-content: center;
}

/* ===== 分页 ===== */
.group-footer {
  padding: 10px 20px;
}

.group-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-footer-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 30px;
}

/* ===== 群组设置对话框 ===== */
.setting-form :deep(.el-input),
.setting-form :deep(.el-select) {
  width: 90%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ===== 功能设置对话框 ===== */
.function-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

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

.func-form :deep(.el-input),
.func-form :deep(.el-select) {
  width: 250px;
}

.func-switch-indent {
  margin-left: 15px;
}

.func-switch {
  --el-switch-on-color: rgba(19, 206, 102, 0.75);
}

.group-func-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}
</style>
