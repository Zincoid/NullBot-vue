import request from '@/utils/request';


/**
 * 库存列表获取接口
 * @param {number} userId
 * @returns {Promise}
 */
export const getInventoryListApi = (userId) => {
    return request.get('/inventory/list', { params: { userId } });
}

/**
 * 库存删除接口
 * @param {number} inventoryId
 * @returns {Promise}
 */
export const deleteInventoryApi = (inventoryId) => {
    return request.delete(`/inventory/delete/${inventoryId}`);
}

/**
 * 库存更新接口
 * @param {Object} data
 * @returns {Promise}
 */
export const updateInventoryApi = (data) => {
    return request.put('/inventory/update', data);
}

/**
 * 库存添加接口
 * @param {number} userId
 * @param {number} itemId
 * @returns {Promise}
 */
export const addInventoryApi = (userId, itemId) => {
    return request.post('/inventory/add', null, { params: { userId, itemId } });
}

/**
 * 库存CSV导出接口
 * @returns {Promise}
 */
export const exportInventoryCsvApi = () => {
    return request.get('/inventory/exportCsv');
}