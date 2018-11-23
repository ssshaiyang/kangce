/**
 * 账目管理接口
 * @author weichaozhan
 */
import http from '@/public/http';

// 用户交易管理接口

/**
 * 获取用户交易列表
 * @param {Object} args {startTime: 开始时间, endTime: 结束时间, tradingStatus: 交易状态 1-正常 2-退款 3-已完结, type: 搜索类型 1-手机号 2-用户名 3-UID 4-交易号, keyword: 关键词, page: 页码, limit: 每页显示数量}
 */
export const getUserDealListAPI = (args) => {
    return http({
        url: '/capital/userTrade',
        method: 'get',
        params: args,
    });
};

/**
 * 导出用户交易
 * @param {Object} args {startTime: 开始时间, endTime: 结束时间, tradingStatus: 交易状态 1-正常 2-退款 3-已完结, type: 搜索类型 1-手机号 2-用户名 3-UID 4-交易号, keyword: 关键词, page: 页码, limit: 每页显示数量}
 */
export const exportUserDealListAPI = (args) => {
    return http({
        url: '/capital/userTrade/export',
        method: 'get',
        params: args,
        responseType: 'blob',
    });
};



// 结算管理

/**
 * 结算管理：获取账目详情
 * @param {Object} args {date: 年月 如2018-01}
 */
export const getAccountSettleDetailsAPI = (args) => {
    return http({
        url: '/capital/accounts',
        method: 'get',
        params: args,
    });
};

/**
 * 结算管理：获取结算列表
 * @param {Object} args {startTime: 开始时间, endTime: 结束时间, status: 结算状态 0-未打款 1-已打款, type: 搜索类型 1-手机号 2-用户名 3-UID 4-结算号 5-银行卡号, keyword: 关键词, page: 页码, limit: 每页显示数量}
 */
export const getAccountSettleListAPI = (args) => {
    return http({
        url: '/capital/balance',
        method: 'get',
        params: args,
    });
};

/**
 * 结算管理：导出结算列表
 * @param {Object} args {startTime: 开始时间, endTime: 结束时间, status: 结算状态 0-未打款 1-已打款, type: 搜索类型 1-手机号 2-用户名 3-UID 4-结算号 5-银行卡号, keyword: 关键词}
 */
export const exportAccountSettleListAPI = (args) => {
    return http({
        url: '/capital/balance/export',
        method: 'get',
        params: args,
        responseType: 'blob',
    });
};

/**
 * 结算管理：确认打款
 * @param {Object} args {id: ID}
 */
export const comfirmCapitalAPI = (args) => {
    return http({
        url: `/capital/confirm/${args.id}`,
        method: 'get',
    });
};