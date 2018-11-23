/**
 * 社区管理：话题管理接口
 * @author weichaozhan
 */
import http from '@/public/http';

/**
 * 获取话题列表
 * @param {Object} args {startTime: 开始时间, endTime: 结束时间, topicType: 1-投票话题、2-普通话题, page: 页码, limit: 每页显示数量, keyword: 关键字}
 */
export const getTopicListAPI = (args) => {
    return http({
        url: '/community/topicList',
        method: 'get',
        params: args,
    });
};

/**
 * 导出话题数据
 * @param {Object} args {startTime: 开始时间, endTime: 结束时间, topicType: 1-投票话题、2-普通话题, keyword: 关键字}
 */
export const downloadTopicListAPI = (args) => {
    return http({
        url: '/community/topic/export',
        method: 'get',
        params: args,
        responseType: 'blob',
    }, true);
};

/**
 * 查看话题，即话题详情
 * @param {Object} args {id: 话题ID}
 */
export const checkTopicAPI = (args) => {
    return http({
        url: `/community/topic/check/${args.id}`,
        method: 'get',
    });
};

/**
 * 获取话题详情，编辑话题时的初始数据
 *  @param {Object} args {id: 话题ID}
 */
export const initTopicEditInfoAPI = (args) => {
    return http({
        url: `/community/topicInfo/${args.id}`,
        method: 'get',
    });
};

/**
 * 新增话题
 * @param {Object} args {publishTime: 发布时间, title: 话题名称, imgUrl: 话题海报链接, topicType: 话题类型：1-投票话题，2-普通话题, tag: 标签显示的文字,对应的数字,0没有标签 1支持/反对,2正确/错误,3喜欢/不喜欢}
 * @param {Number} id 话题ID
 */
export const addTopicAPI = (args, id) => {
    return http({
        url: 'community/topic/create',
        method: 'post',
        data: args
    });
};

/**
 * 编辑话题
 * @param {Object} args {publishTime: 发布时间, title: 话题名称, imgUrl: 话题海报链接, topicType: 话题类型：1-投票话题，2-普通话题, tag: 标签显示的文字,对应的数字,0没有标签 1支持/反对,2正确/错误,3喜欢/不喜欢}
 * @param {Number} id 话题ID
 */
export const modifyTopicAPI = (args, id) => {
    return http({
        url: `/community/topic/modify/${id}`,
        method: 'put',
        data: args
    });
};

/**
 * 删除话题
 * @param {Object} args {id: 话题ID}
 */
export const deleteTopicAPI = (args) => {
    return http({
        url: `/community/topic/del/${args.id}`,
        method: 'delete',
    });
};