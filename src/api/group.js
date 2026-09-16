import request from '@/utils/request';


/**
 * 群组列表获取接口
 * @returns {Promise}
 */
export const getGroupListApi = () => {
    return request.get('/groups')
}

/**
 * 群组分页获取接口
 * @param {number} current 当前页码
 * @param {number} size 每页数量
 * @returns {Promise}
 */
export const getGroupPageApi = (current, size) => {
    return request.get(`/groups/page`, { params: { current, size } })
}

/**
 * 群组删除接口
 * @param {number} groupId 群组ID
 * @returns {Promise}
 */
export const deleteGroupApi = (groupId) => {
    return request.delete(`/groups/${groupId}`)
}

/**
 * 群组更新接口
 * @param {Object} group 群组对象
 * @returns {Promise}
 */
export const updateGroupApi = (groupForm) => {
    return request.put(`/groups/${groupForm.id}`, groupForm)
}

/**
 * 群组CSV导出接口
 * @returns {Promise}
 */
export const exportGroupCsvApi = () => {
    return request.get('/groups/export')
}

/**
 * 群组设置获取接口
 * @param {number} groupId 群组ID
 * @returns {Promise}
 */
export const getGroupSettingApi = (groupId) => {
    return request.get(`/settings/${groupId}`)
}

/**
 * 群组设置更新接口
 * @param {Object} groupFuncForm 群组设置对象
 * @returns {Promise}
 */
export const updateGroupSettingApi = (groupFuncForm) => {
    return request.put(`/settings/${groupFuncForm.groupId}`, groupFuncForm)
}

/**
 * 群组设置CSV导出接口
 * @returns {Promise}
 */
export const exportGroupSettingCsvApi = () => {
    return request.get('/settings/export')
}