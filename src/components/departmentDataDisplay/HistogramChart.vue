<!-- 科室数据展现柱状图 -->
<template>
    <div class="histogram-chart-wrapper" ref="histogramChart">
    </div>
</template>

<script>
export default {
    name:'',
    data()   {
        return   {
            histogramChart: null,
            detail: null,
        };
    },
    props: {
        titleText: {
            required: true,
            type: String,
        },
        deptData: {
            required: true,
            type: Array,
        },
    },
    watch: {
        deptData(newValue) {
            this.setOption();
        }
    },
    methods: {
        /**
         * 初始化图表
         */
        initChart() {
            let dom = this.$refs.histogramChart;

            this.histogramChart = this.$echarts.init(dom);
            this.setOption();
            this.histogramChart.getZr().on('click', (params) => {
                let point=[params.offsetX,params.offsetY];
                
                // 鼠标在坐标系内点击
                if (this.histogramChart.containPixel('grid', point) && this.detail) {
                    this.$emit('change-dept', {
                        departmentName: this.detail.name,
                        id: this.detail.data[2],
                        inquisitionNum: this.detail.data[1],
                    });
                }
            });
        },
        /**
         * 设置图表参数
         */
        setOption() {
            this.histogramChart.setOption({
                title: {
                    text: this.titleText || 'test',
                    left: 'middle',
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: (param) => {
                        this.detail = param[0];

                        return `${param[0].name}：${param[0].value[1]}`;
                    },
                },
                xAxis: {
                    type: 'category',
                    data: this.deptData.map(item => item.departmentName),
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisPointer : {
                        type : 'shadow',
                    },
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'bar',
                    barWidth: '60%',
                    data: this.deptData.map((item, index) => {
                        return [
                            index,
                            item.inquisitionNum,
                            item.id,
                        ];
                    }),
                }]
            });
        }
    },
    mounted() {
        this.initChart();
    },
    beforeDestroy() {
        this.histogramChart.getZr().off();
    },
};
</script>

<style scoped lang="less">
.histogram-chart-wrapper {
    width: 100%;
    height: 500px;
}
</style>