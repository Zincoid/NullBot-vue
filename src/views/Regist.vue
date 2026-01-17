<template>
  <div style="width: 300px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
    <div>
      <h1 align="center" style="margin-bottom: 20px;">&nbsp;&nbsp;&nbsp;&nbsp;Hi! NullBot =]</h1>
    </div>
    <el-form :model="registForm" ref="registForm" label-width="40px" class="demo-ruleForm">
      <el-form-item label="账号">
        <el-input placeholder="请输入账号 (QQ)..."
                  v-model="registForm.id"
                  oninput="value=value.replace(/\D/g,'')"
                  style="width: 100%"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input placeholder="请输入密码..."
                  v-model="registForm.password"
                  show-password
                  style="width: 100%"
        ></el-input>
      </el-form-item>
<!--      <el-form-item label="确认">-->
<!--        <el-input placeholder="请确认密码"-->
<!--                  v-model="registForm.password"-->
<!--                  show-password-->
<!--                  style="width: 100%"-->
<!--        ></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="邮箱">
        <el-input placeholder="请输入邮箱..."
                  v-model="registForm.email"
                  style="width: 100%"
        ></el-input>
      </el-form-item>
      <el-form-item label="密钥">
        <el-input placeholder="请输入激活码..."
                  v-model="registForm.activationCode"
                  style="width: 100%"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div style="display: flex; justify-content: center; width: 100%;">
          <el-button type="danger" plain @click="regist" style="width: 100%;"><el-icon size="15"><User /></el-icon>&nbsp;注册</el-button>
        </div>
      </el-form-item>
      <div style="display: flex; justify-content: center; padding-left: 25px;">
        <el-link type="primary" @click="toLogin"><el-icon><Connection /></el-icon>&nbsp;前往登录</el-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import {Connection, User} from "@element-plus/icons-vue";

export default {
  name: "Regist",
  components: {User, Connection},

  data() {
    return {
      registForm: {
        id: '',
        password: '',
        email: '',
        activationCode: ''
      },
    }
  },

  methods: {
    regist() {
      this.$axios.post('/regist', this.registForm)
          .then(res => {
            console.log(res.data)
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.$router.push('/login')
            } else if (res.data.code === 400) {
              this.$message.warning(res.data.message)
            }
          })
    },

    toLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>