<!-- 义诊设置 -->
<template>
    <div v-loading="loadingInit">
        <el-form ref="form" label-width="300px" :model="form" :rules="rules">
            <el-form-item prop="price">
                <div slot="label">
                    <span>请设定价格</span>
                    <b>（{{dateRange[0]}}~{{dateRange[1]}}）</b>
                </div>
                <el-input v-model="form.price" type="number" autocomplete="off" @change="(value) => {transNumber(value, 'price')}"></el-input>
            </el-form-item>
            <el-form-item>
                <div slot="label">
                    <span>请设定数量</span>
                    <b>（{{dateRange[0]}}~{{dateRange[1]}}）</b>
                </div>
                <el-row>
                    <el-col :span="11">
                        <el-form-item prop="minInquisitionNum">
                            <el-input v-model="form.minInquisitionNum" type="number" @change="(value) => {transNumber(value, 'minInquisitionNum')}"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="tl-c" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="maxInquisitionNum">
                            <el-input v-model="form.maxInquisitionNum" type="number" @change="(value) => {transNumber(value, 'maxInquisitionNum')}"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="mt20">
                    <el-col v-if="errMsg" class="color-skyblue" :span="24">
                        <!-- <b>已有预约超过区间（0例）</b> -->
                        <b>{{errMsg}}</b>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <div class="tl-c">
            <el-button @click="cancleAction">取消</el-button>
            <el-button type="primary" @click="setFreeClinic" v-loading="loading">确定</el-button>
        </div>
    </div>
</template>

<script>
import {
    setFreeClinicAPI,
    getSettingNumAPI,
} from '@/api/freeClinicManageAPI';
import {computeWeek} from './freeCinicPublic.js';

export default {
    name:'',
    data() {
        return {
            form: {
                price: 0,
                minInquisitionNum: 0,
                maxInquisitionNum: 0,
            },
            rules: {
                price: [{validator: this.priceValidator, trigger: 'blur'}],
                minInquisitionNum: [{validator: this.countRangeValidator, trigger: 'blur'}],
                maxInquisitionNum: [{validator: this.countRangeValidator, trigger: 'blur'}],                
            },
            dateRange: [], // 时间范围
            errMsg: '',

            loading: false, // 提交按钮 loading
            loadingInit: false, // 页面 loading
        };
    },
    methods: {
        /**
         * 价格验证函数
         */
        priceValidator(rule, value, callback) {
            if (!/^(\d+\.{0,1}\d{0,2})$/.test(value)) {
                callback('请输入正确的价格，最多保留两位小数');
            } else {
                callback();
            }
        },
        /**
         * 数量验证函数
         */
        countRangeValidator(rule, value, callback) {
            if (!/^\d+$/.test(value)) {
                callback('请输入正确的数量，自然数');
            } else if (this.form.minInquisitionNum > this.form.maxInquisitionNum) {
                callback('下限不能大于上限');
            } else {
                callback();
            }
        },
        /**
         * 转化为数字
         * @param {String} value 表单值
         * @param {String} formItem 表单项
         */
        transNumber(value, formItem) {
            if (value) {
                this.form[formItem] = parseFloat(value);

                if (['minInquisitionNum', 'maxInquisitionNum'].indexOf(formItem) > -1) {
                    this.$refs.form.validateField('minInquisitionNum');
                    this.$refs.form.validateField('maxInquisitionNum');
                }
            }
        },
        /**
         * 获取义诊设置的数值
         */
        getSettingNum() {
            this.loadingInit = true;
            getSettingNumAPI({
                nextStartTime: this.dateRange[0],
                nextEndTime: this.dateRange[1],
            })
                .then(response => {
                    const res = response.data;

                    this.form = {
                        price: res.data.price,
                        minInquisitionNum: res.data.minInquisitionNum,
                        maxInquisitionNum: res.data.maxInquisitionNum,
                    }
                    this.loadingInit = false;
                })
                .catch(err => {
                    this.loadingInit = false;
                });
        },
        /**
         * 提交设置
         */
        setFreeClinic() {
            this.$refs.form.validate((valid) => {
                if (valid && !this.loading) {
                    const args = {...this.form};
    
                    args.nextStartTime = this.dateRange[0];
                    args.nextEndTime = this.dateRange[1];
    
                    this.loading = true;
                    setFreeClinicAPI(args)
                        .then(response => {
                            const res = response.data;
                            let success = res.code === 1000;

                            if (success) {
                                this.cancleAction();
                            } else {
                                this.errMsg = res.msg;
                            }
                            this.loading = false;
                            this.$message({
                                type: success ? 'success' : 'error',
                                message: success ? '设置成功！' : res.msg,
                            });
                        })
                        .catch(err => {
                            this.loading = false;
                        });
                }
            });
            
        },
        /**
         * 取消操作
         */
        cancleAction() {
            this.$emit('cancle-action');
        },
    },
    mounted() {
        // 获取下周的周一和周日日期
        this.dateRange = computeWeek(new Date(Date.now() + 8.64e7 * 7));
        // 初始化表单
        this.getSettingNum();
    }
};
</script>

<style scoped>

</style>