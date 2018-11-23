/**
 * 首页 接口
 * @author weichaozhan
 */
import http from '@/public/http';

/**
 * 首页人数统计
 */
export const getPeopleCountAPI = () => {
    return http({
        url: '/home/getPeopleCount',
        method: 'get',
    });
};

/**
 * 获取医生折线图
 * @param {Object} params 请求参数：year，hospitalClass
 */
export const getDoctorCountAPI = (params) => {
    return http({
        url: '/home/getDoctorCount',
        method: 'get',
        params: params,
    });
};

/**
 * 获取医生数据饼图
 * @param {Object} params 请求参数：year，hospitalClass
 */
export const getDoctorDataAPI = (params) => {
    return http({
        url: '/home/getDoctorData',
        method: 'get',
        params: params,
    });
};

/**
 * 获取患者折线图
 * @param {Object} params 请求参数：year
 */
export const getPatientCountAPI = (params) => {
    return http({
        url: '/home/getPatientCount',
        method: 'get',
        params: params,
    });
};