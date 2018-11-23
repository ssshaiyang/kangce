/**
 * 社区管理：小组管理接口
 * @author weichaozhan
 */
import http from '@/public/http';

/**
 * 获取小组列表
 */
export const getGroupListAPI = () => {
    return http({
        url: '/community/groupList',
        method: 'get',
    });
};

/**
 * 导出小组数据
 * @param {Object} args {startTime: 开始时间, endTime: 结束时间, groupId: 小组ID}
 */
export const downloadGroupsDataAPI = (args) => {
    return http({
        url: '/community/group/export',
        method: 'get',
        params: args,
        responseType: 'blob',
    }, true);
};

/**
 * 获取隐藏小组列表
 */
export const getGroupsHideAPI = () => {
    return http({
        url: '/community/hideGroupList',
        method: 'get',
    });
};

/**
 * 查看小组--即小组详情
 * @param {Object} args {id} 
 */
export const getGroupDetailAPI = (args) => {
    return http({
        url: `/community/group/check/${args.id}`,
        method: 'get',
    });
};

/**
 * 获取小组详情--编辑时用于初始化
 * @param {Object} args {id} 
 */
export const getInitGroupInfoAPI = (args) => {
    return http({
        url: `/community/groupInfo/${args.id}`,
        method: 'get',
    });
};

/**
 * 新增小组
 * @param {Object} args {name: 小组名称, imgUrl: 小组图链接, describe: 小组描述}
 */
export const createGroupAPI = (args) => {
    return http({
        url: '/community/group/create',
        method: 'post',
        data: args,
    });
};

/**
 * 修改小组
 * @param {Object} args {name: 小组名称, imgUrl: 小组图链接, describe: 小组描述}
 * @param {Number} id 小组ID
 */
export const modifyGroupAPI = (args, id) => {
    return http({
        url: `/community/group/modify/${id}`,
        method: 'put',
        data: args,
    });
};

/**
 * 隐藏小组 
 * @param {Object} args {id: 小组ID}
 */
export const hideGroupAPI = (args) => {
    return http({
        url: `/community/group/hide/${args.id}`,
        method: 'get',
    });
};

/**
 * 取消隐藏小组
 * @param {Object} args {id: 小组ID}
 */
export const cancleHideGroupAPI = (args) => {
    return http({
        url: `/community/group/notHide/${args.id}`,
        method: 'get',
    });
};

/**
 * 删除小组
 * @param {Object} args {id: 小组ID}
 */
export const deleteGroupAPI = (args) => {
    return http({
        url: `/community/group/del/${args.id}`,
        method: 'delete',
    });
};

/**
 * 调整位置
 * @param {Object} args {groupId: 小组ID, type: 调整类型 1-上升 2-下降}
 */
export const setGroupPositionAPI = (args) => {
    return http({
        url: `/community/group/modifyRank`,
        method: 'put',
        data: args,
    });
};