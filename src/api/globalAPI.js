/**
 * 全局公用接口
 * @author weichaozhan
 */
import http from '@/public/http';
import { BASE_URL } from '@/public/constant.js';

/**
 * 上传图片
 */
export const imgUploadAPI = `${BASE_URL}/upload`;

/**
 * 获取省份列表（不含分页） 
 */
export const getProvinceAPI = () => {
    return http({
        url: '/getProvince',
        method: 'get',
    });
};

/**
 * 根据省份获取下属二级城市列表
 * @param {Object} args {provinceId: 省份行政区划代码, page: 页码, limit: 每页显示数量, filter: 查询字段}
 */
export const getCityListAPI = (args) => {
    return http({
        url: '/getCityList',
        method: 'get',
        params: args,
    });
};

/**
 * 登录接口
 * @param {Object} data 登录参数
 */
export const loginAPI = (data) => {
    return http({
        url: '/users/login',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });
};

/**
 * 获取用户权限菜单列表
 */
export const getAuthListAPI = () => {
    return http({
        url: '/account/authList',
        method: 'get',
    });
};

/**
 * 修改密码
 * @param {Object} data 修改密码
 */
export const modifyPasswordAPI = (data) => {
    return http({
        url: '/users/modifyPassword',
        method: 'post',
        data: data,
    });
};

/**
 * 获取医院列表
 * @param {Object} params {page: 页码, limit: 每页显示数量, filter: 关键词}
 */
export const getHospitalListAPI = (params) => {
    return http({
        url: '/member/doctor/getHospitalList',
        method: 'get',
        params: params,
    });
};

/**
 * 获取二级科室列表
 * @param {Object} params {page, limit}
 */
export const getSecondDepartmentAPI = (params) => {
    return http({
        url: '/content/secondDepartment',
        method: 'get',
        params: params,
    });
};

/**
 * 获取医生职称列表
 */
export const getPositionalTitleListAPI = () => {
    return http({
        url: '/member/doctor/getPositionalTitleList',
        method: 'get',
    });
}