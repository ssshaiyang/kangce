<!-- 修改科室排名表单 -->
<template>
    <el-form ref="formDep" :model="form" :rules="rules" label-width="138px">
        <el-form-item label="当前用户科室排名:" prop="rankingNum">
            <el-input v-model="form.rankingNum"></el-input>
        </el-form-item>
        <el-form-item class="pt10">
            <el-button type="primary" @click="submitForm" v-loading="loading">立即提交</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    modifyDoctorRankAPI,
} from '@/api/userManageAPI.js';

export default {
    name:'',
    data()   {
        return   {
            form: {
                rankingNum: '',
            },
            rules: {
                rankingNum: [
                    { required: true, message: '请输入当前用户科室排名', trigger: 'blur' },
                    { validator: (rule, value, callback) => {
                        if (!/^\d+$/.test(value) || value <= 0) {
                            callback('请输入大于零的整数');
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ],
            },
            loading: false,
        }
    },
    props: {
        doctorId: {
            required: true,
        },
        // 科室权重排名
        depRank: {
            required: true,
        },
        modelStatus: {
            required: true,
        },
    },
    watch: {
        depRank(newValue) {
            this.resetForm();
            this.$set(this.form, 'rankingNum', newValue);
        },
        modelStatus(newValue) {
            if (!newValue) {
                this.resetForm();
                this.$set(this.form, 'rankingNum', this.depRank);
            }
        },
    },
    methods: {
        /**
         * 提交表单
         */
        submitForm() {
            this.$refs.formDep.validate(valid => {
                if (valid) {
                    const args = {
                        docId: this.doctorId,
                        rankingNum: this.form.rankingNum,
                    };
                    
                    this.modifyDoctorRank(args);
                }
            })
        },
        /**
         * 科室排序权重调整请求
         * @param {Object} args 科室排序权重调整请求参数
         */
        modifyDoctorRank(args) {
            this.loading = true;
            modifyDoctorRankAPI(args)
                .then(res => {
                    const data = res.data;

                    if (data.code === 1000) {
                        this.$message({
                            type: 'success',
                            message: '科室排序权重调整成功！'
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
            this.$refs.formDep.resetFields();
        },
        /**
         * 关闭窗口
         */
        closeForm() {
            this.$emit('close-form')
        },
    },
    mounted() {
        this.form.rankingNum = this.depRank;
    },
}
</script>

<style scoped lang="less">
</style>