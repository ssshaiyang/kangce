/*
 * @Description: 动态管理
 * @Author: haiyang.shao
 * @Date: 2018-11-05 13:34:13
 */


import http from '@/public/http';

/**
 * @msg: 获取动态列表
 * @param {type} 
 * @return: 
 */
export const getTrendListAPI = (args) => {
    return http({
        url: '/community/dynamicList',
        method: 'get',
        params: args,
    });
};

/**
 * @msg: 获取小组下拉列表
 * @param {type} 
 * @return: 
 */
export const getGroupListAPI = (args) => {
    return http({
        url: '/community/selectGroupList',
        method: 'get',
        params: args,
    });
};

export const getTrendDetailAPI = (id) => {
    return http({
        url: '/community/dynamicDetail/'+id,
        method: 'get',
    });
};

export const getTrendFirstCommentAPI = (id,args) => {
    return http({
        url: '/community/dynamicFirstComment/'+id,
        method: 'get',
        params: args,
    });
};
//删除置顶
export const setTopTrendAPI = (data) => {
    return http({
        url: '/community/dynamic/setTop',
        method: 'post',
        data: data,
    });
};
//删除动态
export const delTrendAPI = (id) => {
    return http({
        url: '/community/dynamic/del/' +id ,
        method: 'delete',
    });
};
//删除评论
export const delTrendCommentAPI = (id) => {
    return http({
        url: '/community/dynamicComment/del/' +id ,
        method: 'delete',
    });
};

//获取回复
export const getTrendSecondCommenttAPI = (id,args) => {
    return http({
        url: '/community/dynamicSecondComment/'+id,
        method: 'get',
        params: args,
    });
};





