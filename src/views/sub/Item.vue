<template>
  <el-container>
    <!-- 头部操作 -->
    <el-header height="20px" class="item-header">
      <div class="item-header-left">
        <el-icon size="18px"><Filter /></el-icon>&nbsp;
        <el-form :inline="true" class="item-header-form">
          <el-form-item label="过滤器" class="item-header-label" />
          <el-form-item class="item-header-select">
            <el-select placeholder="All Types" v-model="itemSearchCategory">
              <el-option label="ALL" :value="''" />
              <el-option label="COMMON" :value="'COMMON'" />
              <el-option label="SPECIAL" :value="'SPECIAL'" />
              <el-option label="BREAD" :value="'BREAD'" />
              <el-option label="LOOTING" :value="'LOOTING'" />
            </el-select>
          </el-form-item>
          <el-form-item class="item-header-select">
            <el-select placeholder="All Rarity" v-model="itemSearchRarity">
              <el-option label="ALL" :value="''" />
              <el-option label="WHITE" :value="'WHITE'" />
              <el-option label="GREEN" :value="'GREEN'" />
              <el-option label="BLUE" :value="'BLUE'" />
              <el-option label="PURPLE" :value="'PURPLE'" />
              <el-option label="GOLD" :value="'GOLD'" />
              <el-option label="RED" :value="'RED'" />
            </el-select>
          </el-form-item>
          <el-form-item class="item-header-search">
            <el-input placeholder="请输入关键字..." :prefix-icon="Search" v-model="itemSearchKey" clearable />
          </el-form-item>
        </el-form>
      </div>
      <div class="item-header-right">
        <el-button-group class="item-header-btns">
          <el-button round plain @click="itemImportVisible = true" :disabled="userType === 0">
            <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;导入物品
          </el-button>
          <el-button round plain @click="handleItemAdding()" :disabled="userType === 0">
            <el-icon size="15"><Plus /></el-icon>&nbsp;新增物品
          </el-button>
          <el-button round plain @click="exportItemCsv()" :disabled="userType === 0">
            <el-icon size="15"><DocumentCopy /></el-icon>&nbsp;导出物品
          </el-button>
        </el-button-group>
      </div>
    </el-header>

    <el-main class="item-main">
      <el-table :data="filteredItemTableData" class="item-table" height="calc(100vh - 250px)">
        <template #empty>
          <el-empty description="暂无物品" />
        </template>
        <el-table-column v-if="hasItemFilter" type="index" label="序号" width="60" align="center" />
        <el-table-column v-if="!hasItemFilter" type="index" label="序号" width="60" align="center"
          :index="(itemPageInfo.current - 1) * itemPageInfo.size + 1" />
        <el-table-column label="物品ID" width="90" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="名称" min-width="150">
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="类别" width="100" align="center">
          <template v-slot="scope">{{ scope.row.category }}</template>
        </el-table-column>
        <el-table-column label="品质" width="100" align="center">
          <template v-slot="scope">{{ scope.row.rarity }}</template>
        </el-table-column>
        <el-table-column label="可获取" width="100" align="center">
          <template v-slot="scope">{{ scope.row.available ? 'YES' : 'NO' }}</template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100" align="center" :sortable="hasItemFilter">
          <template v-slot="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="重量" width="100" align="center">
          <template v-slot="scope">{{ scope.row.weight }}</template>
        </el-table-column>
        <el-table-column label="介绍" min-width="300" show-overflow-tooltip>
          <template v-slot="scope">{{ scope.row.description || '无介绍' }}</template>
        </el-table-column>
        <el-table-column label="指令" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">{{ scope.row.command || '无指令' }}</template>
        </el-table-column>
        <el-table-column label="图路径" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">{{ scope.row.imagePath || '无图片' }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template v-slot="scope">
            <div class="item-actions">
              <el-button type="warning" plain @click="handleItemSetting(scope.row)" size="small" title="设置"
                :disabled="userType === 0">
                <el-icon size="14"><Setting /></el-icon>
              </el-button>
              <el-popconfirm title="确认删除吗?" @confirm="deleteItem(scope.row)">
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
    <el-footer height="60px" class="item-footer">
      <div class="item-footer-row">
        <el-text v-if="hasItemFilter" class="item-footer-text">
          <el-icon><InfoFilled /></el-icon> 共 {{ filteredItemTableData.length }} 条记录
        </el-text>
        <el-text v-if="!hasItemFilter" class="item-footer-text">
          <el-icon><InfoFilled /></el-icon> 共 {{ itemPageInfo.total }} 条记录
        </el-text>
        <el-pagination v-if="!hasItemFilter" background @size-change="handleItemSizeChange"
          @current-change="handleItemCurrentChange" layout="sizes, prev, pager, next"
          :page-sizes="[10, 20, 30, 40]" :page-size="itemPageInfo.size" :total="itemPageInfo.total"
          :current-page="itemPageInfo.current" :pager-count="7" />
      </div>
    </el-footer>

    <!-- 物品设置对话框 -->
    <el-dialog v-model="itemSettingVisible" title="物品设置" width="500px">
      <el-form ref="itemSettingFormRef" :model="itemForm" label-width="100px" class="item-form">
        <el-form-item label="物品ID" prop="id">
          <el-input v-model="itemForm.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="名称" prop="name" :required="true">
          <el-input v-model="itemForm.name" placeholder="请输入名称..." />
        </el-form-item>
        <el-form-item label="类别" prop="category" :required="true">
          <el-select v-model="itemForm.category" placeholder="请选择类别...">
            <el-option label="COMMON" :value="0" />
            <el-option label="SPECIAL" :value="1" />
            <el-option label="BREAD" :value="2" />
            <el-option label="LOOTING" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="品质" prop="rarity" :required="true">
          <el-select v-model="itemForm.rarity" placeholder="请选择品质...">
            <el-option label="WHITE" :value="0" />
            <el-option label="GREEN" :value="1" />
            <el-option label="BLUE" :value="2" />
            <el-option label="PURPLE" :value="3" />
            <el-option label="GOLD" :value="4" />
            <el-option label="RED" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="可获得" prop="available" :required="true">
          <el-switch v-model="itemForm.available" inline-prompt
            class="item-switch"
            :active-icon="Check" :inactive-icon="Close" />
        </el-form-item>
        <el-form-item label="价格" prop="price" :required="true">
          <el-input v-model="itemForm.price" @input="v => itemForm.price = v.replace(/\D/g,'')" placeholder="请输入价格..."
            />
        </el-form-item>
        <el-form-item label="重量" prop="weight" :required="true">
          <el-input v-model="itemForm.weight" @input="v => itemForm.weight = v.replace(/\D/g,'')" placeholder="请输入重量..."
            />
        </el-form-item>
        <el-form-item label="介绍" prop="description">
          <el-input v-model="itemForm.description" placeholder="暂无介绍" type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }" />
        </el-form-item>
        <el-form-item label="指令" prop="command">
          <el-input v-model="itemForm.command" placeholder="暂无指令" />
        </el-form-item>
        <el-form-item label="图路径" prop="imagePath">
          <el-input v-model="itemForm.imagePath" placeholder="暂无路径" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain @click="itemSettingVisible = false">取消</el-button>
          <el-button plain type="primary" @click="handleItemSettingSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 物品新增对话框 -->
    <el-dialog v-model="itemAddingVisible" title="新增物品" width="500px">
      <el-form ref="itemAddingFormRef" :model="itemForm" label-width="100px" class="item-form">
        <el-form-item label="名称" prop="name" :required="true">
          <el-input v-model="itemForm.name" placeholder="请输入名称..." />
        </el-form-item>
        <el-form-item label="类别" prop="category" :required="true">
          <el-select v-model="itemForm.category" placeholder="请选择类别...">
            <el-option label="COMMON" :value="0" />
            <el-option label="SPECIAL" :value="1" />
            <el-option label="BREAD" :value="2" />
            <el-option label="LOOTING" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="品质" prop="rarity" :required="true">
          <el-select v-model="itemForm.rarity" placeholder="请选择品质...">
            <el-option label="WHITE" :value="0" />
            <el-option label="GREEN" :value="1" />
            <el-option label="BLUE" :value="2" />
            <el-option label="PURPLE" :value="3" />
            <el-option label="GOLD" :value="4" />
            <el-option label="RED" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="可获得" prop="available" :required="true">
          <el-switch v-model="itemForm.available" inline-prompt
            class="item-switch"
            :active-icon="Check" :inactive-icon="Close" />
        </el-form-item>
        <el-form-item label="价格" prop="price" :required="true">
          <el-input v-model="itemForm.price" @input="v => itemForm.price = v.replace(/\D/g,'')" placeholder="请输入价格..."
            />
        </el-form-item>
        <el-form-item label="重量" prop="weight" :required="true">
          <el-input v-model="itemForm.weight" @input="v => itemForm.weight = v.replace(/\D/g,'')" placeholder="请输入重量..."
            />
        </el-form-item>
        <el-form-item label="介绍" prop="description">
          <el-input v-model="itemForm.description" placeholder="暂无介绍" type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }" />
        </el-form-item>
        <el-form-item label="指令" prop="command">
          <el-input v-model="itemForm.command" placeholder="暂无指令" />
        </el-form-item>
        <el-form-item label="图路径" prop="imagePath">
          <el-input v-model="itemForm.imagePath" placeholder="暂无路径" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button plain @click="itemAddingVisible = false">取消</el-button>
          <el-button plain type="primary" @click="handleItemAddingSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 物品导入对话框 -->
    <el-dialog v-model="itemImportVisible" title="导入 - 物品 CSV 文件" width="500px">
      <el-upload class="upload-import-item" drag :before-upload="isCsv" :headers="uploadHeaders"
        :action="uploadAction('/item/importCsv')" :on-success="refreshItem" :on-error="() => {
          refreshItem()
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
import { Filter, Search, DocumentAdd, DocumentCopy, Delete, InfoFilled, Setting, Plus, Check, Close, UploadFilled } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { getItemListApi, getItemPageApi, updateItemApi, addItemApi, deleteItemApi, exportItemCsvApi } from '@/api/item'

