import request from '@/utils/request';

/**
 * 获取统计信息接口
 * @returns {Promise}
 */
export const getStatsApi = () => {
    return request.get('/stats');
}
