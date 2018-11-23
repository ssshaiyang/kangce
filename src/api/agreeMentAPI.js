/*
 * @Description: 协议管理
 * @Author: haiyang.shao
 * @Date: 2018-11-06 15:43:15
 */
import http from '@/public/http';

//获取协议
export const getInitTextAPI = (args) => {
    return http({
        url: '/content/agreement',
        method: 'get',
        params: args,
    });
};
//修改协议
export const modifyTextAPI = (type,data) => {
    return http({
        url: '/content/agreement/modify/' + type ,
        method: 'put',
        data: {content:data},
    });
};
