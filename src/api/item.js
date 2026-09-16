import request from '@/utils/request';


/**
 * 物品列表获取接口
 * @returns {Promise}
 */
export const getItemListApi = () => {
    return request.get('/items');
}

/**
 * 物品分页获取接口
 * @param {number} current 当前页码
 * @param {number} size 每页数量
 * @returns {Promise}
 */
export const getItemPageApi = (current, size) => {
    return request.get(`/items/page`, { params: { current, size } });
}

/**
 * 物品更新接口
 * @param {Object} itemForm 物品表单数据
 * @returns {Promise}
 */
export const updateItemApi = (itemForm) => {
    return request.put(`/items/${itemForm.id}`, itemForm);
}

/**
 * 物品添加接口
 * @param {Object} itemForm 物品表单数据
 * @returns {Promise}
 */
export const addItemApi = (itemForm) => {
    return request.post('/items', itemForm);
}

/**
 * 物品删除接口
 * @param {number} itemId 物品ID
 * @returns {Promise}
 */
export const deleteItemApi = (itemId) => {
    return request.delete(`/items/${itemId}`);
}

/**
 * 物品CSV导出接口
 * @returns {Promise}
 */
export const exportItemCsvApi = () => {
    return request.get('/items/export');
}