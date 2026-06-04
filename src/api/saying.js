import request from '@/utils/request'


/**
 * 语录列表获取接口
 * @returns {Promise}
 */
export const getSayingListApi = () => {
    return request.get('/saying/list')
}

/**
 * 语录分页获取接口
 * @param {number} current 当前页码
 * @param {number} size 每页数量
 * @returns {Promise}
 */
export const getSayingPageApi = (current, size) => {
    return request.get(`/saying/page`, { params: { current, size } })
}

/**
 * 语录删除接口
 * @param {number} sayingId 语录ID
 * @returns {Promise}
 */
export const deleteSayingApi = (sayingId) => {
    return request.delete(`/saying/delete/${sayingId}`)
}

/**
 * 语录CSV导出接口
 * @returns {Promise}
 */
export const exportSayingCsvApi = () => {
    return request.get('/saying/exportCsv')
}