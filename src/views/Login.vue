<template>
  <div class="login-root">
    <div class="login-form-wrapper">
      <h1 class="login-title">&nbsp;&nbsp;&nbsp;&nbsp;Hi! NullBot =]</h1>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="40px" class="login-form"
        hide-required-asterisk>
        <el-form-item label="账号" prop="id">
          <el-input placeholder="请输入账号..." v-model="loginForm.id"
            @input="loginForm.id = loginForm.id.replace(/\D/g, '')"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码..." v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <div class="login-btn-wrapper">
            <el-button type="warning" plain class="login-btn-guest" @click="guest">
              <el-icon size="15">
                <Lock />
              </el-icon>&nbsp;暂访
            </el-button>
            <el-button type="success" plain class="login-btn-login" @click="login">
              <el-icon size="15">
                <Key />
              </el-icon>&nbsp;登录
            </el-button>
          </div>
        </el-form-item>
        <div class="login-link-wrapper">
          <el-link type="primary" @click="toRegist">
            <el-icon>
              <Connection />
            </el-icon>&nbsp;前往注册
          </el-link>
        </div>
      </el-form>
    </div>

    <FilingInfo />
  </div>
</template>

<script setup>
import { Connection, Key, Lock } from "@element-plus/icons-vue";  // 不可移除
import FilingInfo from '@/components/FilingInfo.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";
import { loginApi, guestApi } from "@/api/system";
import { loginFormRules } from "@/rules/login";

const router = useRouter()

const loginForm = ref({
  id: '',
  password: ''
})
const loginFormRef = ref(null)

const login = async () => {
  if (!loginFormRef.value) return
  try {
    await loginFormRef.value.validate()
  } catch (error) {
    ElMessage.error('请填写完整账号和密码')
    return
  }
  const res = await loginApi(loginForm.value)
  if (res.code === 1) {
    ElMessage.success(res.message)
    localStorage.setItem("token", res.data.token)
    router.push('/index')
  } else {
    ElMessage.warning(`登录失败: ${res.message}`)
  }
}

const guest = async () => {
  const res = await guestApi()
  if (res.code === 1) {
    ElMessage.success(res.message)
    localStorage.setItem("token", res.data.token)
    router.push('/index')
  } else {
    ElMessage.warning(`登录失败: ${res.message}`)
  }
}

const toRegist = () => {
  router.push('/regist')
}

localStorage.clear()
</script>

<style scoped>
.login-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.login-form-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  width: 300px;
}

.login-form :deep(.el-input) {
  width: 100%;
}

.login-btn-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.login-btn-guest {
  width: 35%;
}

.login-btn-login {
  width: 65%;
}

.login-link-wrapper {
  display: flex;
  justify-content: center;
  padding-left: 25px;
}
</style>