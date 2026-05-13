<template>
  <div class="regist-root">
    <div class="regist-form-wrapper">
      <div>
        <h1 align="center" style="margin-bottom: 20px;">&nbsp;&nbsp;&nbsp;&nbsp;Hi! NullBot =]</h1>
      </div>
      <el-form :model="registForm" label-width="40px" class="demo-ruleForm" style="width: 300px;">
        <el-form-item label="账号">
          <el-input placeholder="请输入账号 (QQ)..." v-model="registForm.id"
            @input="registForm.id = registForm.id.replace(/\D/g, '')" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input placeholder="请输入密码..." v-model="registForm.password" show-password style="width: 100%"></el-input>
        </el-form-item>
        <!-- <el-form-item label="确认">
          <el-input placeholder="请确认密码" v-model="registForm.password" show-password style="width: 100%"></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱">
          <el-input placeholder="请输入邮箱..." v-model="registForm.email" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="密钥">
          <el-input placeholder="请输入激活码..." v-model="registForm.activationCode" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="display: flex; justify-content: center; width: 100%;">
            <el-button type="danger" plain @click="regist" style="width: 100%;"><el-icon size="15">
                <User />
              </el-icon>&nbsp;注册</el-button>
          </div>
        </el-form-item>
        <div style="display: flex; justify-content: center; padding-left: 25px;">
          <el-link type="primary" @click="toLogin"><el-icon>
              <Connection />
            </el-icon>&nbsp;前往登录</el-link>
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

const router = useRouter()

const registForm = ref({
  id: '',
  password: '',
  email: '',
  activationCode: ''
})

const regist = async () => {
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
</style>