<!-- 患者加入黑名单表单 -->
<template>
    <el-form ref="blacklistAdd" :model="form" :rules="rules" label-width="60px">
        <el-form-item>
            <b class="attention">是否将该用户加入黑名单</b>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
            <el-input v-model="form.reason"></el-input>
        </el-form-item>
        <el-form-item class="pt10">
            <el-button type="primary" @click="submitForm" v-loading="loading">立即提交</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    addPacientBlacklistAPI,
} from '@/api/userManageAPI.js';

export default {
    name:'',
    data()   {
        return   {
            form: {
                reason: '',
            },
            rules: {
                reason: [
                    { required: true, message: '请输入原因', trigger: 'blur' }
                ],
            },
            loading: false,
        }
    },
    props: {
        pacientDetail: {
            required: true,
        },
        modelClose: {
            required: true,
        }
    },
    watch: {
        modelClose() {
            this.resetForm();
        },
    },
    methods: {
        /**
         * 提交表单
         */
        submitForm() {
            this.$refs.blacklistAdd.validate(valid => {
                if (valid) {
                    const args = {
                        user_id: this.pacientDetail.uid,
                        reason: this.form.reason,
                    };
                    
                    this.addBlackList(args);
                }
            })
        },
        /**
         * 加入黑名单请求
         * @param {Object} args 加入黑名单请求参数
         */
        addBlackList(args) {
            this.loading = true;
            addPacientBlacklistAPI(args)
                .then(res => {
                    const data = res.data;

                    if (data.code === 1000) {
                        this.$message({
                            type: 'success',
                            message: '加入黑名单成功！'
                        });
                        this.closeForm();
                        this.$emit('finish-add');
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.msg,
                        });
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
            this.$refs.blacklistAdd.resetFields();
        },
        /**
         * 关闭窗口
         */
        closeForm() {
            this.$emit('close-form')
        },
    }
}
</script>

<style scoped lang="less">
.attention {
    color: red;
}
</style>