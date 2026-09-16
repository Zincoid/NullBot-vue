import request from '@/utils/request';

/**
 * 管理登录接口
 * @param {Object} loginForm 登录表单数据
 * @returns {Promise}
 */
export const loginApi = (loginForm) => {
    return request.post('/auth/login', loginForm);
}

/**
 * 访客登录接口
 * @returns {Promise}
 */
export const guestApi = () => {
    return request.post('/auth/guest');
}

/**
 * 管理员注册接口
 * @param {Object} registForm 注册表单数据
 * @returns {Promise}
 */
export const registApi = (registForm) => {
    return request.post('/auth/regist', registForm);
}

/**
 * 用户删除接口
 * @returns {Promise}
 */
export const deleteApi = () => {
    return request.delete('/auth/me');
}

/**
 * 用户更新接口
 * @param {Object} adminEditForm 用户更新表单数据
 * @returns {Promise}
 */
export const updateApi = (adminEditForm) => {
    return request.put('/auth/me', adminEditForm);
}

/**
 * 用户信息获取接口
 * @returns {Promise}
 */
export const getInfoApi = () => {
    return request.get('/auth/me');
}

/**
 * 密码修改接口
 * @param {Object} passwordChangeForm 密码修改表单数据
 * @returns {Promise}
 */
export const changePwdApi = (passwordChangeForm) => {
    return request.put('/auth/me/password', passwordChangeForm);
}

/**
 * 全局功能开关列表接口
 * @returns {Promise}
 */
export const getSystemFuncApi = () => {
    return request.get('/system/func');
}

/**
 * 全局功能开关设置接口
 * @param {string} func 功能名
 * @param {boolean|null} enabled 开关状态 (null=切换)
 * @returns {Promise}
 */
export const setSystemFuncApi = (func, enabled) => {
    const params = { function: func }
    if (enabled !== null && enabled !== undefined) params.enabled = enabled
    return request.put('/system/func', null, { params })
}

/**
 * 模型配置查询接口
 * @returns {Promise}
 */
export const getSystemModelApi = () => {
    return request.get('/system/model');
}

/**
 * 模型配置切换接口
 * @param {string} provider 供应商名称
 * @returns {Promise}
 */
export const setSystemModelApi = (provider) => {
    return request.put('/system/model', null, { params: { provider } })
}

/**
 * 系统调用接口
 * @param {string} command 命令
 * @returns {Promise}
 */
export const invokeApi = (command) => {
    return request.post('/system/invoke', null, { params: { command } });
}