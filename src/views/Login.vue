<template>
  <div style="width: 300px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
    <div>
      <h1 align="center" style="margin-bottom: 20px;">&nbsp;&nbsp;&nbsp;&nbsp;Hi! NullBot =]</h1>
    </div>
    <el-form :model="loginForm"
             ref="loginForm"
             label-width="40px"
             class="demo-ruleForm"
    >
      <el-form-item label="账号">
        <el-input placeholder="请输入账号..."
                  v-model="loginForm.id"
                  oninput="value=value.replace(/\D/g,'')"
                  style="width: 100%"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input placeholder="请输入密码..."
                  v-model="loginForm.password"
                  show-password
                  style="width: 100%"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div style="display: flex; justify-content: center; width: 100%;">
          <el-button type="warning" plain @click="guest" style="width: 35%;"><el-icon size="15"><Lock /></el-icon>&nbsp;暂访</el-button>
          <el-button type="success" plain @click="login" style="width: 65%;"><el-icon size="15"><Key /></el-icon>&nbsp;登录</el-button>
        </div>
      </el-form-item>
      <div style="display: flex; justify-content: center; padding-left: 25px;">
        <el-link type="primary" @click="toRegist"><el-icon><Connection /></el-icon>&nbsp;前往注册</el-link>
      </div>
    </el-form>
  </div>

  <!--  备案信息-->
  <div style="position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; padding: 10px; background-color: #000;">
    <span style="display: inline-block;">
      <img src="../assets/备案图标.png" alt="" style="width: 14px; vertical-align: middle">
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=21021702000850"
         rel="noreferrer"
         target="_blank"
         style="font-size:13px; margin-left: 6px; text-decoration: none; color: white;"
         onmouseover="this.style.textDecoration='underline';this.style.color='#007bff'"
         onmouseout="this.style.textDecoration='none';this.style.color='white'">辽公网安备21021702000850号</a>
      <a href="https://beian.miit.gov.cn/"
         target="_blank"
         style="font-size:13px; margin-left: 20px; text-decoration: none; color: white;"
         onmouseover="this.style.textDecoration='underline';this.style.color='#007bff'"
         onmouseout="this.style.textDecoration='none';this.style.color='white'">辽ICP备2026000475号-1</a>
    </span>
  </div>
</template>

<script>
import {Connection, Key, Lock} from "@element-plus/icons-vue";

export default {
  name: "Login",
  components: {Lock, Key, Connection},

  data() {
    return {
      loginForm: {
        id: '',
        password: ''
      },
    }
  },

  methods: {
    login() {
      this.$axios.post('/login', this.loginForm)
          .then(res => {
            console.log(res.data)
            if (res.data.code === 200){
              this.$message.success(res.data.message)
              localStorage.setItem("token", res.data.data.token)
              this.$router.push('/index')
            }else if (res.data.code === 400){
              this.$message.warning(res.data.message)
            }
          })
    },

    guest() {
      this.$axios.post('/guest')
          .then(res => {
            console.log(res.data)
            if (res.data.code === 200){
              this.$message.success(res.data.message)
              localStorage.setItem("token", res.data.data.token)
              this.$router.push('/index')
            }else if (res.data.code === 400){
              this.$message.warning(res.data.message)
            }
          })
    },

    toRegist(){
      this.$router.push('/regist')
    }
  },

  created() {
    localStorage.clear();
  }
}
</script>

<style scoped>

</style>