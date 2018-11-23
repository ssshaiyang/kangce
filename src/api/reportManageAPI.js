/**
 * 系统管理接口
 * @author jianweng
 */
import http from '@/public/http';

// 系统管理: 举报管理接口

/**
 * 获取举报列表
 * @param {Object} args 参数
 */
export const getReportListAPI = (args) => {
    return http({
        url: '/community/reportList',
        method: 'get',
        params:args,
    });
};

/**
 * 获取举报详情
 * @param {Object} args 参数
 */
export const getReportDetailsAPI = (args) => {
    return http({
        url: '/community/reportDetail/'+args,
        method: 'get',
    });
};

/**
 * 举报操作-删除
 * @param {Object} args 参数
 */
export const delReportAPI = (args) => {
    return http({
        url: '/community/deleteReport/'+args,
        method: 'DELETE',
    });
};


/**
 * 举报操作-删除
 * @param {Object} args 参数
 */
export const ignoreReportAPI = (args) => {
    return http({
        url: '/community/ignoreReport/'+args,
        method: 'get',
    });
};