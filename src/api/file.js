import request from '@/utils/request';


/**
 * 文件分页接口
 * @param {number} current 当前页码
 * @param {number} size 每页数量
 * @param {string} directory 当前目录
 * @returns {Promise}
 */
export const getFilePageApi = (current, size, directory) => {
    return request.get(`/file/page`, { params: { current, size, directory } })
}

/**
 * 文件搜索接口
 * @param {string} keyword 搜索关键词
 * @param {string} directory 当前目录
 * @returns {Promise}
 */
export const searchFileApi = (keyword, directory) => {
    return request.get('/file/search', { params: { keyword, directory } });
}

/**
 * 文件删除接口
 * @param {number} id 文件ID
 * @returns {Promise}
 */
export const deleteFileApi = (id) => {
    return request.delete(`/file/delete/${id}`)
}

/**
 * 文件上传接口
 * @param {FormData} formData
 * @returns {Promise}
 */
export const uploadFileApi = (formData) => {
    return request.post('/file/upload', formData, { timeout: 300000, maxContentLength: Infinity })
}

/**
 * 文件下载接口
 * @param {number} id 文件ID
 * @returns {Promise}
 */
export const downloadFileApi = (id) => {
    return request.get(`/file/download/${id}`, { responseType: "arraybuffer" })
}

/**
 * 目录创建接口
 * @param {string} directory 当前目录
 * @param {string} name 目录名称
 * @returns {Promise}
 */
export const createDirApi = (directory, name) => {
    return request.get('/file/mkdir', { params: { directory, name } })
}

/**
 * 文件重命名接口
 * @param {number} id 文件ID
 * @param {string} filename 新文件名
 * @returns {Promise}
 */
export const renameFileApi = (id, filename) => {
    return request.get(`/file/rename/${id}`, { params: { filename } })
}

/**
 * 文件移动接口
 * @param {number} id 文件ID
 * @param {string} directory 新目录
 * @returns {Promise}
 */
export const moveFileApi = (id, directory) => {
    return request.get(`/file/move/${id}`, { params: { directory } })
}

/**
 * 文件可见性设置接口
 * @param {number} id 文件ID
 * @param {boolean} flag 是否可见
 * @returns {Promise}
 */
export const setVisibleApi = (id, flag) => {
    return request.get(`/file/visualize/${id}`, { params: { flag } })
}

/**
 * 文件系统初始化接口
 * @returns {Promise}
 */
export const initApi = () => {
    return request.get('/file/init');
}

/**
 * 文件系统同步接口
 * @returns {Promise}
 */
export const syncApi = () => {
    return request.get('/file/sync');
}