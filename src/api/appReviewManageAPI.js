/**
 * APP 审核管理接口
 * @author weichaozhan
 */
import http from '@/public/http';

//获取APP审核列表
export const getAppReviewListAPI = () => {
    return http({
        url: '/content/appExamine',
        method: 'get',
    });
};

/**
 * 获取APP审核信息
 * @param {Number} id 要获取的APP审核ID
 */
export const getAppReviewMsgAPI = (id) => {
    return http({
        url: `content/appExamine/detail/${id}`,
        method: 'get',
    });
};

/**
 * 修改APP审核信息
 * @param {Number} id 要修改的APP审核ID
 * @param {Object} args {version: 版本, isAuditing: 是否在审核中:0-否,1-是}
 */
export const editAppReviewMsgAPI = (id, args) => {
    return http({
        url: `content/appExamine/modify/${id}`,
        method: 'put',
        data: args,
    });
};