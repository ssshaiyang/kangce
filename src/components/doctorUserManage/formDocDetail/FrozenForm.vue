<!-- 医生用户详情 冻结用户表单 -->
<template>
    <el-form ref="formFrozen" :model="form" :rules="rules" label-width="100px">
        <el-form-item>
            <b class="attention">是否确认冻结该用户（请输入原因）！</b>
        </el-form-item>
        <el-form-item label="冻结原因:" prop="frozenReason">
            <el-input v-model="form.frozenReason"></el-input>
        </el-form-item>
        <el-form-item class="pt10">
            <el-button type="primary" @click="submitForm" v-loading="loading">立即提交</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    frozenDoctorAPI,
} from '@/api/userManageAPI.js';

export default {
    name:'',
    data()   {
        return   {
            form: {
                frozenReason: '',
            },
            rules: {
                frozenReason: [
                    { required: true, message: '请输入原因', trigger: 'blur' }
                ],
            },
            loading: false,
        }
    },
    props: {
        doctorId: {
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
            this.$refs.formFrozen.validate(valid => {
                if (valid) {
                    const args = {
                        docId: this.doctorId,
                        frozenReason: this.form.frozenReason,
                    };
                    
                    this.frozenDoctor(args);
                }
            })
        },
        /**
         * 冻结医生请求
         * @param {Object} args 冻结医生请求参数
         */
        frozenDoctor(args) {
            this.loading = true;
            frozenDoctorAPI(args)
                .then(res => {
                    const data = res.data;

                    if (data.code === 1000) {
                        this.$message({
                            type: 'success',
                            message: '冻结医生成功！'
                        });
                        this.closeForm();
                        this.$emit('finish-action');
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
            this.$refs.formFrozen.resetFields();
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