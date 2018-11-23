/**
 * 急诊设置管理 接口
 * @author jianweng
 */
import http from '@/public/http';

/**
 * 获取价格区间
 */
export const getLevelPriceAPI = () => {
    return http({
        url: '/content/levelPrice',
        method: 'get',
    });
};

/**
 * 修改价格区间
 */
 export const changePriceAPI = (params) => {
 	console.log(params)
     return http({
         url: '/content/levelPrice/modify/'+params.type,
         method: 'post',
         data: params,
     });
};