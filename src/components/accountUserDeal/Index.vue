<!-- 账目管理：用户交易管理 -->
<template>
    <div class="wrapper--account-manage">
        <div class="filter">
            <el-form class="fl-l" inline>
                <el-form-item label="交易时间">
                    <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="-"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <!-- <el-form-item label="交易类型">
                    <el-select clearble >
                        <el-option
                        label="提问"
                        ></el-option>
                        <el-option
                        label="打赏"
                        ></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item label="交易状态">
                    <el-select v-model="tradingStatus" clearable placeholder="请选择交易状态" >
                        <el-option
                        :value="1"
                        label="正常"
                        ></el-option>
                        <el-option
                        :value="2"
                        label="退款"
                        ></el-option>
                        <el-option
                        :value="3"
                        label="已完结"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-select v-model="type" >
                                <el-option
                                :value="1"
                                label="手机号 "
                                ></el-option>
                                <el-option
                                :value="2"
                                label="用户名"
                                ></el-option>
                                <el-option
                                :value="3"
                                label="UID"
                                ></el-option>
                                <el-option
                                :value="4"
                                label="交易号"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="18">
                            <el-input v-model="keyword" :placeholder="`请输入${{
                                1: '手机号',
                                2: '用户名',
                                3: 'UID',
                                4: '交易号',
                            }[type]}`" clearable></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="filtDoctorList">查找</el-button>
                </el-form-item>
            </el-form>
            <el-button class="action-export" type="primary" v-loading="loadingExport" @click="exportUserDealList">导出当前数据</el-button>
        </div>
        <div class="table" v-loading="tableLoading">
            <el-table
            :data="tableData"
            size="medium "
            border
            max-height="460"
            style="width: 100%">
                <el-table-column
                prop="createTime"
                label="创建时间"
                width="200">
                </el-table-column>

                <el-table-column
                prop="number"
                label="交易号"
                min-width="300">
                </el-table-column>

                <el-table-column
                prop="username"
                label="发起用户名"
                min-width="200">
                </el-table-column>

                <el-table-column
                prop="uid"
                label="发起用户Uid"
                min-width="200">
                </el-table-column>

                <el-table-column
                prop="userPhone"
                label="发起用户手机号"
                min-width="200">
                </el-table-column>

                <!-- <el-table-column
                label="交易类型"
                min-width="200">
                    <template slot-scope="scope">
                        -
                    </template>
                </el-table-column> -->

                <el-table-column
                label="金额（税前）"
                min-width="200">
                    <template slot-scope="scope">
                        <!-- 义诊金额为真时显示 -->
                        <p v-if="scope.row.treatmentMoney">
                            问诊金额：{{(!scope.row.treatmentMoney && scope.row.treatmentMoney !== 0) ? '-' : scope.row.treatmentMoney + ' 元'}} (原价：{{(!scope.row.price && scope.row.price !== 0) ? '-' : scope.row.price + ' 元'}})
                        </p>
                        
                        <p v-else>问诊金额：{{(!scope.row.price && scope.row.price !== 0) ? '-' : scope.row.price + ' 元'}}</p>
                        <p>打赏金额：{{!scope.row.reward ? '-' : scope.row.reward + ' 元'}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                label="服务费(税前)"
                min-width="200">
                    <template slot-scope="scope">
                        -
                    </template>
                </el-table-column>

                <el-table-column
                label="交易状态"
                width="200">
                    <template slot-scope="scope">
                        <!-- 交易状态 1-正常 2-退款 3-已完结 -->
                        {{
                            {
                                1: '正常',
                                2: '退款',
                                3: '已完结',
                            }[scope.row.tradingStatus]
                        }}
                    </template>
                </el-table-column>

                <el-table-column
                label="支付方式"
                width="200">
                    <template slot-scope="scope">
                        <!-- 支付方式（1-积分，2-微信,3-支付宝，4-余额) -->
                        {{
                            {
                                1: '积分',
                                2: '微信',
                                3: '支付宝',
                                4: '余额',
                            }[scope.row.payWay]
                        }}
                    </template>
                </el-table-column>

                <el-table-column
                label="操作平台"
                width="200">
                    <template slot-scope="scope">
                        <!-- 平台（0-PC，1-IOS，2-Android，3-运营端） -->
                        {{
                            {
                                0: 'PC',
                                1: 'IOS',
                                2: 'Android',
                                3: '运营端',
                            }[scope.row.platform]
                        }}
                    </template>
                </el-table-column>

                <el-table-column
                prop="docName"
                label="接受医生姓名"
                width="200">
                </el-table-column>

                <el-table-column
                prop="docPhone"
                label="接受医生手机号"
                width="200">
                </el-table-column>

                <el-table-column
                prop="docId"
                label="接受医生Uid"
                width="200">
                </el-table-column>
            </el-table>
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
</template>

<script>
import {
    getUserDealListAPI,
    exportUserDealListAPI,
} from '@/api/accountMagageAPI.js';

export default {
    name:'',
    data()   {
        return   {
            form: {
                limit: 10,
                page: 1,
                startTime: '',
                endTime: '',
                tradingStatus: '',
                type: '',
                keyword: '',
            },

            type: 1, // 搜索类型
            keyword: '', // 关键词
            tradingStatus: '', // 交易状态
            dateRange: [], // 日期范围

            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            totalCount: 0, // 总条数

            loadingExport: false,
        };
    },
    methods: {
        /**
         * 获取用户交易列表
         */
        getUserDealList() {
            const params = {...this.form};

            this.tableLoading = true;
            getUserDealListAPI(params)
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
            const daterange = this.dateRange ? this.dateRange : ['', ''];
            
            this.form = {
                ...this.form,
                page: 1,
                startTime: daterange[0],
                endTime: daterange[1],
                type: this.type,
                tradingStatus: this.tradingStatus,
                keyword: this.keyword,
            };
            
            this.getUserDealList();
        },
        /**
         * 切换表格每页大小，请求新页面用户交易列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getUserDealList();
        },
        /**
         * 翻页，请求新页面用户交易列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getUserDealList();
        },
        /**
         * 导出文件
         */
        exportUserDealList() {
            this.loadingExport = true;
            exportUserDealListAPI({
                ...this.form,
            })
                .then(res => {
                    const response = res.data;
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(response);

                    link.target = '_blank';
                    link.download = `用户交易管理${this.form.startTime ? `_${this.form.startTime}-${this.form.endTime}` : ''}.xlsx`;
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
        this.getUserDealList();
    }
};
</script>

<style scoped lang="less">
.wrapper--account-manage {
    padding: 20px;
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