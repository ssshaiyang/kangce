<!-- 修改APP审核 -->
<template>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="loadingG">
        <el-form-item label="app版本号" prop="version">
            <el-input v-model="form.version"></el-input>
        </el-form-item>
        <el-form-item label="是否审核中" prop="isAuditing">
            <el-radio-group v-model="form.isAuditing">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item class="form-action-wrapper">
            <el-button type="primary" @click="submitForm" v-loading="loadingSubmit">确定</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    getAppReviewMsgAPI,
    editAppReviewMsgAPI,
} from '@/api/appReviewManageAPI';

export default {
    name:'',
    data() {
        return {
            form: {
                version: '',
                isAuditing: 0,
            },
            updateTime: '',
            createTime: '',
            rules: {
                version: [{required: true, message: '请输入APP版本号', trigger: 'blur'}],
            },

            loadingG: false, // 全局loading
            loadingSubmit: false,
        };
    },
    props: {
        msgSelected: {
            type: Object,
            default: () => {
                return {
                    version: '',
                    isAuditing: 0,
                }
            }
        },
    },
    methods: {
        /**
         * 获取APP审核信息
         */
        async getAppReviewMsg() {
            this.loadingG = true;

            const response = await getAppReviewMsgAPI(this.msgSelected.id);
            const res = response.data.data;

            this.form.version = res.version;
            this.form.isAuditing = res.isAuditing;
            this.loadingG = false;
        },
        /**
         * 关闭窗口
         */
        closeForm() {
            this.$emit('close-form');
        },
        /**
         * 表单提交
         */
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid && !this.loadingSubmit) {
                    const args = {...this.form};

                    this.loadingSubmit = true;
                    editAppReviewMsgAPI(this.msgSelected.id, args)
                        .then(response => {
                            const res = response.data;
                            const success = res.code === 1000;

                            if (success) {
                                this.closeForm();
                            }

                            this.$message({
                                type: success ? 'success' : 'error',
                                message: success ? '修改成功！' : res.msg,
                            });
                            this.loadingSubmit = false;
                        })
                        .catch(err => {
                            this.loadingSubmit = false;
                        });
                }
            });
        },
    },
    mounted() {
        this.getAppReviewMsg();
    },
};
</script>

<style scoped>
.form-action-wrapper {
    text-align: center;
}
</style>