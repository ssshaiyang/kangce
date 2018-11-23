<!-- 发送APP消息表单 -->
<template>
    <el-form ref="formSendMsg" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="冻结原因:" prop="content">
            <el-input 
            v-model="form.content"
            type="textarea"
            :rows="6"
            resize="none"
            placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item class="pt10">
            <el-button type="primary" @click="submitForm" v-loading="loading">立即提交</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    sendAppMsgAPI,
} from '@/api/userManageAPI.js';

export default {
    name:'',
    data()   {
        return   {
            form: {
                content: '',
            },
            rules: {
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
            },
            loading: false,
        }
    },
    props: {
        doctorId: {
            required: true,
        },
        inquisitionId: {
            required: true,
        },
    },
    methods: {
        /**
         * 提交表单
         */
        submitForm() {
            this.$refs.formSendMsg.validate(valid => {
                if (valid) {
                    const args = {
                        docId: this.doctorId,
                        inquisitionId: this.inquisitionId,
                        content: this.form.content,
                    };
                    
                    this.sendAppMsg(args);
                }
            })
        },
        /**
         * 发送app消息请求
         * @param {Object} args 发送app消息请求参数
         */
        sendAppMsg(args) {
            this.loading = true;
            sendAppMsgAPI(args)
                .then(res => {
                    const data = res.data;

                    if (data.code === 1000) {
                        this.$message({
                            type: 'success',
                            message: '发送app消息请求成功！'
                        });
                        this.closeForm();
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
            this.$refs.formSendMsg.resetFields();
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