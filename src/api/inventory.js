import request from '@/utils/request';


/**
 * 库存列表获取接口
 * @param {number} userId 用户ID
 * @returns {Promise}
 */
export const getInventoryListApi = (userId) => {
    return request.get('/inventory/list', { params: { userId } });
}

/**
 * 库存删除接口
 * @param {number} inventoryId 库存ID
 * @returns {Promise}
 */
export const deleteInventoryApi = (inventoryId) => {
    return request.delete(`/inventory/delete/${inventoryId}`);
}

/**
 * 库存更新接口
 * @param {Object} inventoryForm 库存表单数据
 * @returns {Promise}
 */
export const updateInventoryApi = (inventoryForm) => {
    return request.put('/inventory/update', inventoryForm);
}

/**
 * 库存添加接口
 * @param {number} userId 用户ID
 * @param {number} itemId 商品ID
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