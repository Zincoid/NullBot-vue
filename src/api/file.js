import request from '@/utils/request';


/**
 * 文件分页接口
 * @param {number} current 当前页码
 * @param {number} size 每页数量
 * @param {string} curDir 当前目录
 * @returns {Promise}
 */
export const getFilePageApi = (current, size, curDir) => {
    return request.get(`/file/page/${current}/${size}`, { params: { curDir } });
}

/**
 * 文件搜索接口
 * @param {string} key 搜索关键词
 * @param {string} curDir 当前目录
 * @returns {Promise}
 */
export const searchFileApi = (key, curDir) => {
    return request.get('/file/searchFile', { params: { key, curDir } });
}

/**
 * 文件删除接口
 * @param {number} fileId 文件ID
 * @returns {Promise}
 */
export const deleteFileApi = (fileId) => {
    return request.delete(`/file/delete/${fileId}`)
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
 * @param {number} fileId 文件ID
 * @returns {Promise}
 */
export const downloadFileApi = (fileId) => {
    return request.get(`/file/download/${fileId}`, { responseType: "arraybuffer" })
}

/**
 * 目录创建接口
 * @param {string} curDir 当前目录
 * @param {string} dirName 目录名称
 * @returns {Promise}
 */
export const createDirApi = (curDir, dirName) => {
    return request.post('/file/createDir', { curDir, dirName })
}

/**
 * 文件重命名接口
 * @param {number} fileId 文件ID
 * @param {string} newFileName 新文件名
 * @returns {Promise}
 */
export const renameFileApi = (fileId, newFileName) => {
    return request.get(`/file/rename/${fileId}`, { params: { newFileName } })
}

/**
 * 文件移动接口
 * @param {number} fileId 文件ID
 * @param {string} newDir 新目录
 * @returns {Promise}
 */
export const moveFileApi = (fileId, newDir) => {
    return request.get(`/file/move/${fileId}`, { params: { newDir } })
}

/**
 * 文件可见性设置接口
 * @param {number} fileId 文件ID
 * @param {boolean} visible 是否可见
 * @returns {Promise}
 */
export const setVisibleApi = (fileId, visible) => {
    return request.get(`/file/setVisible/${fileId}`, { params: { visible } })
}