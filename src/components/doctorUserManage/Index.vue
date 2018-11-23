<!-- 用户管理：医生用户管理 -->
<template>
    <div class="wrapper--doctor-user">
        <div class="filter">
            <el-input class="el-input-search" v-model="filterValue" clearable placeholder="请输入你要查找的医生名或手机号"></el-input>
            <el-button type="primary" @click="filtDoctorList">查找</el-button>
        </div>
        <div class="table" v-loading="tableLoading">
            <el-table
            :data="tableData"
            size="medium "
            border
            max-height="400"
            style="width: 100%">

                <el-table-column
                fixed
                prop="docName"
                label="姓名"
                width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" class="doc-name-text" @click="showDoctorDetail(scope.row.docId)">
                            {{scope.row.docName}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column
                prop="nickname"
                label="用户名"
                min-width="150">
                </el-table-column>

                <!-- <el-table-column
                label="收假后"
                min-width="150">
                </el-table-column> -->

                <el-table-column
                prop="phone"
                label="手机号"
                min-width="300">
                </el-table-column>

                <el-table-column
                prop="receptionTime"
                label="本月接诊时间(小时)"
                min-width="200">
                </el-table-column>

                <el-table-column
                prop="averageScore"
                label="目前平均分(分)"
                min-width="100">
                </el-table-column>

                <el-table-column
                prop="postingNum"
                label="发帖量"
                min-width="100">
                </el-table-column>

                <el-table-column
                prop="abnormal"
                label="用户状态"
                min-width="150">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 3 && scope.row.frozenStatus === 2" size="mini" type="text" @click="applyUnfrozen(scope.row)">申请解冻</el-button>
                        <span v-else>{{scope.row.abnormal}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                fixed="right"
                label="操作"
                min-width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="showDoctorDetail(scope.row.docId)">
                            查看
                        </el-button>
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
        </div>
        <div class="options">
            <el-button type="primary" @click="modelBlackShow = true">黑名单管理</el-button>
            <el-button type="primary" @click="modelAbnormalShow = true">异常管理</el-button>
            <el-button type="primary" @click="modelFreezenShow = true">冻结管理</el-button>
        </div>

        <!-- 医生详情弹窗 -->
        <el-dialog
        title="医生详细信息"
        custom-class="el-dialog--user-manage__doctor-detail"
        :append-to-body="true"
        :visible.sync="modelDocDetailShow"
        width="70%">
            <doctor-detail :doctor-id="doctorId" @close-model="modelDocDetailShow = false" :get-doctor-list="getDoctorList"></doctor-detail>
        </el-dialog>

        <!-- 黑名单弹窗 -->
        <el-dialog
        title="黑名单管理"
        :append-to-body="true"
        :visible.sync="modelBlackShow"
        width="90%">
            <black-list
            v-if="modelBlackShow"
            @refresh-doctor-list="getDoctorList"></black-list>
        </el-dialog>

        <!-- 异常管理弹窗 -->
        <el-dialog
        title="异常管理"
        :append-to-body="true"
        :visible.sync="modelAbnormalShow"
        width="70%">
            <abnormal-list
            v-if="modelAbnormalShow"
            @refresh-doctor-list="getDoctorList"></abnormal-list>
        </el-dialog>

        <!-- 冻结管理弹窗 -->
        <el-dialog
        title="冻结管理"
        :append-to-body="true"
        :visible.sync="modelFreezenShow"
        width="90%">
            <freenzen-list
            v-if="modelFreezenShow"
            @refresh-doctor-list="getDoctorList"></freenzen-list>
        </el-dialog>
    </div>
</template>

<script>
const DoctorDetail = () => import('./DoctorDetail.vue');
const BlackList = () => import('./BlackList.vue');
const AbnormalList = () => import('./AbnormalList.vue');
const FreenzenList = () => import('./FreenzenList.vue');

import {
    getDoctorListAPI,
    getDoctorDetailAPI,
    unfreezeDoctorAPI,
} from '@/api/userManageAPI.js';

export default {
    name:'',
    data()   {
        return   {
            form: {
                filter: '',
                limit: 10,
                page: 1,
            },
            filterValue: '', // 输入框
            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            totalCount: 0, // 总条数
            doctorId: null, // 医生ID
            
            modelDocDetailShow: false, // 显示医生用户详情弹窗
            modelBlackShow: false, // 是否显示黑名单弹窗
            modelAbnormalShow: false, // 异常管理弹窗
            modelFreezenShow: false, // 冻结管理弹窗
        };
    },
    components: {
        BlackList,
        DoctorDetail,
        AbnormalList,
        FreenzenList,
    },
    methods: {
        /**
         * 获取医生用户列表
         */
        getDoctorList() {
            const params = {...this.form};

            this.tableLoading = true;
            getDoctorListAPI(params)
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
            this.form.page = 1;
            this.form.filter = this.filterValue;
            this.getDoctorList();
        },
        /**
         * 切换表格每页大小，请求新页面医生列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getDoctorList();
        },
        /**
         * 翻页，请求新页面医生列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getDoctorList();
        },
        /**
         * 查看医生详情
         * @param {Number} docId 医生ID
         */
        showDoctorDetail(docId) {
            this.doctorId = docId;
            this.modelDocDetailShow = true;
        },
        /**
         * 申请解冻
         * @param {Number} row 行信息
         */
        applyUnfrozen(row) {
            const unfreezeDoctor = (flag, msg) => {
                unfreezeDoctorAPI({
                    docId: row.docId,
                    flag: flag,
                })
                    .then(res => {
                        const data = res.data;
                        
                        if (data.code === 1000) {
                            this.$message({
                                type: 'success',
                                message: msg,
                            });
                            this.getDoctorList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: data.msg,
                            });
                        }
                    })
            };

            this.doctorId = row.docId;
            this.$confirm(`
                <div>
                    <b>冻结原因：</b><span>${row.reason}</span>
                </div>
                <div>
                    <b>申请解冻理由：</b><span>${row.applyReason}</span>
                </div>
            `, '提示', {
                confirmButtonText: '解除冻结',
                cancelButtonText: '继续冻结',
                type: 'warning',
                dangerouslyUseHTMLString: true,
            })
                .then(() => {
                    unfreezeDoctor(2, '解除冻结成功！')
                })
                .catch(() => {
                    unfreezeDoctor(1, '继续冻结成功！')

                });
        }
    },
    created() {
        this.getDoctorList();
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
</style>
<style lang="less">
.el-dialog--user-manage__doctor-detail {
    .el-dialog__body {
        padding-top: 0;
    }
}
</style>
