<!-- 修改密码表单 -->
<template>
    <el-form ref="formEdit" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" v-model="form.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="form.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="passwordReinput">
            <el-input type="password" v-model="form.passwordReinput"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" v-loading="loading">立即提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    modifyPasswordAPI,
} from '@/api/globalAPI.js';

export default {
    name:'',
    data()   {
        /**
         * 新密码验证规则
         */
        const validatNewPassword = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入旧密码'));
            } else if (value.length < 6) {
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
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.form.newPassword) {
                callback(new Error('两次输入的密码不一致'));        
            } else {
                callback();
            }
        };

        return   {
            form: {
                oldPassword: '',
                newPassword: '',
                passwordReinput: '',
            },
            rules: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                newPassword: [
                    { validator: validatNewPassword , trigger: 'blur' }
                ],
                passwordReinput: [
                    { validator: validatReinput, trigger: 'blur' }
                ]
            },
            loading: false,
        }
    },
    props: {
        formReset: {
            type: Boolean,
        },
    },
    watch: {
        formReset() {
            this.resetForm();
        },
    },
    methods: {
        /**
         * 提交修改密码
         */
        submitForm() {
            this.$refs.formEdit.validate(valid => {
                if (valid) {
                    const args = {
                        oldPassword: this.form.oldPassword,
                        newPassword: this.form.newPassword,
                    };

                    this.$confirm('即将修改密码, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            this.modifyPassword(args);
                        })
                        .catch(err => {});
                }
            })
        },
        /**
         * 修改密码请求
         * @param {Object} args 修改密码请求参数
         */
        modifyPassword(args) {
            this.loading = true;
            modifyPasswordAPI(args)
                .then(res => {
                    const data = res.data;

                    if (data.code === 1000) {
                        this.$message({
                            type: 'success',
                            message: '修改密码成功，请重新登陆！'
                        });
                        this.$emit('close-form');
                        this.$emit('logout-system');
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.msg,
                        });
                        this.resetForm();
                    }
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        /**
         * 重置表单
         */
        resetForm() {
            this.$refs.formEdit.resetFields();
        },
        /**
         * 登出操作
         */
        logoutSystem() {
            this.$store.commit('moduleLogin/logout');
            this.$router.push('/login');
        },
    }
}
</script>

<style scoped>

</style>