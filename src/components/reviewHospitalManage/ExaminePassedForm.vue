<!-- 医院审核通过表单 -->
<template>
    <el-form ref="form" :rules="rules" :model="form" label-width="160px">
        <el-form-item label="医院所在省份/直辖市" prop="provinceId">
            <el-select v-model="form.provinceId" filterable clearable placeholder="请选择医院所在省份/直辖市" @change="changeProvinceId">
                <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="医院所在城市/区" prop="cityId">
            <el-select v-model="form.cityId" filterable clearable placeholder="请选择医院所在城市/区">
                <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm">确认</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    getProvinceAPI,
    getCityListAPI,
} from '@/api/globalAPI.js';
import {
    passHospitalExamineAPI,
} from '@/api/reviewManageAPI.js'

export default {
    name:'',
    data() {
        return {
            form: {
                provinceId: '',
                cityId: '',
            },
            rules: {
                provinceId: [
                    {required: true, message: '请选择省份', trigger: 'change',}
                ],
                cityId: [
                    {required: true, message: '请选择城市', trigger: 'change',}
                ],
            },
            provinceList: [], // 省份/直辖市 
            cityList: [], // 城市/区
        };
    },
    props: {
        msg: {
            required: true,
            type: Object,
        },
        windowModel: {
            required: true,
        },
    },
    watch: {
        windowModel(newValue) {
            !newValue && this.$refs.form.resetFields();
        },
    },
    methods: {
        /**
         * 获取省份列表
         */
        getProvince() {
            getProvinceAPI()
                .then(res => {
                    const response = res.data;

                    if (response.code === 1000) {
                        this.provinceList = response.data;
                    } else {
                        console.log(response.msg);
                    }
                });
        },
        /**
         * 根据省份获取下属二级城市列表
         */
        getCityList(provinceId) {
            getCityListAPI({
                provinceId: provinceId,
                page: 1,
                limit: 10000,
                filter: '',
            })
                .then(res => {
                    const response = res.data;

                    if (response.code === 1000) {
                        this.cityList = response.data.data;
                    } else {
                        console.log(response.msg);
                    }
                });
        },
        /**
         * 省份/直辖市切换触发事件
         */
        changeProvinceId(value) {
            this.getCityList(value);
            this.form.cityId = '';
        },
        /**
         * 提交表单
         */
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const msg = this.msg;        
                    const args = {
                        ...this.form,
                        name: msg.name,
                        hospitalClass: msg.hospitalClass,
                        address: msg.address,
                    };
                    
                    this.passHospitalExamine(args);
                }
            });
        },
        /**
         * 审核通过请求发送
         * @param {Object} args {name: 医院名称, hospitalClass: 医院等级, address: 医院地址, provinceId: 省/市ID(一级), cityId: 城市ID(二级)/区ID（直辖市，三级）}
         */
        passHospitalExamine(args) {
            passHospitalExamineAPI(args)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.$emit('finish-action');
                        this.closeForm();
                    } else {
                        status = 'error'
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    });
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
        },
    },
    mounted() {
        this.getProvince();
    }
};
</script>

<style scoped lang="less">
</style>