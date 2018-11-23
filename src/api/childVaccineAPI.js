/**
 * 儿童疫苗管理接口
 * @author jianweng
 */
import http from '@/public/http';

// 儿童疫苗管理接口

/**
 * 获取疫苗列表
 * @param {Object} args 参数
 */
export const getUserVaccineListAPI = (args) => {
    return http({
        url: '/vaccine',
        method: 'get',
        params: args,
    });
};

/**
 * 添加疫苗
 * @param {Object} args 
 */
 export const addVaccineAPI = (args) => {
     return http({
         url: '/vaccine/create',
         method: 'post',
         data: args,
     });
};

/**
 * 修改疫苗
 * @param {Object} args 
 */
 export const changeVaccineAPI = (args) => {
     return http({
         url: '/vaccine/modify/'+args.vaccineId,
         method: 'PUT',
         data: args,
     });
};

/**
 * 删除疫苗
 * @param {Object} args 
 */
export const delVaccineAPI = (args) => {
    return http({
        url: 'vaccine/del/'+args,
        method: 'delete',
    });
};



/**
 * 获取疫苗详情
 * @param {Object} args 参数
 */
export const getUserAuthsAPI = (args) => {
    return http({
        url: '/vaccine/info/'+args,
        method: 'get',
    });
};

