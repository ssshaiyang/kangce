/**
 * 社区管理：敏感词管理接口
 * @author jianweng
 */
import http from '@/public/http';
import { BASE_URL } from '@/public/constant.js';


/**
 * 获取敏感词列表
 */
export const getWordListAPI = (args) => {
    return http({
        url: '/community/sensitiveWordsList',
        method: 'get',
        params:args,
    });
};


/**
 * 新增敏感词
 */
export const addNewWordAPI = (args) => {
    return http({
        url: '/community/sensitiveWords/add',
        method: 'post',
        data:args,
    });
};


/**
 * 删除敏感词
 */
export const delWordAPI = (args) => {
    return http({
        url: '/community/sensitiveWords/del/'+args,
        method: 'delete',
    });
};

/**
 * 删除敏感词
 */
export const wordUplodAPI = `${BASE_URL}/community/sensitiveWords/upload`;