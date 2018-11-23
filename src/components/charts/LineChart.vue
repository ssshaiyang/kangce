<!-- 折线图 -->
<template>
    <div class="line-chart-wrapper" ref="lineChart">
    </div>
</template>

<script>
export default {
    name:'',
    data()   {
        return   {
            lineChart: null,
        };
    },
    props: {
        titleText: {
            type: String,
        },
        xAxisData: {
            required: true,
            type: Array,
        },
        seriesData: {
            required: true,
            type: Array,
        },
    },
    watch: {
        seriesData() {
            this.setOption();
        }
    },
    methods: {
        /**
         * 初始化图表
         */
        initChart() {
            let dom = this.$refs.lineChart;

            this.lineChart = this.$echarts.init(dom);
            this.setOption();
        },
        /**
         * 设置图表参数
         */
        setOption() {
            this.lineChart.setOption({
                title: {
                    text: this.titleText || '',
                    left: 'middle',
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category',
                    data: this.xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    },
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: this.seriesData,
                    type: 'line'
                }]
            });

        }
    },
    mounted() {
        this.initChart();
    },
};
</script>

<style scoped lang="less">
.line-chart-wrapper {
    width: 100%;
    height: 500px;
}
</style>