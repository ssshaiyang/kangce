<!-- 账目管理：结算管理 -->
<template>
    <div class="wrapper--account-manage">
        <div class="detail-wrapper">
            交易时间：
            <el-date-picker
            v-model="detailMounth"
            type="month"
            value-format="yyyy-MM"
            @change="changeDetailMounth">
            </el-date-picker>
            
            <div class="detail-content" v-loading="loadingDetail">
                <div class="total-money">
                    本期结算总额：<span class="total-money__count">{{accountDetails.totalMoney || '-'}}</span>元
                </div>
                <el-row :gutter="10">
                    <el-col :span="12">
                        线上合约支付额：{{accountDetails.onMoney || '-'}} 元
                        <span class="detail-percent">占比：{{computeDetailsPercent(accountDetails.onMoney)}}</span>
                    </el-col>
                    <el-col :span="12">
                        问诊总额：{{accountDetails.inquisitionMoney || '-'}} 元
                        <span class="detail-percent">占比：{{computeDetailsPercent(accountDetails.inquisitionMoney)}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        线下合约支付额：{{accountDetails.underMoney || '-'}} 元
                        <span class="detail-percent">占比：{{computeDetailsPercent(accountDetails.underMoney)}}</span>
                    </el-col>
                    <el-col :span="12">
                        打赏总额：{{accountDetails.rewardMoney || '-'}} 元
                        <span class="detail-percent">占比：{{computeDetailsPercent(accountDetails.rewardMoney)}}</span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="table-wrapper">
            <div class="filter">
                <el-form class="fl-l" inline>
                    <el-form-item label="交易时间">
                        <!-- <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        range-separator="-"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker> -->
                        <el-date-picker
                        v-model="dateRange[0]"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        @change="changeDateRange">
                        </el-date-picker>
                        -
                        <el-date-picker
                        v-model="dateRange[1]"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        @change="changeDateRange">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="结算状态">
                        <el-select v-model="status" clearable placeholder="请选择结算状态" >
                            <el-option
                            :value="1"
                            label="已打款"
                            ></el-option>
                            <el-option
                            :value="0"
                            label="未打款"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-select v-model="type" >
                                    <el-option
                                    :key="index"
                                    v-for="(item, index) in Object.keys(typeSearch)"
                                    :value="parseFloat(item)"
                                    :label="typeSearch[item]"
                                    ></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="18">
                                <el-input v-model="keyword" :placeholder="`请输入${typeSearch[type]}`" clearable></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="filtDoctorList">查找</el-button>
                    </el-form-item>
                </el-form>
                <el-button class="action-export" type="primary" v-loading="loadingExport" @click="exportAccountSettleList">导出当前数据</el-button>
            </div>
            <div class="table" v-loading="tableLoading">
                <table-settle
                :table-data="tableData"
                @refresh-list="getAccountSettleList"
                ></table-settle>
                <div class="table-footer--APP" slot="append">
                    <el-pagination
                    :current-page="form.page"
                    :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90]"
                    :page-size="form.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const TableSettle = () => import('./TableSettle.vue');

import {
    getAccountSettleDetailsAPI,
    getAccountSettleListAPI,
    exportAccountSettleListAPI,
    comfirmCapitalAPI,
} from '@/api/accountMagageAPI.js';

const TYPE_SEARCH = {
    1: '手机号',
    2: '用户名',
    3: 'UID',
    4: '结算号',
    5: '银行卡号',
};

