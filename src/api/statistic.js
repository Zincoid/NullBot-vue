import request from '@/utils/request';

/**
 * 获取统计信息接口
 * @returns {Promise}
 */
export const getStatisticApi = () => {
    return request.get('/statistic');
}
