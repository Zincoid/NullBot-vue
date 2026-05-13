<template>
  <div style="width: 300px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
    <div>
      <h1 align="center" style="margin-bottom: 20px;">&nbsp;&nbsp;&nbsp;&nbsp;Hi! NullBot =]</h1>
    </div>
    <el-form :model="loginForm" label-width="40px" class="demo-ruleForm">
      <el-form-item label="账号">
        <el-input placeholder="请输入账号..." v-model="loginForm.id" @input="loginForm.id = loginForm.id.replace(/\D/g, '')"
          style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input placeholder="请输入密码..." v-model="loginForm.password" show-password style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="display: flex; justify-content: center; width: 100%;">
          <el-button type="warning" plain @click="guest" style="width: 35%;"><el-icon size="15">
              <Lock />
            </el-icon>&nbsp;暂访</el-button>
          <el-button type="success" plain @click="login" style="width: 65%;"><el-icon size="15">
              <Key />
            </el-icon>&nbsp;登录</el-button>
        </div>
      </el-form-item>
      <div style="display: flex; justify-content: center; padding-left: 25px;">
        <el-link type="primary" @click="toRegist"><el-icon>
            <Connection />
          </el-icon>&nbsp;前往注册</el-link>
      </div>
    </el-form>
  </div>

  <FilingInfo />
</template>

<script setup>
import { Connection, Key, Lock } from "@element-plus/icons-vue";
import FilingInfo from '@/components/FilingInfo.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus";
import { loginApi, guestApi } from "@/api/system";

const router = useRouter()

const loginForm = ref({
  id: '',
  password: ''
})

const login = async () => {
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

<style scoped></style>