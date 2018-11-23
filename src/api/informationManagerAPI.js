/*
 * @Description: 资讯管理
 * @Author: haiyang.shao
 * @Date: 2018-10-29 16:02:05
 */

import http from '@/public/http';
import { BASE_URL } from '@/public/constant.js';

/**
 * @msg: 获取资讯列表
 * @param {type} 
 * @return: 
 */
export const getNewsListAPI = (args) => {
    return http({
        url: '/news',
        method: 'get',
        params: args,
    });
};

export const delAllImfoAPI = (data) => {
    return http({
        url: '/news/delAll',
        method: 'POST',
        data: data,
    });
};

export const uploadBannerAPI = `${BASE_URL}/upload`;

export const addNewsAPI = (data) => {
    return http({
        url: '/news/create',
        method: 'POST',
        data: data,
    });
}
//修改咨询
export const modifyNewsAPI = (id,data) => {
    return http({
        url: '/news/modify/'+id,
        method: 'PUT',
        data: data,
    });
}

export const getBannerList = (args) => {
    return http({
        url: '/news/banner',
        method: 'get',
        params: args,
    });
}

export const getBannerAnoList = (args) => {
    return http({
        url: '/news/onOrDraft',
        method: 'get',
        params: args,
    });
}

export const deleteNews = (data) => {
    return http({
        url: '/news/del/'+data,
        method: 'DELETE',
    });
}

export const getNewsInfo = (data) => {
    return http({
        url: '/news/newsInfo/'+data,
        method: 'get',
    });
}
//设置BANNER
export const setBannerAPI = (data) => {
    return http({
        url: '/news/setBanner',
        method: 'put',
        data: data,
    });
}