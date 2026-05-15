<template>
  <el-main class="center-main">
    <div class="center-content">
      <el-descriptions title="用户信息" size="small" label-width="80px" class="center-section" :column="1" border>
        <el-descriptions-item label="ID">
          <el-tag type="danger">{{ info.id || '无' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="名称">
          <el-tag type="success">{{ info.username || '无' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          <el-tag>{{ info.email || '无' }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="访问信息" size="small" label-width="80px" class="center-section" :column="1" border>
        <el-descriptions-item label="Type">
          <el-tag type="warning">{{ userType }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Token">
          <el-tag type="warning" class="token-tag">{{ token }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div class="center-actions">
        <el-button type="success" round plain @click="handleAdminEdit" :disabled="userType === 0">
          <el-icon size="15">
            <Edit />
          </el-icon>&nbsp;修改信息
        </el-button>
        <el-button type="warning" round plain @click="handlePasswordChange" :disabled="userType === 0">
          <el-icon size="15">
            <Setting />
          </el-icon>&nbsp;修改密码
        </el-button>
        <el-popconfirm title="确认注销吗?" @confirm="deleteAdmin">
          <template #reference>
            <el-button type="primary" round plain :disabled="userType === 0">
              <el-icon size="15">
                <Delete />
              </el-icon>&nbsp;注销账号
            </el-button>
          </template>
        </el-popconfirm>
        <el-button type="danger" round plain @click="logout">
          <el-icon size="15">
            <SwitchButton />
          </el-icon>&nbsp;退出登录
        </el-button>
      </div>

      <!-- 个人信息编辑对话框 -->
      <el-dialog v-model="adminEditVisible" title="个人信息修改" width="500px">
        <el-form ref="adminEditFormRef" :model="adminEditForm" :rules="AdminEditFormRules" label-width="100px" class="dialog-form">
          <el-form-item label="ID">
            <el-input v-model="adminEditForm.id" :disabled="true" />
          </el-form-item>
          <el-form-item label="名称" prop="username">
            <el-input v-model="adminEditForm.username" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adminEditForm.email" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button plain @click="adminEditVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handleAdminEditSubmit">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 密码修改对话框 -->
      <el-dialog v-model="passwordChangeVisible" title="密码修改" width="500px">
        <el-form ref="passwordChangeFormRef" :model="passwordChangeForm" :rules="passwordChangeFormRules"
          label-width="100px" class="dialog-form">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passwordChangeForm.oldPassword" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordChangeForm.newPassword" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="passwordChangeForm.confirmPassword" show-password />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button plain @click="passwordChangeVisible = false">取消</el-button>
            <el-button plain type="primary" @click="handlePasswordChangeSubmit">更改</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-main>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit, Setting, Delete, SwitchButton } from '@element-plus/icons-vue'
import { getInfoApi, deleteApi, changePwdApi, updateApi } from '@/api/system'
import { createPasswordChangeFormRules, AdminEditFormRules } from '@/rules/center'

const router = useRouter()

const userType = inject('userType')
const info = inject('info')

const token = ref(localStorage.getItem('token') || '')

const adminEditVisible = ref(false)
const adminEditForm = ref({ id: 0, username: '', email: '' })
const adminEditFormRef = ref(null)

const passwordChangeVisible = ref(false)
const passwordChangeForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
const passwordChangeFormRef = ref(null)
const passwordChangeFormRules = createPasswordChangeFormRules(() => passwordChangeForm.value.newPassword)

const handlePasswordChange = () => {
  if (passwordChangeFormRef.value) {
    passwordChangeFormRef.value.resetFields()
  }
  passwordChangeForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  passwordChangeVisible.value = true
}

const handlePasswordChangeSubmit = async () => {
  if (!passwordChangeFormRef.value) return
  try {
    await passwordChangeFormRef.value.validate()
  } catch {
    ElMessage.warning('表单校验失败')
    return
  }
  const res = await changePwdApi(passwordChangeForm.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    passwordChangeVisible.value = false
  } else {
    ElMessage.error(`更改失败: ${res.message}`)
  }
}

const handleAdminEdit = () => {
  adminEditForm.value = JSON.parse(JSON.stringify(info.value))
  adminEditVisible.value = true
}

const handleAdminEditSubmit = async () => {
  if (!adminEditFormRef.value) return
  try {
    await adminEditFormRef.value.validate()
  } catch {
    ElMessage.warning('表单校验失败')
    return
  }
  const res = await updateApi(adminEditForm.value)
  if (res.code === 1) {
    await getInfo()
    ElMessage.success(res.message)
    adminEditVisible.value = false
  } else {
    ElMessage.error(`修改失败: ${res.message}`)
  }
}

const deleteAdmin = async () => {
  const res = await deleteApi()
  if (res.code === 1) {
    ElMessage.success(res.message)
    localStorage.clear()
    router.push('/login')
  } else {
    ElMessage.error(`删除失败: ${res.message}`)
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

const getInfo = async () => {
  const res = await getInfoApi()
  if (res.code === 1) {
    info.value = JSON.parse(JSON.stringify(res.data.info))
    userType.value = res.data.userType
  } else {
    ElMessage.error(`获取失败: ${res.message}`)
  }
}
</script>

<style scoped>
.center-main {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: clip;
  padding: 20px;
}

.center-content {
  margin-right: 20px;
}

.center-section {
  margin-bottom: 20px;
}

.token-tag {
  white-space: normal;
  word-break: break-all;
  height: auto;
  padding-top: 5px;
  padding-bottom: 5px;
}

.center-actions {
  position: fixed;
  bottom: 75px;
  right: 50px;
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
}

.dialog-form :deep(.el-input) {
  width: 90%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
