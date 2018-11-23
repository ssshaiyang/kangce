/**
 * 系统管理接口
 * @author jianweng
 */
import http from '@/public/http';

// 系统管理账号管理接口

/**
 * 获取账户列表
 * @param {Object} args 参数
 */
export const getUserAdminListAPI = (args) => {
    return http({
        url: '/account/users',
        method: 'get',
        params: args,
    });
};

/**
 * 添加账号
 * @param {Object} args 
 */
 export const addUserAPI = (args) => {
     return http({
         url: '/account/user/create',
         method: 'post',
         data: args,
     });
};

/**
 * 重置密码
 * @param {Object} args 
 */
export const resetPasswordAPI = (args) => {
    console.log(args)
    return http({
        url: `account/resetPassword/${args}`,
        method: 'get',
    });
};

/**
 * 删除用户
 * @param {Object} args 
 */
export const delUserAccountAPI = (args) => {
    return http({
        url: `account/user/del/${args}`,
        method: 'delete',
        params: args
    });
};

/**
 * 添加角色
 * @param {Object} args 
 */
export const addUserAccountAPI = (args) => {
    return http({
        url: '/account/roles/create',
        method: 'post',
        data: args,
    });
};


/**
 * 获取添加时的所有权限列表
 * @param {Object} args 参数
 */
export const getUserAuthsAPI = (args) => {
    return http({
        url: '/account/auths',
        method: 'get',
    });
};

/**
 * 获取角色下拉列表
 * @param {Object} args 参数
 */
export const getRoleListAPI = (args) => {
    return http({
        url: '/account/roleList',
        method: 'get',
    });
};