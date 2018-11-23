/**
 * 行为标签管理接口
 * @author jianweng
 */
import http from '@/public/http';

// 行为标签管理接口

/**
 * 获取行为标签列表
 * @param {Object} args 参数
 */
export const getLabelListAPI = (args) => {
    return http({
        url: '/content/behaviorTag',
        method: 'get',
    });
};

/**
 * 添加行为标签
 * @param {Object} args 
 */
 export const addLabelAPI = (args) => {
     return http({
         url: '/content/behaviorTag/create',
         method: 'post',        
         data: args,
     });
};


/**
 * 删除行为标签
 * @param {Object} args 
 */
 export const delLabelAPI = (args) => {
     return http({
         url: '/content/behaviorTag/del/'+args,
         method: 'delete',
     });
};

/**
 * 修改行为标签
 * @param {Object} args 
 */
 export const changeLabelAPI = (args) => {
     return http({
         url: '/content/behaviorTag/modify/'+args.id,
         method: 'put',
         data: args,
     });
};
