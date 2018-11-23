/**
 * 全局公用接口
 * @author weichaozhan
 */
import http from '@/public/http';

/**
 * 获取科室数据
 */
export const getDeptDataAPI = () => {
    return http({
        url: '/content/departmentData',
        method: 'get',
    });
};

/**
 * 获取单个科室数据详情
 * @param {Object} args 科室ID
 */
export const getDeptDataDetailAPI = (args) => {
    return http({
        url: `/content/departmentDataDetail/${args.id}`,
        method: 'get',
    });
};