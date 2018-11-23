import axios from 'axios';
import Qs from 'qs';
import Vue from 'vue';
import router from '@/router';
import {Message} from 'element-ui';

import {BASE_URL} from './constant';

Vue.prototype.$message = Message;

/**
 * axios 请求封装
 * @param {Object} config axios 配置
 * @param {Boolean} isFormData 是否为FormData，true 不设置请求头
 */
const http = (config, isFormData = false) => {
    let headers = {}

    headers['Authorization'] = `${localStorage.getItem('token')}`;
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (config.headers) {
        headers = {...headers, ...config.headers};
    }

    let data = null;

    // Content-Type 为 application/x-www-form-urlencoded 并且 data 类型不为 formData 时序列化 data
    if (Object.prototype.toString.call(config.data) !== '[object FormData]') {
        data = (!headers['Content-Type'] || headers['Content-Type'] === 'application/x-www-form-urlencoded') ? Qs.stringify(config.data) : (config.data || '');
    } else {
        data = config.data;
    }

    const newRequest = new Promise((resolve, reject) => {
        axios(Object.assign({}, config, {
            baseURL: BASE_URL,
            url: config.url,
            method: config.method || 'get',
            headers: headers,
            data: data,
            params: config.params || '',
            timeout: config.timeout || 0,
            // withCredentials: true,
        }))
            .then(function (response) {
                if (response.data.code === 1002) {
                    Vue.prototype.$message({type: 'error', message: '登录信息过期！请重新登录'})
                    reject('登录信息过期！请重新登录');
                    router.push('/login');
                } else {
                    resolve(response);
                }
            })
            .catch(function (error) {
                console.log(error);
                reject(error);
            })
    });

    return newRequest;
}

export default http;
