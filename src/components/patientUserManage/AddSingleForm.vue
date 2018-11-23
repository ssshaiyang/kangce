<!-- 患者：单独添加用户 -->
<template>
    <el-form ref="singleAddForm" :model="form" :rules="rules" label-width="70px">
        <el-form-item prop="username" label="用户名">
            <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
            <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item class="pt10">
            <el-button type="primary" @click="submitForm" v-loading="loading">确认</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    addSinglePatientUserAPI,
} from '@/api/userManageAPI';

export default {
    name:'',
    data() {
        return {
            loading: false,
            form: {
                username: '',
                phone: '',
            },
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur',}
                ],
                phone: [
                    {validator: (rule, value, callback) => {
                        if (!value) {
                            callback('请输入手机号');
                        } else if (!/^1[34578]\d{9}$/.test(value)) {
                            callback('请输入正确的手机号格式');
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'}
                ],
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.singleAddForm.validate(valid => {
                if (valid) {
                    const args = {...this.form}

                    this.addSinglePatientUser(args);
                }
            });
        },
        /**
         * 提交添加用户请求
         */
        addSinglePatientUser(args) {
            this.loading = true;
            addSinglePatientUserAPI(args)
                .then(res => {
                    if (res.data.code === 1000) {
                        this.$message({
                            type: 'success',
                            message: '添加用户成功！',
                        });
                        this.$emit('finish-add');
                        this.closeForm();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                        });
                    }
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        /**
         * 关闭弹窗
         */
        closeForm() {
            this.$emit('close-form');
        }
    },
};
</script>

<style scoped>

</style>