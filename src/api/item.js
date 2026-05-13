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
 * @param {number} current
 * @param {number} size
 * @returns {Promise}
 */
export const getItemPageApi = (current, size) => {
    return request.get(`/item/page/${current}/${size}`);
}

/**
 * 物品更新接口
 * @param {Object} data
 * @returns {Promise}
 */
export const updateItemApi = (data) => {
    return request.put('/item/update', data);
}

/**
 * 物品添加接口
 * @param {Object} data
 * @returns {Promise}
 */
export const addItemApi = (data) => {
    return request.post('/item/add', data);
}

/**
 * 物品删除接口
 * @param {number} itemId
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