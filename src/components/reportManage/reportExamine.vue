<!-- 系统管理：举报管理 -->
<template>
    <div class="wrapper--doctor-user">
        <div class="filter">
            <el-form class="fl-l" inline>
                <el-form-item label="发布时间">
                    <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="-"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="queryStatus" clearable placeholder="请选择状态" >
                        <el-option
                        :value="0"
                        label="未处理"
                        ></el-option>
                        <el-option
                        :value="1"
                        label="已删除"
                        ></el-option>
                        <el-option
                        :value="2"
                        label="已忽略"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-select v-model="type" >
                                <el-option
                                :value="1"
                                label="用户名 "
                                ></el-option>
                                <el-option
                                :value="2"
                                label="手机号"
                                ></el-option>
                                <el-option
                                :value="3"
                                label="姓名"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="18">
                            <el-input v-model="keyword" :placeholder="`请输入${{
                                1: '用户名',
                                2: '手机号',
                                3: '姓名',
                            }[type]}`" clearable></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="filtReportList">查找</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table" v-loading="tableLoading">
            <el-table
            :data="tableData"
            size="medium"
            border
            max-height="350"
            style="width: 100%">
                <el-table-column
                  fixed
                  prop="reportTime"
                  label="发表时间"
                  width="200">
                </el-table-column>
                <el-table-column
                fixed
                prop="username"
                label="用户名"
                width="200">
                </el-table-column>
                <el-table-column
                prop="phone"
                label="手机号"
                min-width="300">
                </el-table-column>
                <el-table-column
                prop="groupName"
                label="小组"
                min-width="200">
                </el-table-column>
                <el-table-column
                prop="content"
                label=" 内容"
                min-width="200">
                </el-table-column>
                <el-table-column
                label=" 状态"
                min-width="200">
                <template slot-scope="scope">
                        <!-- 是否收费 1-免费(一类) 2-自费(二类) -->
                        {{
                            {
                                0: '未处理',
                                1: '已删除',
                                2: '已忽略',
                            }[scope.row.status]
                        }}
                    </template>
                </el-table-column>
                <el-table-column
                prop="abnormal"
                label="操作"
                min-width="200">
                <template slot-scope="scope">
                    <el-button type="primary" @click='showReportDetail(scope.row.id)'>查看</el-button>
                 </template>
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
            <el-dialog
            title="举报详情"
            :append-to-body="true"
            :visible.sync="modelReportShow"
            width="70%">
                <report-details
                v-if='modelReportShow'
                :model-status="modelReportShow"
                :report-id="reportId"
                @close-form="modelReportShow = false" 
                @finish-action="getReportList"></report-details>
            </el-dialog>
        </div>
    </div>
</template>

<script>


import {
    getReportListAPI,
} from '@/api/reportManageAPI.js';


const ReportDetails = () => import('./reportDetails.vue');

export default {
    name:'',
    data()   {
        return   {
            form: {
                filter: '',
                limit: 10,
                page: 1,
                startTime: '',
                endTime: '',
                type: '',
                queryStatus:0,
                keyword: '',
            },
            type: 1, // 搜索类型
            keyword: '', // 关键词
            queryStatus: 0, // 状态
            dateRange: [], // 日期范围
            tableLoading: false, // 是否显示loading
            modelReportShow:false,
            tableData: [], // 展示数据
            totalCount: 0, // 总条数
            reportId:null,//举报id
        };
    },
    components: {
        ReportDetails
    },
    methods: {
        /**
         * 获取举报列表
         */
        getReportList() {
            const params = {...this.form};

            this.tableLoading = true;
            getReportListAPI(params)
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
         * 切换表格每页大小，请求新页面账号列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getReportList();
        },
        /**
         * 翻页，请求新页面账号列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getReportList();
        },
        /**
         * 点击查找
         */
        filtReportList() {
            const daterange = this.dateRange ? this.dateRange : ['', ''];
            
            this.form = {
                ...this.form,
                page: 1,
                startTime: daterange[0],
                endTime: daterange[1],
                type: this.type,
                queryStatus: this.queryStatus,
                keyword: this.keyword,
            };
            
            this.getReportList();
        },
        /*
         * 查看举报详情
         * @param {Number} reportId 举报id
         */
        showReportDetail(reportId){
            this.reportId = reportId;
            this.modelReportShow = true;
        },
    },
    created() {
        this.getReportList();
    }
};
</script>

<style scoped lang="less">
.wrapper--doctor-user {
    padding: 20px;
}
.el-input-search {
    width: 300px;
    margin-right: 20px;
}
.table {
    margin: 30px 0;
}
.doc-name-text {
    color: #606266;
    &:hover {
        color: #409EFF;
    }
}
</style>