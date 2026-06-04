import request from '@/utils/request';


/**
 * 物品列表获取接口
 * @returns {Promise}
 */
export const getItemListApi = () => {
    return request.get('/item/list');
}

/**
 * 物品分页获取接口
 * @param {number} current 当前页码
 * @param {number} size 每页数量
 * @returns {Promise}
 */
export const getItemPageApi = (current, size) => {
    return request.get(`/item/page`, { params: { current, size } });
}

/**
 * 物品更新接口
 * @param {Object} itemForm 物品表单数据
 * @returns {Promise}
 */
export const updateItemApi = (itemForm) => {
    return request.put('/item/update', itemForm);
}

/**
 * 物品添加接口
 * @param {Object} itemForm 物品表单数据
 * @returns {Promise}
 */
export const addItemApi = (itemForm) => {
    return request.post('/item/add', itemForm);
}

/**
 * 物品删除接口
 * @param {number} itemId 物品ID
 * @returns {Promise}
 */
export const deleteItemApi = (itemId) => {
    return request.delete(`/item/delete/${itemId}`);
}

/**
 * 物品CSV导出接口
 * @returns {Promise}
 */
export const exportItemCsvApi = () => {
    return request.get('/item/exportCsv');
}