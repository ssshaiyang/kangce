/**
 * 审核管理接口
 * @author weichaozhan
 */
import http from '@/public/http';
import { BASE_URL } from '@/public/constant.js';

// 医生审核管理接口

/**
 * 获取医生待审核列表
 * @param {Object} args {page: 页码, limit: 每页显示数量}
 */
export const getDoctorReviewMListAPI = (args) => {
    return http({
        url: '/examine/doctor/getList',
        method: 'get',
        params: args,
    });
};

/**
 * 下载医生名单模板
 */
export const downloadDocManageTempAPI = () => {
    return http({
        url: '/examine/doctor/downloadTemplate',
        method: 'get',
        responseType: 'blob',
    }, true);
};

/**
 * 上传医生管理名单文件
 */
export const doctorManageListUplodAPI = `${BASE_URL}/examine/doctor/uploadList`;

/**
 * 批量导入医生已通过名单
 * @param {Object} args {filename: 要导入的文件路径}
 */
export const importDoctorManagePassAPI = (args) => {
    return http({
        url: '/examine/doctor/importList',
        method: 'post',
        data: args,
    });
};

/**
 * 进行医生审核
 * @param {Object} args {docId: 医生id, isPass: 是否通过:1-是，2-否, isSendSMS: 是否发送短信：1-发送，2-不发}
 */
export const examineDoctorManageAPI = (args) => {
    return http({
        url: '/examine/doctor/examine',
        method: 'post',
        data: args,
    });
};


// 医院审核管理

/**
 * 获取医院待审核列表
 * @param {Object} args {page: 页码, limit: 每页显示数量, filter: 查询字段} 
 */
export const getHospitalExamineListAPI = (args) => {
    return http({
        url: '/examine/hospital/getList',
        method: 'get',
        params: args,
    });
};

/**
 * 医院审核拒绝
 * @param {Object} args {name: 医院名称, hospitalClass: 医院等级, isSendSMS: 是否发送短信：1-发送，2-不发}
 */
export const refuseHospitalExamineAPI = (args) => {
    return http({
        url: '/examine/hospital/refuse',
        method: 'post',
        data: args,
    });
};

/**
 * 通过医院审核
 * @param {Object} args {name: 医院名称, hospitalClass: 医院等级, address: 医院地址, provinceId: 省/市ID(一级), cityId: 城市ID(二级)/区ID（直辖市，三级）}
 */
export const passHospitalExamineAPI = (args) => {
    return http({
        url: '/examine/hospital/pass',
        method: 'post',
        data: args,
    });
};


// 医生签名审核管理

/**
 * 获取医生签名待审核列表
 * @param {Object} args {page: 页码, limit: 每页显示数量}
 */
export const getDoctorExamineSignListAPI = (args) => {
    return http({
        url: '/examine/signature/getList',
        method: 'get',
        params: args,
    });
};

/**
 * 医生签名审核通过
 * @param {Object} args {docId: 医生id}
 */
export const passDoctorSignExamineAPI = (args) => {
    return http({
        url: '/examine/signature/pass',
        method: 'post',
        data: args,
    });
};

/**
 * 医生签名审核拒绝
 * @param {Object} args {docId: 医生id} 
 */
export const refuseDoctorSignExamineAPI = (args) => {
    return http({
        url: '/examine/signature/refuse',
        method: 'post',
        data: args,
    });
};