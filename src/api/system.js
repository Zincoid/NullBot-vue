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
        data: {
            id: loginForm.id,
            password: loginForm.password
        }
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
