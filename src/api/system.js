import request from '@/utils/request';

/**
 * 管理登录接口
 * @param {Object} loginForm
 * @param {string} loginForm.id
 * @param {string} loginForm.password
 * @returns {Promise}
 */
export const loginApi = (loginForm) => {
    return request.post('/login', loginForm);
}

/**
 * 访客登录接口
 * @returns {Promise}
 */
export const guestApi = () => {
    return request.post('/guest');
}

/**
 * 管理员注册接口
 * @param {Object} registForm
 * @param {string} registForm.id
 * @param {string} registForm.password
 * @param {string} registForm.email
 * @param {string} registForm.activationCode
 * @returns {Promise}
 */
export const registApi = (registForm) => {
    return request.post('/regist', registForm);
}

/**
 * 用户信息获取接口
 * @returns {Promise}
 */
export const getInfoApi = () => {
    return request.get('/info');
}

/**
 * 系统调用接口
 * @param {string} command
 * @returns {Promise}
 */
export const invokeApi = (command) => {
    return request.get('/system/invoke', { params: { command } });
}