<template>
  <el-container>
    <!-- 头部操作 -->
    <el-header height="20px" class="user-header">
      <div class="user-header-left">
        <el-icon size="18px"><Filter /></el-icon>&nbsp;
        <el-form :inline="true" class="user-header-form">
          <el-form-item label="过滤器" class="user-header-label" />
          <el-form-item class="user-header-search">
            <el-input placeholder="请输入关键字..." :prefix-icon="Search" v-model="userSearchKey" clearable />
          </el-form-item>
        </el-form>
      </div>
      <div class="user-header-right">
        <el-button-group class="user-header-btns">
          <el-button round plain @click="inventoryImportVisible = true" :disabled="userType === 0">
            <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入库存
          </el-button>
          <el-button round plain @click="exportInventoryCsv()" :disabled="userType === 0">
            <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出库存
          </el-button>
          <el-button round plain @click="userImportVisible = true" :disabled="userType === 0">
            <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入用户
          </el-button>
          <el-button round plain @click="exportUserCsv()" :disabled="userType === 0">
            <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出用户
          </el-button>
        </el-button-group>
      </div>
    </el-header>

    <el-main class="user-main">
      <el-table :data="filteredUserTableData" class="user-table" height="calc(100vh - 250px)">
        <template #empty>
          <el-empty description="暂无用户" />
        </template>
        <el-table-column v-if="hasUserFilter" type="index" label="序号" width="60" align="center" />
        <el-table-column v-if="!hasUserFilter" type="index" label="序号" width="60" align="center"
          :index="(userPageInfo.current - 1) * userPageInfo.size + 1" />
        <el-table-column label="用户ID" min-width="120" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="昵称" min-width="200" align="center" show-overflow-tooltip>
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="限权" width="100" align="center">
          <template v-slot="scope">{{ scope.row.access }}</template>
        </el-table-column>
        <el-table-column label="等级" width="100" align="center">
          <template v-slot="scope">{{ scope.row.level }}</template>
        </el-table-column>
        <el-table-column label="现金" width="100" align="center">
          <template v-slot="scope">{{ scope.row.cash }}</template>
        </el-table-column>
        <el-table-column label="抽数" width="100" align="center">
          <template v-slot="scope">{{ scope.row.drawTimes }}</template>
        </el-table-column>
        <el-table-column label="库容" width="100" align="center">
          <template v-slot="scope">{{ scope.row.capacity }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="216" align="center">
          <template v-slot="scope">
            <div class="user-actions">
              <el-button type="success" plain size="small" @click="handleInventories(scope.row)" title="库存">
                <el-icon size="14"><Box /></el-icon>
              </el-button>
              <el-button type="warning" plain @click="handleUserSetting(scope.row)" size="small" title="设置"
                :disabled="userType === 0">
                <el-icon size="14"><Setting /></el-icon>
              </el-button>
              <el-popconfirm title="确认删除吗?" @confirm="deleteUser(scope.row)">
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
    <el-footer height="60px" class="user-footer">
      <div class="user-footer-row">
        <el-text v-if="hasUserFilter" class="user-footer-text">
          <el-icon><InfoFilled /></el-icon> 共 {{ filteredUserTableData.length }} 条记录
        </el-text>
        <el-text v-if="!hasUserFilter" class="user-footer-text">
          <el-icon><InfoFilled /></el-icon> 共 {{ userPageInfo.total }} 条记录
        </el-text>
        <el-pagination v-if="!hasUserFilter" background @size-change="handleUserSizeChange"
          @current-change="handleUserCurrentChange" layout="sizes, prev, pager, next"
          :page-sizes="[10, 20, 30, 40]" :page-size="userPageInfo.size" :total="userPageInfo.total"
          :current-page="userPageInfo.current" :pager-count="7" />
      </div>
    </el-footer>

    <!-- 用户设置对话框 -->
    <el-dialog v-model="userSettingVisible" title="用户设置" width="500px">
      <el-form ref="userSettingFormRef" :model="userForm" label-width="100px" class="user-form">
        <el-form-item label="用户ID" prop="id">
          <el-input v-model="userForm.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="userForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限" prop="access">
          <el-select v-model="userForm.access">
            <el-option label="II级 (超级管理)" :value="2" />
            <el-option label="I级 (管理)" :value="1" />
            <el-option label="0级 (用户)" :value="0" />
            <el-option label="-I级 (限制)" :value="-1" />
            <el-option label="-II级 (禁用)" :value="-2" />
          </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input v-model="userForm.level" @input="v => userForm.level = v.replace(/\D/g,'')" />
        </el-form-item>
        <el-form-item label="现金" prop="cash">
          <el-input v-model="userForm.cash" @input="v => userForm.cash = v.replace(/\D/g,'')" />
        </el-form-item>
        <el-form-item label="抽数" prop="drawTimes">
          <el-input v-model="userForm.drawTimes" @input="v => userForm.drawTimes = v.replace(/\D/g,'')" />
        </el-form-item>
        <el-form-item label="仓库容量" prop="capacity">
          <el-input v-model="userForm.capacity" @input="v => userForm.capacity = v.replace(/\D/g,'')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain @click="userSettingVisible = false">取消</el-button>
          <el-button plain type="primary" @click="handleUserSettingSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户库存对话框 -->
    <el-dialog v-model="inventoriesVisible" :title="inventoriesTitle" width="55%">
      <el-table :data="inventoriesData" class="user-table" stripe>
        <template #empty>
          <el-empty description="暂无库存" />
        </template>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="库存ID" width="90" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="物品ID" width="90" align="center">
          <template v-slot="scope">{{ scope.row.itemId }}</template>
        </el-table-column>
        <el-table-column label="名称" min-width="150">
          <template v-slot="scope">{{ scope.row.itemName }}</template>
        </el-table-column>
        <el-table-column label="类别" width="100" align="center">
          <template v-slot="scope">{{ scope.row.category }}</template>
        </el-table-column>
        <el-table-column label="品质" width="100" align="center">
          <template v-slot="scope">{{ scope.row.rarity }}</template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100" align="center" sortable>
          <template v-slot="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="数量" width="100" align="center">
          <template v-slot="scope">{{ scope.row.amount }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template v-slot="scope">
            <div class="user-actions">
              <el-button type="warning" plain @click="handleInventorySetting(scope.row)" size="small" title="设置"
                :disabled="userType === 0">
                <el-icon size="14"><Setting /></el-icon>
              </el-button>
              <el-popconfirm title="确认删除吗?" @confirm="deleteInventory(scope.row)">
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
      <template #footer>
        <div class="inventories-dialog-footer">
          <el-form-item prop="newItemId" class="inventory-add-item">
            <el-input :prefix-icon="Box" v-model="newItemId" @input="v => newItemId = v.replace(/\D/g,'')"
              placeholder="请输入新增库存物品ID..." class="inventory-add-input" />
          </el-form-item>
          <el-button plain type="primary" @click="addInventory(inventoriesUserId, newItemId)" class="inventory-add-btn"
            :disabled="userType === 0">
            <el-icon size="15px"><Plus /></el-icon>&nbsp;新增库存
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 库存设置对话框 -->
    <el-dialog v-model="inventorySettingVisible" title="库存设置" width="500px">
      <el-form ref="inventorySettingFormRef" :model="inventoryForm" label-width="100px" class="user-form">
        <el-form-item label="库存ID" prop="id">
          <el-input v-model="inventoryForm.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="物品ID" prop="itemId">
          <el-input v-model="inventoryForm.itemId" :disabled="true" />
        </el-form-item>
        <el-form-item label="名称" prop="itemName">
          <el-input v-model="inventoryForm.itemName" :disabled="true" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select v-model="inventoryForm.category" :disabled="true" />
        </el-form-item>
        <el-form-item label="品质" prop="rarity">
          <el-select v-model="inventoryForm.rarity" :disabled="true" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="inventoryForm.price" :disabled="true" />
        </el-form-item>
        <el-form-item label="数量" prop="amount" :required="true">
          <el-input v-model="inventoryForm.amount" @input="v => inventoryForm.amount = v.replace(/\D/g,'')"
            placeholder="请输入数量..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain @click="inventorySettingVisible = false">取消</el-button>
          <el-button plain type="primary" @click="handleInventorySettingSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog v-model="userImportVisible" title="导入 - 用户 CSV 文件" width="500px">
      <el-upload class="upload-import-user" drag :before-upload="isCsv" :headers="uploadHeaders"
        :action="uploadAction('/user/importCsv')" :on-success="refreshUser" :on-error="(error, file, fileList) => {
          refreshUser()
          ElMessage.warning('CSV 文件存在数据结构或约束问题 - 可用数据已导入')
        }" multiple>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Drop csv file here or <em>click to import</em></div>
      </el-upload>
    </el-dialog>

    <!-- 库存导入对话框 -->
    <el-dialog v-model="inventoryImportVisible" title="导入 - 库存 CSV 文件" width="500px">
      <el-upload class="upload-import-inventory" drag :before-upload="isCsv" :headers="uploadHeaders"
        :action="uploadAction('/inventory/importCsv')" :on-error="(error, file, fileList) => {
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
import { Filter, Search, DocumentAdd, DocumentCopy, Delete, InfoFilled, Box, Setting, Plus, UploadFilled } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { getUserListApi, getUserPageApi, deleteUserApi, updateUserApi, exportUserCsvApi } from '@/api/user'
import { getInventoryListApi, deleteInventoryApi, updateInventoryApi, addInventoryApi, exportInventoryCsvApi } from '@/api/inventory'

const userType = inject('userType')
const syncTrigger = inject('syncTrigger')

const userTableData = ref([])
const allUserTableData = ref([])
const userPageInfo = ref({ total: 0, size: 20, current: 1, pages: 0 })
const userSearchKey = ref('')
const userImportVisible = ref(false)

const userSettingVisible = ref(false)
const userForm = ref({ id: '', name: '', access: 0, level: 0, cash: 0, capacity: 100, drawTimes: 50 })

const inventoriesVisible = ref(false)
const inventoriesData = ref([])
const inventoriesUserId = ref('')
const inventoriesTitle = ref('')

const inventorySettingVisible = ref(false)
const newItemId = ref('')
const inventoryForm = ref({ id: '', ownerId: '', itemId: '', itemName: '', category: null, rarity: null, price: '', amount: '' })

const inventoryImportVisible = ref(false)

const hasUserFilter = computed(() => userSearchKey.value !== '')

const filteredUserTableData = computed(() => {
  if (hasUserFilter.value) {
    return allUserTableData.value.filter(user => {
      return userSearchKey.value === '' ||
        String(user.id).includes(userSearchKey.value) || user.name.includes(userSearchKey.value)
    })
  }
  return userTableData.value
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

const refreshUser = () => {
  getUserList()
  getUserPage(userPageInfo.value.current, userPageInfo.value.size)
}

const getUserList = async () => {
  const res = await getUserListApi()
  allUserTableData.value = JSON.parse(JSON.stringify(res.data.users))
}

const getUserPage = async (current, size) => {
  const res = await getUserPageApi(current, size)
  userTableData.value = JSON.parse(JSON.stringify(res.data.userPage.data))
  userPageInfo.value.total = res.data.userPage.total
  userPageInfo.value.size = res.data.userPage.size
  userPageInfo.value.current = res.data.userPage.current
  userPageInfo.value.pages = res.data.userPage.pages
}

const deleteUser = async (user) => {
  const res = await deleteUserApi(user.id)
  if (res.code === 1) {
    ElMessage.success(res.message)
    refreshUser()
  } else {
    ElMessage.error(res.message)
  }
}

const handleUserSetting = (row) => {
  userForm.value = JSON.parse(JSON.stringify(row))
  userSettingVisible.value = true
}

const handleUserSettingSubmit = async () => {
  const res = await updateUserApi(userForm.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    refreshUser()
    userSettingVisible.value = false
  } else {
    ElMessage.error(res.message)
  }
}

const exportUserCsv = async () => {
  try {
    const res = await exportUserCsvApi()
    const blob = new Blob([res])
    const elink = document.createElement('a')
    elink.download = `Users_${new Date().toLocaleString()}.csv`
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

const handleUserCurrentChange = (current) => {
  getUserPage(current, userPageInfo.value.size)
  getUserList()
}

const handleUserSizeChange = (size) => {
  getUserPage(1, size)
  getUserList()
}

// 库存相关
const handleInventories = (row) => {
  inventoriesUserId.value = row.id
  inventoriesTitle.value = `库存 - ${row.name}`
  newItemId.value = ''
  getInventoryList(row.id)
  inventoriesVisible.value = true
}

const getInventoryList = async (id) => {
  const res = await getInventoryListApi(id)
  inventoriesData.value = JSON.parse(JSON.stringify(res.data.inventories))
}

const deleteInventory = async (inventory) => {
  const res = await deleteInventoryApi(inventory.id)
  if (res.code === 1) {
    ElMessage.success(res.message)
    getInventoryList(inventory.ownerId)
  } else {
    ElMessage.error(res.message)
  }
}

const handleInventorySetting = (row) => {
  inventoryForm.value = JSON.parse(JSON.stringify(row))
  inventorySettingVisible.value = true
}

const handleInventorySettingSubmit = async () => {
  const res = await updateInventoryApi(inventoryForm.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    getInventoryList(inventoryForm.value.ownerId)
    inventorySettingVisible.value = false
  } else {
    ElMessage.error(res.message)
  }
}

const addInventory = async (userId, itemId) => {
  const res = await addInventoryApi(userId, itemId)
  if (res.code === 1) {
    ElMessage.success(res.message)
    getInventoryList(userId)
  } else {
    ElMessage.error(res.message)
  }
}

const exportInventoryCsv = async () => {
  try {
    const res = await exportInventoryCsvApi()
    const blob = new Blob([res])
    const elink = document.createElement('a')
    elink.download = `Inventories_${new Date().toLocaleString()}.csv`
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

onMounted(() => {
  refreshUser()
})

watch(syncTrigger, () => {
  refreshUser()
})
</script>

<style scoped>
/* ===== 头部 ===== */
.user-header {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  margin-right: 20px;
  overflow: hidden;
}

.user-header-form {
  display: flex;
  width: 100%;
  gap: 0;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.user-header-form :deep(.el-form-item) {
  margin: 0;
}

.user-header-label {
  flex-shrink: 0;
  white-space: nowrap;
}

.user-header-search {
  flex: 2;
}

.user-header-search :deep(.el-input) {
  width: 100%;
}

.user-header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.user-header-btns {
  display: inline-flex;
  margin-right: 1px;
}

/* ===== 主区域 ===== */
.user-main {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: auto;
  padding: 20px;
}

.user-table {
  width: 100%;
}

/* ===== 操作列 ===== */
.user-actions {
  display: flex;
  gap: 2px;
  justify-content: center;
}

/* ===== 分页 ===== */
.user-footer {
  padding: 10px 20px;
}

.user-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-footer-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 30px;
}

/* ===== 用户设置/库存设置对话框 ===== */
.user-form :deep(.el-input),
.user-form :deep(.el-select) {
  width: 90%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ===== 库存对话框 ===== */
.inventories-dialog-footer {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 16px;
}

.inventories-dialog-footer :deep(.el-form-item) {
  margin-bottom: 0;
  flex: 1;
}

.inventory-add-input :deep(.el-input) {
  width: 100%;
}

.inventory-add-btn {
  width: 200px;
}
</style>
