import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue';
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as echarts from 'echarts'

const app = createApp(App)

// axios.defaults.baseURL="http://123.57.82.189:8080/nullbot"  // 开发环境
axios.defaults.baseURL="http://101.200.136.96:8080/nullbot"  // 开发环境
// axios.defaults.baseURL = "/api"  // 生产环境

Object.keys(Icons).forEach(key => {  
   app.component(key, Icons[key]);  
});

app.config.globalProperties.$echarts = echarts

app.use(router)
   .use(ElementPlus)
   .mount('#app')
   
app.config.globalProperties.$axios = axios