const userType = inject('userType')
const syncTrigger = inject('syncTrigger')

const itemTableData = ref([])
const allItemTableData = ref([])
const itemPageInfo = ref({ total: 0, size: 20, current: 1, pages: 0 })
const itemSearchRarity = ref('')
const itemSearchCategory = ref('')
const itemSearchKey = ref('')
const itemImportVisible = ref(false)

const itemSettingVisible = ref(false)
const itemAddingVisible = ref(false)
const itemForm = ref({
  id: '', name: '', rarity: null, category: null, price: '', weight: '',
  description: '', command: '', imagePath: '', available: false
})

const hasItemFilter = computed(() => {
  return itemSearchCategory.value !== '' || itemSearchRarity.value !== '' || itemSearchKey.value !== ''
})

const filteredItemTableData = computed(() => {
  if (hasItemFilter.value) {
    return allItemTableData.value.filter(item => {
      const categoryMatch = itemSearchCategory.value === '' || item.category === itemSearchCategory.value
      const rarityMatch = itemSearchRarity.value === '' || item.rarity === itemSearchRarity.value
      const keyMatch = itemSearchKey.value === '' || item.name.includes(itemSearchKey.value)
      return categoryMatch && rarityMatch && keyMatch
    })
  }
  return itemTableData.value
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

const refreshItem = () => {
  getItemList()
  getItemPage(itemPageInfo.value.current, itemPageInfo.value.size)
}

const getItemList = async () => {
  const res = await getItemListApi()
  allItemTableData.value = JSON.parse(JSON.stringify(res.data.items))
}

const getItemPage = async (current, size) => {
  const res = await getItemPageApi(current, size)
  itemTableData.value = JSON.parse(JSON.stringify(res.data.itemPage.data))
  itemPageInfo.value.total = res.data.itemPage.total
  itemPageInfo.value.size = res.data.itemPage.size
  itemPageInfo.value.current = res.data.itemPage.current
  itemPageInfo.value.pages = res.data.itemPage.pages
}

const handleItemSetting = (row) => {
  itemForm.value = JSON.parse(JSON.stringify(row))
  itemSettingVisible.value = true
}

const handleItemSettingSubmit = async () => {
  const res = await updateItemApi(itemForm.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    refreshItem()
    itemSettingVisible.value = false
  } else {
    ElMessage.error(res.message)
  }
}

const handleItemAdding = () => {
  itemForm.value = {
    id: '', name: '', rarity: null, category: null, price: '', weight: '',
    description: '', command: '', imagePath: '', available: false
  }
  itemAddingVisible.value = true
}

const handleItemAddingSubmit = async () => {
  const res = await addItemApi(itemForm.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    refreshItem()
    itemAddingVisible.value = false
  } else {
    ElMessage.error(res.message)
  }
}

const deleteItem = async (item) => {
  const res = await deleteItemApi(item.id)
  if (res.code === 1) {
    ElMessage.success(res.message)
    refreshItem()
  } else {
    ElMessage.error(res.message)
  }
}

const exportItemCsv = async () => {
  try {
    const res = await exportItemCsvApi()
    const blob = new Blob([res])
    const elink = document.createElement('a')
    elink.download = `Items_${new Date().toLocaleString()}.csv`
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

const handleItemCurrentChange = (current) => {
  getItemPage(current, itemPageInfo.value.size)
  getItemList()
}

const handleItemSizeChange = (size) => {
  getItemPage(1, size)
  getItemList()
}

onMounted(() => {
  refreshItem()
})

watch(syncTrigger, () => {
  refreshItem()
})
</script>

<style scoped>
/* ===== 头部 ===== */
.item-header {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  margin-right: 20px;
  overflow: hidden;
}

.item-header-form {
  display: flex;
  width: 70%;
  gap: 0;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.item-header-form :deep(.el-form-item) {
  margin: 0;
}

.item-header-label {
  flex-shrink: 0;
  white-space: nowrap;
}

.item-header-select {
  flex: 1;
  min-width: 80px;
  max-width: 140px;
}

.item-header-select :deep(.el-select) {
  width: 100%;
}

.item-header-search {
  flex: 2;
  min-width: 150px;
  max-width: 500px;
}

.item-header-search :deep(.el-input) {
  width: 100%;
}

.item-header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.item-header-btns {
  display: inline-flex;
  margin-right: 1px;
}

/* ===== 主区域 ===== */
.item-main {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: auto;
  padding: 20px;
}

.item-table {
  width: 100%;
}

/* ===== 操作列 ===== */
.item-actions {
  display: flex;
  gap: 2px;
  justify-content: center;
}

/* ===== 分页 ===== */
.item-footer {
  padding: 10px 20px;
}

.item-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-footer-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 30px;
}

/* ===== 物品设置/新增对话框 ===== */
.item-form :deep(.el-input),
.item-form :deep(.el-textarea),
.item-form :deep(.el-select) {
  width: 90%;
}

.item-switch {
  --el-switch-on-color: rgba(19, 206, 102, 0.75);
  --el-switch-off-color: rgba(255, 73, 73, 0.75);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