export default {
    name:'',
    data() {
        return   {
            typeSearch: TYPE_SEARCH,

            form: {
                limit: 10,
                page: 1,
                startTime: '',
                endTime: '',
                status: '',
                type: '',
                keyword: '',
            },

            type: 1, // 搜索类型
            keyword: '', // 关键词
            status: '', // 交易状态
            dateRange: ['', ''], // 日期范围

            detailMounth: '', // 账目月份
            accountDetails: {}, // 账目详情

            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            totalCount: 0, // 总条数

            loadingExport: false,
        };
    },
    components: {
        TableSettle,
    },
    methods: {
        /**
         * 获取账目详情
         */
        getAccountSettleDetails() {
            const args = this.detailMounth ? {
                date: this.detailMounth,
            } : '';

            this.loadingDetail = true;
            getAccountSettleDetailsAPI(args)
                .then(res => {
                    this.loadingDetail = false;
                    this.accountDetails = res.data.data;
                })
                .catch(err => {
                    console.log(err);
                    this.loadingDetail = false;
                });
        },
        /**
         * 计算账目详情百分比
         * @param {String|Number} target 要计算占比的数据
         */
        computeDetailsPercent(target) {
            const number = parseFloat(target)/parseFloat(this.accountDetails.totalMoney) || 0;

            return `${(number * 100).toFixed(2)}%`;
        },
        /**
         * 改变月份
         * @param {String}
         */
        changeDetailMounth(mounth) {
            this.getAccountSettleDetails();
        },
        /**
         * 改变日期范围
         * @param {String} value 当前日期
         */
        changeDateRange(value) {
            if (value) {
                if (this.dateRange.every(item => item)) {
                    // 控制时间范围
                    if (Date.parse(this.dateRange[0]) > Date.parse(this.dateRange[1])) {
                        this.dateRange = this.dateRange.map(item => value)
                    }
                } else {
                    // 将值为空的时间设置为有值的时间
                    this.dateRange = [value, value];    
                }
            } else {
                // 清空
                this.dateRange = ['', ''];
            }
        },
        /**
         * 获取账目结算列表
         */
        getAccountSettleList() {
            const params = {...this.form};

            this.tableLoading = true;
            getAccountSettleListAPI(params)
                .then(res => {
                    const data = res.data.data;

                    this.totalCount = data.totalCount;
                    this.tableData = data.data;
                    this.tableLoading = false;
                })
                .catch(err => {
                    this.tableLoading = false;
                })
        },
        /**
         * 点击查找
         */
        filtDoctorList() {
            const daterange = this.dateRange.map(item => item ? item : '');
            
            this.form = {
                ...this.form,
                page: 1,
                startTime: daterange[0],
                endTime: daterange[1],
                type: this.type,
                status: this.status,
                keyword: this.keyword,
            };
            
            this.getAccountSettleList();
        },
        /**
         * 切换表格每页大小，请求新页面结算列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getAccountSettleList();
        },
        /**
         * 翻页，请求新页面结算列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getAccountSettleList();
        },
        /**
         * 导出文件
         */
        exportAccountSettleList() {
            this.loadingExport = true;
            exportAccountSettleListAPI({
                ...this.form,
            })
                .then(res => {
                    const response = res.data;
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(response);

                    link.target = '_blank';
                    link.download = `结算管理${this.form.startTime ? `_${this.form.startTime}-${this.form.endTime}` : ''}.xlsx`;
                    link.href = url;
                    link.click();
                    this.loadingExport = false;
                })
                .catch(err => {
                    console.log(err)
                    this.loadingExport = false;
                });
        },
    },
    created() {
        this.getAccountSettleDetails();
        this.getAccountSettleList();
    }
};
</script>

<style scoped lang="less">
.wrapper--account-manage {
    padding: 20px;

    & > div {
        padding: 26px;
        box-shadow: 2px 2px 15px -6px rgba(0, 0, 0, 0.8);
        &:not(:first-child) {
            margin-top: 20px;
        }
    }
}
.detail-content {
    line-height: 2;
    font-size: 20px;

    .total-money {
        margin-top: 16px;
        font-size: 24px;
        line-height: 3;
    }
    .detail-percent {
        margin-left: 10px;
        font-size: 18px;
        color: #676767;
    }
}
.el-input-search {
    width: 300px;
    margin-right: 20px;
}
.table {
    margin: 30px 0;
}
.filter {
    padding-right: 130px;
    position: relative;
    
    .action-export {
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>