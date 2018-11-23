<!-- 修改信息表单 -->
<template>
    <el-form v-loading="loadingSelecors" ref="formEdit" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名:" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="所在医院:" prop="hospitalId">
            <el-select v-model="form.hospitalId" filterable remote :remote-method="getHospitalList" :loading="loadingDepm" placeholder="请选择" @focus="focusHospital">
                <el-option
                v-for="item in hospitalList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所在科室:" prop="departmentId">
            <el-select v-model="form.departmentId" filterable placeholder="请选择">
                <el-option
                v-for="item in departmentList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="职称:" prop="positionalId">
            <el-select v-model="form.positionalId" placeholder="请选择">
                <el-option
                v-for="item in positionalList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="职业年龄:" prop="careerAge">
            <el-input v-model="form.careerAge"></el-input>
        </el-form-item>
        <el-form-item class="pt10">
            <el-button type="primary" @click="submitForm" v-loading="loading">立即提交</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    getSecondDepartmentAPI,
    getPositionalTitleListAPI,
    getHospitalListAPI,
} from '@/api/globalAPI.js';
import {
    modifyDocInfoAPI,
} from '@/api/userManageAPI.js';

export default {
    name:'',
    data()   {
        return   {
            form: {
                name: '',
                hospitalId: '',
                departmentId: '',
                positionalId: '',
                careerAge: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                careerAge: [
                    { validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请输入职业年龄'));
                        } else if (isNaN(parseFloat(value)) && parseFloat(value) < 0) {
                            callback(new Error('职业年龄必须为大于等于零的数值!'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' },
                ],
            },
            hospitalList: [], // 医院列表
            departmentList: [], // 科室列表
            positionalList: [], // 职位列表

            loading: false,
            loadingSelecors: false, // 选择框列表下载loading，主要用于组织用户信息加载前的操作
            loadingDepm: false, // 医院列表loading
        }
    },
    props: {
        doctorId: {
            required: true,
        },
        // 用户信息
        doctorDetail: {
            required: true,
        },
        // 弹窗状态
        modelStatus: {
            required: true,
        },
    },
    watch: {
        doctorDetail(newValue) {
            this.initForm();
            this.initSelectors();
        },
        positionalList(newValue) {
            this.handlePositionalId(newValue);
        },
        modelStatus(newValue) {
            if (!newValue) {
                this.initForm();
                this.handlePositionalId(this.positionalList);
            } 
        },
    },
    methods: {
        /**
         * 坑爹详情没有职称 ID，单独处理 
         */
        handlePositionalId(positionalList) {
            positionalList.some(item => {
                if (item.label === this.doctorDetail.positionalTitle) {
                    this.$set(this.form, 'positionalId', item.value);
                }
                return false;
            })
        },
        /**
         * 初始化表单
         */
        initForm() {
            this.resetForm();
            this.form = {
                name: this.doctorDetail.docName,
                hospitalId: this.doctorDetail.hospitalId,
                departmentId: this.doctorDetail.departmentId,
                positionalId: this.doctorDetail.positionalTitle,
                careerAge: this.doctorDetail.careerAge,
            }
            this.handlePositionalId(this.positionalList);
        },
        /**
         * 初始化各个select
         */
        initSelectors() {
            this.loadingSelecors = true;
            Promise.all([
                this.getHospitalList(),
                this.getSecondDepartment(),
                this.getPositionalTitleList(),
            ])
                .then(res => {
                    // 若当前医院列表没有医生所在医院，则添加一条医院信息
                    if (this.hospitalList.filter(item => item.value === this.form.hospitalId).length === 0) {
                        this.hospitalList.push({
                            value: this.doctorDetail.hospitalId,
                            label: this.doctorDetail.hospitalName,
                        })
                    }
                    this.loadingSelecors = false;
                })
                .catch(err => {
                    this.loadingSelecors = false;
                });
        },
        /**
         * 医院列表焦点
         */
        focusHospital() {
            // 医院列表为空时，获取默认医院列表
            if (this.hospitalList.length === 0) {
                this.getHospitalList();
            }
        },
        /**
         * 医院列表
         * @param {String} filter 关键字
         */
        getHospitalList(filter = '') {
            this.loadingDepm = true;
            return getHospitalListAPI({page: 1, limit: 1000, filter: filter})
                .then(res => {
                    this.loadingDepm = false;
                    this.hospitalList = res.data.data.data.map(item => {
                        return {
                            value: item.id,
                            label: item.name,
                        };
                    });
                })
                .catch(err => {
                    this.loadingDepm = false;
                });
        },
        /**
         * 获取二级科室列表
         */
        getSecondDepartment() {
            return getSecondDepartmentAPI({page: 1, limit: 1000})
                .then(res => {
                    this.departmentList = res.data.data.data.map(item => {
                        return {
                            value: item.id,
                            label: item.departmentName,
                        };
                    });
                })
        },
        /**
         * 获取职称列表
         */
        getPositionalTitleList() {
            return getPositionalTitleListAPI()
                .then(res => {
                    this.positionalList = res.data.data.map(item => {
                        return {
                            value: item.positionalId,
                            label: item.positionalTitle,
                        };
                    });
                })
        },
        /**
         * 提交表单
         */
        submitForm() {
            this.$refs.formEdit.validate(valid => {
                if (valid) {
                    const args = Object.assign({
                        docId: this.doctorId,
                    }, this.form);
                    
                    this.modifyDocInfo(args);
                }
            })
        },
        /**
         * 修改医生信息请求
         * @param {Object} args 修改医生信息请求参数
         */
        modifyDocInfo(args) {
            this.loading = true;
            modifyDocInfoAPI(args)
                .then(res => {
                    const data = res.data;

                    if (data.code === 1000) {
                        this.$message({
                            type: 'success',
                            message: '修改信息成功！'
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
            this.$refs.formEdit.resetFields();
        },
        /**
         * 关闭窗口
         */
        closeForm() {
            this.$emit('close-form')
        },
    },
    mounted() {
        this.initForm();
        this.initSelectors();
    },
}
</script>

<style scoped lang="less">
</style>