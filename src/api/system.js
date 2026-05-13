import request from '@/utils/request';


/**
 * 管理登录接口
 * @param {string} id - 用户ID
 * @param {string} password - 用户密码
 * @returns {Promise}
 */
export const loginApi = (loginForm) => {
    return request.post({
        url: '/login',
        data: loginForm
    });
}


/**
 * 访客登录接口
 * @returns {Promise}
 */
export const guestApi = () => {
    return request.post({
        url: '/guest',
    });
}

/**
 * 管理员注册接口
 * @param {string} id - 用户ID
 * @param {string} password - 用户密码
 * @param {string} email - 用户邮箱
 * @param {string} activationCode - 激活码
 * @returns {Promise}
 */
export const registApi = (registForm) => {
    return request.post({
        url: '/regist',
        data: registForm
    });
}
