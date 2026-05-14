/*
 * 请求工具函数
 *
 * 基础URL: /api
 * 超时时间: 600000ms
 */


import axios from 'axios';

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
        return Promise.reject(error);
    }
);

export default request;
