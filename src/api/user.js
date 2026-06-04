import request from '@/utils/request';


/**
 * 用户列表获取接口
 * @returns {Promise}
 */
export const getUserListApi = () => {
    return request.get('/user/list')
}

/**
 * 用户分页获取接口
 * @param {number} current 当前页码
 * @param {number} size 每页数量
 * @returns {Promise}
 */
export const getUserPageApi = (current, size) => {
    return request.get(`/user/page`, { params: { current, size } })
}

/**
 * 用户删除接口
 * @param {number} userId 用户ID
 * @returns {Promise}
 */
export const deleteUserApi = (userId) => {
    return request.delete(`/user/delete/${userId}`)
}

/**
 * 用户更新接口
 * @param {Object} userForm 用户表单数据
 * @returns {Promise}
 */
export const updateUserApi = (userForm) => {
    return request.put('/user/update', userForm)
}

/**
 * 用户CSV导出接口
 * @returns {Promise}
 */
export const exportUserCsvApi = () => {
    return request.get('/user/exportCsv')
}