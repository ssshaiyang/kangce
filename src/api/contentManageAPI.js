/*
 * @Description: 内容管理
 * @Author: haiyang.shao
 * @Date: 2018-11-01 11:28:08
 */

 import http from '@/public/http'
 import { BASE_URL } from '@/public/constant.js';

 export const getFirstDepListAPI = (args) =>{
    return http({
        url: '/content/firstDepartment',
        method: 'get',
        params: args,
    });
 }
 //删除一级
 export const deleteFirstDepAPI = (id) =>{
    return http({
        url: '/content/firstDepartment/del/' + id,
        method: 'DELETE',
    });
 }

 export const modifyFirstDepAPI = (id,data) =>{
    return http({
        url: '/content/firstDepartment/del/' + id,
        method: 'PUT',
        data:data
    });
 }
//添加科室
 export const addFirstDepAPI = (data) =>{
    return http({
        url: '/content/firstDepartment/create',
        method: 'post',
        data: data,
    }, true);
 }
//获取一级科室详情
 export const getFirstDepartmentAPI = (id) =>{
    return http({
        url: '/content/firstDepartment/detail/' +id,
        method: 'get',
    });
 }

 //修改一级
 export const changeFirstDepAPI = (id,data) =>{
    return http({
        url: '/content/firstDepartment/modify/'+id,
        method: 'post',
        data: data,
    }, true);
 }
 //获取二级科室
 export const getSecondDepListAPI = (args) =>{
    return http({
        url: '/content/secondDepartment',
        method: 'get',
        params: args,
    });
 }
 //获取一级科室下拉框
 export const getFirstDepSelectAPI = (args) =>{
    return http({
        url: '/content/firstDepartment/select',
        method: 'get',
        params: args,
    });
 }

  //添加二级
  export const addSecondDepAPI = (data) =>{
    return http({
        url: '/content/secondDepartment/create',
        method: 'post',
        data: data,
    });
 }

 //获取一级科室详情
 export const getSecondDepartmentAPI = (id) =>{
    return http({
        url: '/content/secondDepartment/detail/' +id,
        method: 'get',
    });
 }

 

  //修改二级
  export const changeSecondDepAPI = (id,data) =>{
    return http({
        url: '/content/secondDepartment/modify/'+id,
        method: 'post',
        data: data,
    }, true);
 }

  //删除二级
  export const deleteSecondDepAPI = (id) =>{
    return http({
        url: '/content/secondDepartment/del/' + id,
        method: 'DELETE',
    });
 }