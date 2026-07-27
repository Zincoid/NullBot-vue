<template>
  <el-container>
    <!-- 文件操作栏 -->
    <el-header height="20px" class="file-header">
      <div class="file-breadcrumb">
        <el-icon size="20"><HomeFilled /></el-icon>
        <el-text size="large">{{ " " + curDir }}&nbsp;</el-text>
        <el-button type="primary" :link="true" title="复制路径" @click="copyCurDir">
          <el-icon size="15"><DocumentCopy /></el-icon>
        </el-button>
      </div>

      <div class="file-toolbar">
        <el-upload multiple ref="uploadRef" class="upload" action="" :file-list="uploadFileList"
          :on-change="handleFileChange" :on-remove="handleFileChange" :auto-upload="false">
          <template #trigger>
            <el-button type="primary" plain :disabled="uploading || userType === 0">
              <el-icon size="15"><DocumentAdd /></el-icon>&nbsp;{{ uploading ? uploadFilesTotal + "/" + uploadFileList.length : "添加文件" }}
            </el-button>
          </template>
        </el-upload>

        <el-button class="ml-1" type="success" plain @click="upload" :loading="uploading"
          :disabled="userType === 0">
          <el-icon v-if="!uploading" size="15"><UploadFilled /></el-icon>&nbsp;{{ uploading ? "处理中..." : "上传" }}
        </el-button>

        <el-button-group class="file-btn-group">
          <el-button round plain @click="backDir">
            <el-icon size="15"><RefreshLeft /></el-icon>&nbsp;返回上级
          </el-button>
          <el-button round plain @click="createDir" :disabled="userType === 0">
            <el-icon size="15"><FolderAdd /></el-icon>&nbsp;新建目录
          </el-button>
        </el-button-group>
      </div>
    </el-header>

    <el-main class="file-main">
      <el-table :data="fileTableData" class="file-table" height="calc(100vh - 250px)">
        <template #empty>
          <el-empty description="暂无文件" />
        </template>
        <el-table-column type="index" label="序号" width="80" align="center"
          :index="(filePageInfo.current - 1) * filePageInfo.size + 1" />
        <el-table-column label="文件名" min-width="300" show-overflow-tooltip>
          <template v-slot="scope">
            <div class="file-name-cell">
              <el-icon class="file-name-icon"><Folder v-if="scope.row.isDir" /><Document v-else /></el-icon>
              <span v-if="scope.row.isDir" class="file-name-link file-name-dir"
                @click="enterDir(scope.row)" :title="`进入文件夹: ${scope.row.fileName}`">
                {{ scope.row.fileName }}
              </span>
              <span v-else-if="isPreviewable(scope.row)" class="file-name-link file-name-preview"
                @click="handlePreview(scope.row)" :title="`预览文件: ${scope.row.fileName}`">
                {{ scope.row.fileName }}
              </span>
              <span v-else class="file-name-plain">{{ scope.row.fileName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所有者" width="100" align="center" show-overflow-tooltip>
          <template v-slot="scope">
            {{ scope.row.ownerId != null ? (scope.row.ownerName ? `${scope.row.ownerName}(${scope.row.ownerId})`
              : `(${scope.row.ownerId})`) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="修改日期" width="160" align="center">
          <template v-slot="scope">
            {{ scope.row.lastModified === null ? '-' : scope.row.lastModified.replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column label="文件大小" width="100" align="center">
          <template v-slot="scope">
            {{ scope.row.isDir ? '-' : formatFileSize(scope.row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column label="文件类型" width="100" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.isDir ? 'info' : 'success'" effect="plain" round class="file-type-tag">
              {{ scope.row.isDir ? '文件夹' : getFileExtension(scope.row.fileName) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="userType === 1" label="可见性" width="100" align="center">
          <template v-slot="scope">
            <el-switch v-model="scope.row.visible" inline-prompt :active-icon="Check" :inactive-icon="Close"
              class="file-switch" :loading="scope.row._loading"
              :before-change="() => changeFileVisible(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="275" align="center">
          <template v-slot="scope">
            <div class="file-actions">
              <el-button type="info" plain @click="handlePreview(scope.row)" v-if="isPreviewable(scope.row)"
                size="small" title="预览">
                <el-icon size="14"><Picture /></el-icon>
              </el-button>
              <el-button type="info" plain size="small" @click="enterDir(scope.row)"
                v-if="scope.row.isDir" title="进入文件夹">
                <el-icon size="14"><FolderOpened /></el-icon>
              </el-button>
              <el-button type="success" plain size="small" @click="download(scope.row)"
                v-if="!scope.row.isDir" title="下载">
                <el-icon size="14"><Download /></el-icon>
              </el-button>
              <el-button type="warning" plain size="small" @click="handleRename(scope.row)" title="重命名"
                :disabled="userType === 0">
                <el-icon size="14"><Edit /></el-icon>
              </el-button>
              <el-button type="primary" plain size="small" @click="handleMove(scope.row)" title="移动"
                :disabled="userType === 0">
                <el-icon size="14"><CopyDocument /></el-icon>
              </el-button>
              <el-popconfirm title="确认删除吗?" @confirm="deleteFile(scope.row)">
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
    <el-footer height="60px" class="file-footer">
      <div class="file-footer-row">
        <el-text class="file-footer-text">
          <el-icon><InfoFilled /></el-icon> 共 {{ filePageInfo.total }} 条记录
        </el-text>
        <el-pagination background @size-change="handleFileSizeChange" @current-change="handleFileCurrentChange"
          layout="sizes, prev, pager, next" :page-sizes="[10, 20, 30, 40]" :page-size="filePageInfo.size"
          :total="filePageInfo.total" :current-page="filePageInfo.current" :pager-count="7" />
      </div>
    </el-footer>

    <!-- 搜索对话框 -->
    <el-dialog title="搜索结果" v-model="searchTableVisible" width="75%">
      <el-table :data="searchData" class="file-table" stripe>
        <template #empty>
          <el-empty description="无搜索结果" />
        </template>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="文件名" min-width="200">
          <template v-slot="scope">
            <div class="file-search-name">{{ scope.row.fileName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所有者" width="100" align="center" show-overflow-tooltip>
          <template v-slot="scope">
            {{ scope.row.ownerId != null ? (scope.row.ownerName ? `${scope.row.ownerName}(${scope.row.ownerId})`
              : `(${scope.row.ownerId})`) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="修改日期" width="160" align="center">
          <template v-slot="scope">
            {{ scope.row.lastModified === null ? '-' : scope.row.lastModified.replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column label="文件大小" width="120" align="center">
          <template v-slot="scope">
            {{ scope.row.isDir ? '-' : formatFileSize(scope.row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column label="文件类型" width="100" align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.isDir ? 'info' : 'success'" effect="plain" round class="file-type-tag">
              {{ scope.row.isDir ? '文件夹' : getFileExtension(scope.row.fileName) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="userType === 1" label="可见性" width="100" align="center">
          <template v-slot="scope">
            <el-switch v-model="scope.row.visible" inline-prompt :active-icon="Check" :inactive-icon="Close"
              class="file-switch file-switch-search" :loading="scope.row._loading"
              :before-change="() => changeFileVisible(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="216" align="center">
          <template v-slot="scope">
            <div class="file-actions">
              <el-button type="info" plain @click="handlePreview(scope.row)" v-if="isPreviewable(scope.row)"
                size="small" title="预览">
                <el-icon size="14"><Picture /></el-icon>
              </el-button>
              <el-button type="primary" plain size="small" @click="enterDir(scope.row)" v-if="scope.row.isDir"
                title="进入文件夹">
                <el-icon size="14"><FolderOpened /></el-icon>
              </el-button>
              <el-button type="success" plain size="small" @click="download(scope.row)" v-if="!scope.row.isDir"
                title="下载">
                <el-icon size="14"><Download /></el-icon>
              </el-button>
              <el-button type="warning" plain size="small" @click="handleRename(scope.row)" title="重命名"
                :disabled="userType === 0">
                <el-icon size="14"><Edit /></el-icon>
              </el-button>
              <el-popconfirm title="确认删除吗?" @confirm="deleteFile(scope.row)">
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
    </el-dialog>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" :title="previewTitle" :destroy-on-close="true" width="70%" top="5vh" center>
      <div class="preview-wrapper">
        <el-image v-if="previewType === 'image'" :src="previewUrl" :preview-src-list="[previewUrl]" fit="contain"
          class="preview-image" :hide-on-click-modal="true" />
        <video v-else-if="previewType === 'video'" ref="previewMediaRef" :src="previewUrl" controls autoplay class="preview-video">
          您的浏览器不支持 video 标签。
        </video>
        <audio v-else-if="previewType === 'audio'" ref="previewMediaRef" :src="previewUrl" controls autoplay class="preview-audio">
          您的浏览器不支持 audio 标签。
        </audio>
      </div>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, inject, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  HomeFilled, DocumentCopy, DocumentAdd, UploadFilled, RefreshLeft, FolderAdd,
  Folder, Document, Check, Close, Picture, FolderOpened, Download, Edit, CopyDocument,
  Delete, InfoFilled
} from '@element-plus/icons-vue'
import request from '@/utils/request'
import { saveFileToLocal } from '@/utils/save'
import {
  getFilePageApi, searchFileApi, deleteFileApi, uploadFileApi,
  downloadFileApi, createDirApi, renameFileApi, moveFileApi, setVisibleApi
} from '@/api/file'

const userType = inject('userType')
const syncTrigger = inject('syncTrigger')
const searchKey = inject('searchKey')
const searchTrigger = inject('searchTrigger')

const uploadRef = ref(null)

const curDir = ref('/')
const fileTableData = ref([])
const filePageInfo = ref({ total: 0, size: 20, current: 1, pages: 0 })

const searchTableVisible = ref(false)
const searchData = ref([])

const uploadDir = ref('')
const uploadFileList = ref([])
const uploadFilesTotal = ref(0)
const uploading = ref(false)

const previewVisible = ref(false)
const previewUrl = ref('')
const previewType = ref('')
const previewTitle = ref('')
const previewMediaRef = ref(null)

const getFileExtension = (fileName) => {
  if (!fileName) return '未知类型'
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return '未知类型'
  }
  const extension = fileName.substring(lastDotIndex + 1).toLowerCase()
  return extension.length > 8 ? extension.substring(0, 8) + '...' : extension
}

const isPreviewable = (file) => {
  if (file.isDir) return false
  const fileName = file.fileName.toLowerCase()
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma', '.opus']
  return imageExtensions.some(ext => fileName.endsWith(ext)) ||
    videoExtensions.some(ext => fileName.endsWith(ext)) ||
    audioExtensions.some(ext => fileName.endsWith(ext))
}

const handlePreview = async (file) => {
  const baseUrl = request?.defaults?.baseURL || ''
  previewUrl.value = `${baseUrl}/oss/${file.id}`
  // previewUrl.value = `${baseUrl}/oss/${file.id}?token=${encodeURIComponent(localStorage.getItem('token') || '')}`
  const fileName = file.fileName.toLowerCase()
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  previewType.value = imageExtensions.some(ext => fileName.endsWith(ext)) ? 'image' : (videoExtensions.some(ext => fileName.endsWith(ext)) ? 'video' : 'audio')
  previewTitle.value = `预览 - ${file.fileName}`
  previewVisible.value = true
  await nextTick()
  if (previewMediaRef.value) {
    previewMediaRef.value.volume = 0.25
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const copyCurDir = async () => {
  const text = curDir.value
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.left = "-999px"
  textArea.style.top = "-999px"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      ElMessage.success("路径已复制")
    } else if (document.execCommand('copy')) {
      ElMessage.success("路径已复制")
    } else {
      prompt("请手动复制以下路径：", text)
    }
  } catch (err) {
    ElMessage.warning("复制失败")
  } finally {
    document.body.removeChild(textArea)
  }
}

const getFilePage = async (current, size) => {
  const res = await getFilePageApi(current, size, curDir.value)
  fileTableData.value = JSON.parse(JSON.stringify(res.data.data))
  filePageInfo.value.total = res.data.total
  filePageInfo.value.size = res.data.size
  filePageInfo.value.current = res.data.current
  filePageInfo.value.pages = res.data.pages
}

const searchFile = async () => {
  const res = await searchFileApi(searchKey.value, curDir.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    searchData.value = JSON.parse(JSON.stringify(res.data))
    searchTableVisible.value = true
  } else {
    ElMessage.error(res.message)
  }
}

const deleteFile = async (file) => {
  const res = await deleteFileApi(file.id)
  if (res.code === 1) {
    ElMessage.success(res.message)
    getFilePage(filePageInfo.value.current, filePageInfo.value.size)
    if (searchTableVisible.value === true) {
      searchFile()
    }
  } else {
    ElMessage.error(`${file.fileName} - ${res.message}`)
  }
}

const upload = async () => {
  if (uploadFileList.value.length === 0) {
    ElMessage.warning("未选择文件")
    return
  }
  uploadDir.value = curDir.value
  uploadFilesTotal.value = 0
  uploading.value = true
  for (let fileObj of uploadFileList.value) {
    try {
      let formData = new FormData()
      formData.append("file", fileObj.raw)
      formData.append("directory", curDir.value)
      const res = await uploadFileApi(formData)
      if (res.code === 1) {
        ElMessage.success(`${fileObj.name} - 上传成功`)
      } else {
        ElMessage.error(`${fileObj.name} - ${res.message}`)
      }
    } catch (err) {
      console.error("上传失败:", err)
      ElMessage.error(`${fileObj.name} - Exception: ${err}`)
    }
    uploadFilesTotal.value++
  }
  uploadFileList.value = []
  uploadRef.value.clearFiles()
  if (curDir.value === uploadDir.value) {
    if (filePageInfo.value.pages === 0) {
      getFilePage(1, filePageInfo.value.size)
    } else {
      getFilePage(filePageInfo.value.pages, filePageInfo.value.size)
    }
  }
  uploading.value = false
}

const handleFileChange = (file, fileList) => {
  uploadFileList.value = fileList
}

const download = async (file) => {
  try {
    const res = await downloadFileApi(file.id)
    saveFileToLocal(res, file.fileName)
    ElMessage.success('下载成功')
  } catch (err) {
    ElMessage.error('下载失败')
  }
}

const enterDir = (dir) => {
  curDir.value = dir.directory === "/" ? "/" + dir.fileName : dir.directory + "/" + dir.fileName
  getFilePage(1, filePageInfo.value.size)
  searchTableVisible.value = false
}

const backDir = () => {
  if (curDir.value === "/") {
    ElMessage.warning("已在根目录")
  } else {
    let index = curDir.value.lastIndexOf('/')
    if (index === 0) {
      curDir.value = "/"
    } else {
      curDir.value = curDir.value.substring(0, index)
    }
  }
  getFilePage(1, filePageInfo.value.size)
}

const createDir = () => {
  ElMessageBox.prompt('请输入目录名', '新建目录', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^(?!.*(\/)|(\\))/,
    inputErrorMessage: "目录名不能包含斜杠"
  }).then(async ({ value }) => {
    if (!value) {
      ElMessage({ type: 'error', message: '目录名不能为空' })
    } else {
      const res = await createDirApi(curDir.value, value)
      if (res.code === 1) {
        ElMessage({ type: 'success', message: value + '创建成功!' })
        getFilePage(filePageInfo.value.current, filePageInfo.value.size)
      } else {
        ElMessage({ type: 'error', message: res.message })
      }
    }
  }).catch(() => {
    ElMessage({ type: 'info', message: '取消创建' })
  })
}

const handleRename = (file) => {
  ElMessageBox.prompt('请输入新的文件名', '重命名', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: file.fileName,
    inputPattern: /^[^\\\/:*?"<>|]+$/,
    inputErrorMessage: '名称非法：文件名不能包含 \\ / : * ? " < > | 等字符'
  }).then(async ({ value }) => {
    if (!value || value.trim() === '') {
      ElMessage.error('文件名不能为空')
      return
    }
    if (value === file.fileName) {
      ElMessage.warning('文件名未更改')
      return
    }
    const res = await renameFileApi(file.id, value)
    if (res.code === 1) {
      getFilePage(filePageInfo.value.current, filePageInfo.value.size)
      if (searchTableVisible.value) {
        searchFile()
      }
      ElMessage.success('重命名成功')
    } else {
      ElMessage.error(`${file.fileName} - ${res.message}`)
    }
  }).catch(() => {
    ElMessage.info('已取消重命名')
  })
}

const handleMove = (file) => {
  ElMessageBox.prompt('请输入移动至的目录路径', '移动文件', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: curDir.value,
    inputPattern: /^\/$|^\/([^\/]+\/)*[^\/]+$/,
    inputErrorMessage: '路径非法：非空且不能有连续 / 且除根外不能以 / 结尾'
  }).then(async ({ value }) => {
    if (!value || value.trim() === '') {
      ElMessage.error('路径不能为空')
      return
    }
    if (value === curDir.value) {
      ElMessage.warning('路径未更改')
      return
    }
    const res = await moveFileApi(file.id, value)
    if (res.code === 1) {
      getFilePage(filePageInfo.value.current, filePageInfo.value.size)
      if (searchTableVisible.value) {
        searchFile()
      }
      ElMessage.success('移动成功')
    } else {
      ElMessage.error(`${res.message}`)
    }
  }).catch(() => {
    ElMessage.info('已取消移动')
  })
}

const changeFileVisible = (row) => {
  return new Promise(async (resolve, reject) => {
    try {
      row._loading = true
      const res = await setVisibleApi(row.id, !row.visible)
      if (res.code === 1) {
        getFilePage(filePageInfo.value.current, filePageInfo.value.size)
        if (searchTableVisible.value) {
          searchFile()
        }
        ElMessage.success('修改成功')
        return resolve(true)
      } else {
        ElMessage.error('修改失败')
        return reject(false)
      }
    } catch (err) {
      ElMessage.error('请求失败')
      reject(false)
    }
  })
}

const handleFileCurrentChange = (current) => {
  getFilePage(current, filePageInfo.value.size)
}

const handleFileSizeChange = (size) => {
  getFilePage(1, size)
}

onMounted(() => {
  getFilePage(1, filePageInfo.value.size)
})

watch(syncTrigger, () => {
  getFilePage(filePageInfo.value.current, filePageInfo.value.size)
})

watch(searchTrigger, () => {
  if (searchKey.value) {
    searchFile()
  }
})
</script>

<style scoped>
/* ===== 操作栏 ===== */
.file-header {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-breadcrumb {
  display: flex;
  align-items: center;
  padding-right: 5px;
}

.file-toolbar {
  display: flex;
  align-items: center;
}

.file-btn-group {
  margin-left: 15px;
  margin-right: 1px;
  display: inline-flex;
}

/* ===== 上传组件 ===== */
.upload {
  position: relative;
  display: inline-flex;
  padding-left: 5px;
}

:deep(.upload .el-upload-list) {
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

/* ===== 主内容区 ===== */
.file-main {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: auto;
  padding: 20px;
}

.file-table {
  width: 100%;
}

/* ===== 文件名列 ===== */
.file-name-cell {
  display: flex;
  align-items: center;
}

.file-name-icon {
  margin-right: 8px;
}

.file-name-link {
  cursor: pointer;
  text-decoration: none;
}

.file-name-link:hover {
  text-decoration: underline;
}

.file-name-dir {
  color: #409eff;
}

.file-name-preview {
  color: #67c23a;
}

.file-name-plain {
  color: #cdd1da;
}

/* ===== 类型标签 & 可见性开关 ===== */
.file-type-tag {
  min-width: 70px;
}

.file-switch {
  --el-switch-on-color: rgba(218, 62, 113, 0.95);
}

.file-switch-search {
  --el-switch-on-color: rgba(102, 192, 58, 0.81);
}

/* ===== 操作列 ===== */
.file-actions {
  display: flex;
  gap: 2px;
  justify-content: center;
}

/* ===== 底部分页 ===== */
.file-footer {
  padding: 10px 20px;
}

.file-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-footer-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 30px;
}

/* ===== 搜索对话框 ===== */
.file-search-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== 预览对话框 ===== */
.preview-wrapper {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100%;
  display: flex;
  justify-content: center;
}

:deep(.el-image-viewer__actions),
:deep(.el-image-viewer__close) {
  background-color: #33333388;
}

.preview-video {
  max-width: 100%;
  max-height: 65vh;
}

.preview-audio {
  width: 100%;
}
</style>
