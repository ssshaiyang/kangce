<!-- 注册医生数量详情 -->
<template>
    <div v-loading="loading">
        <el-button
        type="text"
        @click="backOverview">&lt;&ensp;返回</el-button>
        <div class="detail-content">
            <!-- 筛选条件 -->
            <div class="filter">
                <el-select v-model="year" @change="filtData">
                    <el-option
                    :label="2018"
                    :value="2018">
                    </el-option>
                    <el-option
                    :label="2019"
                    :value="2019">
                    </el-option>
                </el-select>

                <el-select v-model="hospitalClass" @change="filtData">
                    <el-option
                    :label="'三甲'"
                    :value="'三甲'">
                    </el-option>
                    <el-option
                    :label="'其他'"
                    :value="'其他'">
                    </el-option>
                </el-select>
            </div>

            <!-- 图表 -->
            <div class="chart-wrapper child-vhc">
                <line-chart title-text="注册医生数量" :x-axis-data="lineXAxisData" :series-data="lineData"></line-chart>
                <div class="pies">
                    <pie-chart title-text="各类医生占比" :pie-data="doctorClassData"></pie-chart>
                    <pie-chart title-text="签约占比" :pie-data="signData"></pie-chart>
                    <pie-chart title-text="各科室医生占比" :pie-data="departmentData"></pie-chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const LineChart = () => import('../charts/LineChart.vue');
const PieChart = () => import('../charts/PieChart.vue');

import {
    getDoctorCountAPI,
    getDoctorDataAPI,
} from '@/api/homeAPI.js';

export default {
    name:'',
    data() {
        return {
            loading: true,
            year: 2018,
            hospitalClass: '三甲',
            lineXAxisData: [],
            lineData: [],
            // 饼图数据
            signData: [], // 签约占比
            doctorClassData: [], // 医生占比
            departmentData: [], // 科室医生占比
        };
    },
    components: {
        LineChart,
        PieChart,
    },
    methods: {
        /**
         * 返回首页
         */
        backOverview() {
            this.$emit('back-overview', '');
        },
        /**
         * 获取医生折线图数据
         */
        getDoctorCount() {
            return getDoctorCountAPI({
                    year: this.year,
                    hospitalClass: this.hospitalClass,
                })
                    .then(res => {
                        const data = res.data.data;
                        let lineXAxisData = [];
                        let lineData = [];

                        data.forEach(item => {
                            lineXAxisData.push(`${item.month}月`);
                            lineData.push(item.doctorNum);
                        })
                        this.lineXAxisData = lineXAxisData;
                        this.lineData = lineData;
                    });
        },
        /**
         * 获取医生数据饼图数据
         */
        getDoctorData() {
            return getDoctorDataAPI({
                    year: this.year,
                    hospitalClass: this.hospitalClass,
                })
                    .then(res => {
                        const data = res.data.data;

                        this.signData = data.sign;
                        this.doctorClassData = data.doctorClass;
                        this.departmentData = data.department;
                    });;
        },
        /**
         * 根据筛选选择器获取新数据
         */
        filtData() {
            this.loading = true;
            Promise.all([
                this.getDoctorCount(),
                this.getDoctorData(),
            ])
                .then(res => {
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
    },
    created() {
        this.filtData();
    },
}
</script>

<style scoped lang="less">
.filter {
    display: flex;
    justify-content: flex-end;

    & > div {
        margin-right: 20px;
    }
}
.chart-wrapper {
    flex-wrap: wrap;
}
.pies {
    width: 100%;
    margin-top: 50px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
</style>