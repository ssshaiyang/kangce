<!-- 患者详情 -->
<template>
    <div v-loading="loading">
        <el-button
        type="text"
        @click="backOverview">&lt;&ensp;返回</el-button>
        <div class="detail-content">
            <!-- 筛选条件 -->
            <div class="filter">
                <el-select v-model="year" @change="getPatientCount">
                    <el-option
                    :label="2018"
                    :value="2018">
                    </el-option>
                    <el-option
                    :label="2019"
                    :value="2019">
                    </el-option>
                </el-select>
            </div>

            <!-- 图表 -->
            <div class="child-vhc">
                <line-chart title-text="用户注册总人数" :x-axis-data="lineXAxisData" :series-data="lineData"></line-chart>
            </div>
        </div>
    </div>
</template>

<script>
const LineChart = () => import('../charts/LineChart.vue');

import {
    getPatientCountAPI
} from '@/api/homeAPI.js';

export default {
    name:'',
    data() {
        return {
            loading: true,
            year: 2018,
            lineXAxisData: [],
            lineData: [],
        };
    },
    components: {
        LineChart,
    },
    methods: {
        /**
         * 返回首页
         */
        backOverview() {
            this.$emit('back-overview', '');
        },
        /**
         * 获取患者折线图数据
         */
        getPatientCount() {
            this.loading = true;

            return getPatientCountAPI({
                    year: this.year
                })
                    .then(res => {
                        const data = res.data.data;
                        let lineXAxisData = [];
                        let lineData = [];

                        data.forEach(item => {
                            lineXAxisData.push(`${item.month}月`);
                            lineData.push(item.patientNum);
                        })
                        this.lineXAxisData = lineXAxisData;
                        this.lineData = lineData;
                        this.loading = false;
                    })
                    .catch(err => {
                        this.loading = false;
                    });
        },
    },
    created() {
        this.getPatientCount();
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
</style>