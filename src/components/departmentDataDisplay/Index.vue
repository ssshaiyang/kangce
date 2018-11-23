<!-- 科室数据展现 -->
<template>
    <div class="p20">
        <histogram-chart title-text="问诊量排行" :dept-data="deptData" @change-dept="changeDept"></histogram-chart>

        <!-- 当前科室信息 -->
        <div class="current-dept-info" v-if="currentDeptMsg">
            <h3>当前科室信息：{{currentDeptMsg.departmentName}}</h3>
            <el-row :gutter="10">
                <el-col :span="12">
                    <!-- 问诊量排名折线图 -->
                    <line-chart title-text="问诊量排名" :x-axis-data="deptXAxisData" :series-data="inquisitionNumData"></line-chart>
                </el-col>
                <el-col :span="12">
                    <!-- 注册医生数量折线图 -->
                    <line-chart title-text="注册医生数量" :x-axis-data="deptXAxisData" :series-data="doctorNumData"></line-chart>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
const HistogramChart = () => import('./HistogramChart.vue');
const LineChart = () => import('../charts/LineChart.vue');

import {
    getDeptDataAPI,
    getDeptDataDetailAPI,
} from '@/api/deptDataDispalyAPI.js';

export default {
    name:'DepartmentDataDisplay',
    data() {
        return {
            deptData: [], // 科室数据
            currentDeptMsg: null,
            deptXAxisData: [], // 当前科室折线图横轴
            inquisitionNumData: [], // 当前科室问诊量折线图 data
            doctorNumData: [], // 当前科室医生量折线图 data
        };
    },
    components: {
        LineChart,
        HistogramChart,
    },
    methods: {
        /**
         * 获取科室数据
         */
        getDeptData() {
            getDeptDataAPI()
                .then(res => {
                    const response = res.data;

                    this.deptData = response.data;
                });
        },
        /**
         * 获取当前科室详细信息
         */
        getDeptDataDetail() {
            getDeptDataDetailAPI({
                id: this.currentDeptMsg.id,
            })
                .then(res => {
                    const response = res.data.data;

                    this.deptXAxisData = [];
                    this.inquisitionNumData = [];
                    this.doctorNumData = [];
                    response.forEach(item => {
                        this.deptXAxisData.push(`${item.month}月`);
                        this.inquisitionNumData.push(item.inquisitionNum);
                        this.doctorNumData.push(item.doctorNum);
                    });
                });
        },
        /**
         * 切换科室
         */
        changeDept(dept) {
            this.currentDeptMsg = dept;
            this.getDeptDataDetail();
        },
    },
    mounted() {
        this.getDeptData();
    }
};
</script>

<style scoped lang="less">
.current-dept-info {
    padding: 30px;
    text-align: center;
    font-size: 18px;
}
</style>