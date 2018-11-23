<!-- 新建角色-->
<template>
	<div>
		<el-input v-model="name" style="width:20%" placeholder="请输入角色名"></el-input>
		<el-table
	    :data="tableData"
	    size="medium"
        v-loading="tableLoading"
	    style="width: 80%;margin:0 auto"
		@selection-change="handleSelectionChange"
	    >
	    <el-table-column
	      fixed
	      type="index"
	      label="序号"
	      width="200">
	    </el-table-column>
	    <el-table-column
	      property="moduleName"
	      label="模块名称"
	      width="240">
	    </el-table-column>
	    <el-table-column
	      property="subModuleName"
	      label="子模块名称"
	      width="240">
	    </el-table-column>
	    <el-table-column
	      type="selection"
	      label='是否开发'
	      width="200">
	    </el-table-column>
	  </el-table>
	  <el-button style='margin-top:20px' type="primary" @click="addUserRole">添加角色</el-button>
	</div>
</template>

<script>

import {
	getUserAuthsAPI,
	addUserAccountAPI
}from '@/api/userAdminAPI.js'

export default {
    name: "",
    data(){
        return   {
        	tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            multipleSelection: [],  //被选中的权限
            name:'',  //角色名称
        }
    },
    methods: {
    	/*
    	 * 获取添加时的所有权限列表
    	 */
    	getUserAuths(){
    		getUserAuthsAPI()
    		.then(res => {
                    if(res.data.code===1000){
                         const data = res.data;
                         this.tableData = data.data;
                         this.tableLoading = false;
                    }
                })
                .catch(err => {
                    this.tableLoading = false;
                })
    	},
    	/*
    	 * 获加角色
    	 */
    	addUserRole(){
    		const roleSelect = this.multipleSelection;
    		const permissions = [];
    		for (let arr in roleSelect){
    			permissions.push(roleSelect[arr].pid)
    		}
    		const args ={
    			name:this.name,
    			permissions:permissions

    		}
    		addUserAccountAPI(args)
	    		.then(res => {
	                if(res.data.code===1000){
	                	this.$emit('close-form')
	                	this.$emit('finish-action')
	                	this.$message({
                         type: 'success',
                         message: '添加角色成功',
                        });
	                }else{
	                	this.$message.error(res.data.msg)
	                }
	            })
	            .catch(err => {
	            })
    	},
    	/*
    	 * 选中的权限
    	 */
    	handleSelectionChange(val) {
	        this.multipleSelection = val;
	    }
    },
    mounted() {
    	this.getUserAuths()
    }
};
</script>

<style scoped lang="less">
</style>