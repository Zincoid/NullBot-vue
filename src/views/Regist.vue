<template>
  <div class="regist-root">
    <div class="regist-form-wrapper">
      <h1 class="regist-title">&nbsp;&nbsp;&nbsp;&nbsp;Hi! NullBot =]</h1>
      <el-form ref="registFormRef" :model="registForm" :rules="registFormRules" label-width="40px" class="regist-form"
        hide-required-asterisk>
        <el-form-item label="账号" prop="id">
          <el-input placeholder="请输入账号 (QQ)..." v-model="registForm.id"
            @input="registForm.id = registForm.id.replace(/\D/g, '')"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码..." v-model="registForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱..." v-model="registForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密钥" prop="activationCode">
          <el-input placeholder="请输入激活码..." v-model="registForm.activationCode"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="regist-btn-wrapper">
            <el-button type="danger" plain class="regist-btn" @click="regist">
              <el-icon size="15">
                <User />
              </el-icon>&nbsp;注册
            </el-button>
          </div>
        </el-form-item>
        <div class="regist-link-wrapper">
          <el-link type="primary" @click="toLogin">
            <el-icon>
              <Connection />
            </el-icon>&nbsp;前往登录
          </el-link>
        </div>
      </el-form>
    </div>

    <FilingInfo />
  </div>
</template>

<script setup>
import { Connection, User } from "@element-plus/icons-vue";  // 不可移除
import FilingInfo from '@/components/FilingInfo.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";
import { registApi } from "@/api/system";
import { registFormRules } from "@/rules/regist";

const router = useRouter()

const registForm = ref({
  id: '',
  password: '',
  email: '',
  activationCode: ''
})
const registFormRef = ref(null)

const regist = async () => {
  if (!registFormRef.value) return
  try {
    await registFormRef.value.validate()
  } catch {
    ElMessage.error('表单校验失败')
    return
  }
  const res = await registApi(registForm.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    router.push('/login')
  } else {
    ElMessage.warning(`管理员注册失败: ${res.message}`)
  }
}

const toLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.regist-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.regist-form-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.regist-title {
  text-align: center;
  margin-bottom: 20px;
}

.regist-form {
  width: 300px;
}

.regist-form :deep(.el-input) {
  width: 100%;
}

.regist-btn-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.regist-btn {
  width: 100%;
}

.regist-link-wrapper {
  display: flex;
  justify-content: center;
  padding-left: 25px;
}
</style>