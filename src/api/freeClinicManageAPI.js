/**
 * 义诊管理接口
 * @author weichaozhan
 */
import http from '@/public/http';

/**
 * 获取义诊管理列表
 * @param {Object} args {startTime: 开始时间, endTime: 结束时间, docName: 医生姓名, phone: 医生手机号, docId: 医生ID}
 */
export const getFreeClinicListAPI = (args) => {
    return http({
        url: '/treatment/getList',
        method: 'get',
        params: args,
    });
};

/**
 * 获取医生列表
 * @param {Object} args {page: 页码, limit: 每页显示数量, docName: 医生姓名, phone: 医生手机号, docId: 医生ID}
 */
export const getFCDoctorListAPI = (args) => {
    return http({
        url: '/treatment/doctorList',
        method: 'get',
        params: args,
    });
};

/**
 * 获取医生异常列表
 * @param {Object} args {id: 医生id} 
 */
export const getFCAbnormalListAPI = (args, docId) => {
    return http({
        url: `/treatment/abnormalList/${docId}`,
        method: 'get',
        params: args,
    });
};

/**
 * 获取义诊设置的数值
 * @param {Object} args {nextStartTime: 下周开始时间, nextEndTime: 下周结束时间} 
 */
export const getSettingNumAPI = (args) => {
    return http({
        url: `/treatment/getSettingNum`,
        method: 'get',
        params: args,
    });
};

/**
 * 义诊设置
 * @param {Object} args {nextStartTime: 开始时间, nextEndTime: 结束时间, price: 价格, minInquisitionNum: 最小接诊数, maxInquisitionNum: 最大接诊数}
 */
export const setFreeClinicAPI = (args) => {
    return http({
        url: '/treatment/set',
        method: 'post',
        data: args,
    });
};

/**
 * 添加义诊医生
 * @param {Object} args {dId: 医生id, date: 义诊日期}
 */
export const addDocFreeClinicAPI = (args) => {
    return http({
        url: '/treatment/addDoctor',
        method: 'post',
        data: args,
    });
};

/**
 * 移除义诊医生
 * @param {Object} args {id: 义诊-医生-ID}
 */
export const removeDocFreeClinicAPI = (args) => {
    return http({
        url: `treatment/delDoctor/${args.id}`,
        method: 'delete',
    });
};