/*
 * 请求工具函数
 *
 * 基础URL: /api
 * 超时时间: 600000ms
 */


import axios from 'axios';
import router from '@/router';
import { ElMessage } from 'element-plus';

const request = axios.create({
    baseURL: '/api',
    timeout: 600000,
});

request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    }
);

request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // if (error.response.status === 401) {  // 目前后端不返回401
        //     router.push('/login');
        // } else {
        //     ElMessage.error(error.response.data.message);
        // }
        return Promise.reject(error);
    }
);

export default request;
