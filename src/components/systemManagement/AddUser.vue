<!-- 添加用户-->
<template>
        <el-form ref="formEdit" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="登录名" prop="username">
            <el-input type="text" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="nickname">
            <el-input type="text" v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
            <el-input type="text" v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="Password">
            <el-input type="password" v-model="form.Password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="passwordReinput">
            <el-input type="password" v-model="form.passwordReinput"></el-input>
        </el-form-item>
        <el-form-item label="角色" >
            <el-select v-model="value" placeholder="请选择">
			  <el-option
			    v-for="item in roleList"
			    :key="item.rid"
			    :label="item.name"
			    :value="item.rid">
			  </el-option>
			</el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary"  @click="submitForm"  v-loading="loading">立即提交</el-button>
            <el-button @click="backhtmls">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>

import {
	getRoleListAPI,
	addUserAPI
}from '@/api/userAdminAPI.js'

export default {
    name: "",
     data(){
        /**
         * 密码验证规则
         */
        const validatNewPassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码长度需大于等于六位'));        
            } else {
                callback();
            }
        };
        /**
         * 重新输入密码验证规则
         */
        const validatReinput = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.Password) {
                callback(new Error('两次输入的密码不一致'));        
            } else {
                callback();
            }
        };

        return   {
        	roleList:[],
        	value: '',
            form: {
                Password: '',
                passwordReinput: '',
                nickname:'',
                rid:'',
                username:'',
            },
            rules: {
                Password: [
                    { validator: validatNewPassword , trigger: 'blur' }
                ],
                passwordReinput: [
                    { validator: validatReinput, trigger: 'blur' }
                ]
            },
            loading: false,
        }
    },
    methods: {
        /**
         * 数据提交
         */
    	submitForm() {
            this.$refs.formEdit.validate(valid => {
                if (valid) {
                    const args = {
                        username:this.form.username,
                        password:this.form.Password,
                        phone:this.form.phone,
                        nickname:this.form.nickname,
                        rid:Number(this.value)
                    };
                    addUserAPI(args)
		                .then(res => {
		                    const data = res.data;
		                    if (data.code === 1000) {
                                this.$message({
                                    type: 'success',
                                    message: '添加用户成功',
                                });
		                        this.backhtmls()
                                this.$emit('finish-action')
		                    }else{
		                        this.$message.error(res.data.msg)
		                    }
		                })
		                .catch(err => {
		                });
                }
            })
        },
        /*
         * 获取已有的权限列表
         */
        getRoleList(){
        	getRoleListAPI()
        	    .then(res => {
        	 		let arrs =[];
                    for(let arr in res.data.data){
                    	arrs.push (res.data.data[arr])
                    }
                    this.roleList =arrs;
                })
                .catch(err => {
                    
                })
        },
        /*
         * 返回上层
         */
        backhtmls(){
            this.$emit('close-form')
        }
    },
    mounted() {
        this.getRoleList()
    }
};
</script>

<style scoped lang="less">
</style>