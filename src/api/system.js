import request from '@/utils/request';

/**
 * 管理登录接口
 * @param {Object} loginForm 登录表单数据
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
 * @param {Object} registForm 注册表单数据
 * @returns {Promise}
 */
export const registApi = (registForm) => {
    return request.post('/regist', registForm);
}

/**
 * 用户删除接口
 * @returns {Promise}
 */
export const deleteApi = () => {
    return request.delete('/delete');
}

/**
 * 用户更新接口
 * @param {Object} adminEditForm 用户更新表单数据
 * @returns {Promise}
 */
export const updateApi = (adminEditForm) => {
    return request.post('/update', adminEditForm);
}

/**
 * 用户信息获取接口
 * @returns {Promise}
 */
export const getInfoApi = () => {
    return request.get('/info');
}

/**
 * 密码修改接口
 * @param {Object} passwordChangeForm 密码修改表单数据
 * @returns {Promise}
 */
export const changePwdApi = (passwordChangeForm) => {
    return request.post('/changePwd', passwordChangeForm);
}

/**
 * 系统调用接口
 * @param {string} command 命令
 * @returns {Promise}
 */
export const invokeApi = (command) => {
    return request.get('/system/invoke', { params: { command } });
}