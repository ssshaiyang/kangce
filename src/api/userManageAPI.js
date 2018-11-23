/**
 * 用户管理接口
 * @author weichaozhan
 */
import http from '@/public/http';
import { BASE_URL } from '@/public/constant.js';

// 医生用户管理接口

/**
 * 获取医生列表
 * @param {Object} args 参数
 */
export const getDoctorListAPI = (args) => {
    return http({
        url: '/member/doctor/getList',
        method: 'get',
        params: args,
    });
};

/**
 * 获取医生详细信息
 * @param {Object} args 
 */
export const getDoctorDetailAPI = (args) => {
    return http({
        url: `member/doctor/detail/${args.docId }`,
        method: 'get',
    });
};

/**
 * 获取问诊记录（列表）
 * @param {Object} args 
 */
export const getInquisitionListAPI = (args) => {
    return http({
        url: `member/doctor/inquisitionList/${args.docId }`,
        method: 'get',
    });
};

/**
 * 获取黑名单列表
 * @param {Object} args 参数
 */
export const getBlacklistAPI = (args) => {
    return http({
        url: '/member/doctor/getBlacklist',
        method: 'get',
        params: args,
    });
};

/**
 * 获取异常类型列表
 */
export const getAbnormalTypeListAPI = (args) => {
    return http({
        url: '/member/doctor/getAbnormalTypeList',
        method: 'get',
        params: args,
    });
};

/**
 * 获取冻结名单列表
 * @param {Object} args {page: 页码, limit: 每页显示数量} 
 */
export const getFrozenListAPI = (args) => {
    return http({
        url: '/member/doctor/getFrozenList',
        method: 'get',
        params: args,
    });
}

/**
 * 加入黑名单接口
 * @param {Object} args 参数
 */
export const addBlacklistAPI = (args) => {
    return http({
        url: '/member/doctor/addBlacklist',
        method: 'post',
        data: args,
    });
};

/**
 * 解除/开启异常
 * @param {Object} args {abnormal_type_id: 异常类型id, abnormalOperation: 操作：1-解除，2-恢复}
 */
export const toggleAbnormalStatusAPI = (args) => {
    return http({
        url: '/member/doctor/exceptionHandling',
        method: 'post',
        data: args,
    });
}

/**
 * 移出黑名单接口
 * @param {Object} args 参数
 */
export const removeBlacklistAPI = (args) => {
    return http({
        url: '/member/doctor/removeBlacklist',
        method: 'post',
        data: args,
    });
};

/**
 * 冻结医生
 * @param {Object} args 参数
 */
export const frozenDoctorAPI = (args) => {
    return http({
        url: '/member/doctor/frozen',
        method: 'post',
        data: args,
    });
};

/**
 * 解冻医生/继续冻结
 * @param {Object} args {docId: 医生用户id, flag: 操作：1-继续冻结，2-解冻}
 */
export const unfreezeDoctorAPI = (args) => {
    return http({
        url: '/member/doctor/unfreeze',
        method: 'post',
        data: args,
    });
};

/**
 * 修改科室排名
 * @param {Object} args {docId: 医生用户id, rankingNum: 新的科室排名}
 */
export const modifyDoctorRankAPI = (args) => {
    return http({
        url: `/member/doctor/modifyRank/${args.docId}`,
        method: 'put',
        data: {
            rankingNum: args.rankingNum,
        },
    });
};

/**
 * 修改医生信息
 * @param {Object} args {name: 姓名, hospitalId: 医院id, departmentId: 科室id, positionalId: 职称id, careerAge: 职业年龄}
 */
export const modifyDocInfoAPI = (args) => {
    const reqArgs = {...args};

    delete reqArgs.docId;
    return http({
        url: `/member/doctor/modifyInfo/${args.docId}`,
        method: 'put',
        data: reqArgs,
    });
};

/**
 * 获取问诊详情列表
 * @param {Object} args {inquisitionId: 问诊记录 ID}
 */
export const getInquisitionDetailAPI = (args) => {
    return http({
        url: `/member/doctor/getInquisitionDetail/${args.inquisitionId}`,
        method: 'get',
    });
};

/**
 * 消除异常
 * @param {Object} args {abnormal_id: 异常id}
 */
export const removeAbnormalAPI = (args) => {
    return http({
        url: `/member/doctor/removeAbnormal`,
        method: 'post',
        data: args,
    });
};

/**
 * 发送app消息
 * @param {Object} args {docId: 医生id, inquisitionId: 问诊id, content: 消息内容}
 */
export const sendAppMsgAPI = (args) => {
    return http({
        url: `/member/doctor/sendAppMsg`,
        method: 'post',
        data: args,
    });
};


// 患者用户管理接口

/**
 * 下载患者用户名单模板
 */
export const downloadPacientTmpAPI = () => {
    return http({
        url: '/member/patient/downloadTemplate',
        method: 'get',
        responseType: 'blob',
    }, true);
}; 

/**
 * 获取患者用户列表
 * @param {Object} args {page: 页码, limit: 每页显示数量, filter: 查询字段, attribute: 患者属性，1-普通，2-VIP} 
 */
export const getPacientListAPI = (args) => {
    return http({
        url: `/member/patient/getList`,
        method: 'get',
        params: args,
    });
};

/**
 * 患者--获取黑名单列表
 * @param {Object} args {page: 页码, limit: 每页显示数量, filter: 查找字段} 
 */
export const getPacientBlacklistAPI = (args) => {
    return http({
        url: `/member/patient/getBlacklist`,
        method: 'get',
        params: args,
    });
};

/**
 * 患者--获取问诊详情
 * @param {Object} args {inquisitionId: 问诊id}
 */
export const getPacientInquDetailAPI = (args) => {
    return http({
        url: `/member/patient/getInquisitionDetail/${args.inquisitionId}`,
        method: 'get',
    });
};

/**
 * 患者--用户加入黑名单
 * @param {Object} args {user_id: 患者id, reason: 拉黑原因}
 */
export const addPacientBlacklistAPI = (args) => {
    return http({
        url: `/member/patient/addBlacklist`,
        method: 'post',
        data: args,
    });
};

/**
 * 患者--消除异常
 * @param {Object} args {abnormal_id: 异常id}
 */
export const removePacientAbnormalAPI = (args) => {
    return http({
        url: `/member/patient/removeAbnormal`,
        method: 'post',
        data: args,
    });
};

/**
 * 患者--移出黑名单
 * @param {Object} args {user_id: 患者用户id}
 */
export const removePacientBlacklistAPI = (args) => {
    return http({
        url: `/member/patient/removeBlacklist`,
        method: 'post',
        data: args,
    });
};

/**
 * 上传患者名单文件
 */
export const pacientListUplodAPI = `${BASE_URL}/member/patient/uploadList`;

/**
 * 患者--批量导入名单
 * @param {Object} args {filename: 要导入的文件路径}
 */
export const importPacientListAPI = (args) => {
    return http({
        url: '/member/patient/importList',
        method: 'post',
        data: args,
    });
};

/**
 * 患者--单独添加患者用户
 * @param {Object} args {username: 用户名, phone: 手机号}
 */
export const addSinglePatientUserAPI = (args) => {
    return http({
        url: '/member/patient/addPatient',
        method: 'post',
        data: args,
    });
};