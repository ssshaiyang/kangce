<!-- 首页饼图 -->
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
            required: true,
            type: String,
        },
        pieData: {
            required: true,
            type: Array,
        },
    },
    watch: {
        pieData() {
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
                    text: this.titleText,
                    x: 'center',
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: this.pieData.map(item => (item.docClass || item.departmentName)),
                },
                series : [
                    {
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: this.pieData.map(item => {
                            return {
                                value: item.proportion,
                                name: (item.docClass || item.departmentName),
                            };
                        }),
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
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
    width: 45%;
    height: 400px;
    margin: 10px;
    padding: 16px;
    background: #eeeeee;
    border-radius: 10px;
}
</style>