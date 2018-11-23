<!-- 用户管理：患者用户管理 -->
<template>
    <div class="wrapper--pacient-user">
        <div class="filter">
            <el-input class="el-input-search" v-model="filterValue" clearable placeholder="请输入你要查找的医生名或手机号"></el-input>
            用户属性：<el-select  class="selector-type" v-model="attribute" placeholder="请选择用户属性">
                <el-option
                :key="1"
                label="普通"
                :value="1">
                </el-option>
                <el-option
                :key="2"
                label="VIP"
                :value="2">
                </el-option>
            </el-select>
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
                prop="username"
                label="用户名"
                width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" class="doc-name-text" @click="scope.row.abnormal !== '正常' && doSomeOption(scope.row, 'inquDetail')">
                            {{scope.row.username}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column
                prop="phone"
                label="手机号"
                min-width="300">
                </el-table-column>

                <el-table-column
                prop="attribute"
                label="属性"
                min-width="200">
                </el-table-column>

                <el-table-column
                prop="lastLoginTime"
                label="最后登录时间"
                min-width="200">
                </el-table-column>

                <el-table-column
                label="异常状态"
                min-width="200">
                    <template slot-scope="scope">
                        {{ ['禁用', '正常', '删除', '冻结', '黑名单'][scope.row.status] }}
                    </template>
                </el-table-column>

                <el-table-column
                fixed="right"
                label="操作"
                width="200">
                    <template slot-scope="scope">
                        <!-- status 为 4 时状态为黑名单，不显示操作按钮 -->
                        <el-button v-if="scope.row.status !== 4" type="danger" size="mini" @click="doSomeOption(scope.row, 'addBlack')">
                            加入黑名单
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
            <el-button type="primary" @click="modelBatchAdd = true">批量添加用户</el-button>
            <el-button type="primary" @click="modelSingleAdd= true">单独添加用户</el-button>
            <el-button type="primary" @click="modelBlackListShow = true">黑名单管理</el-button>
        </div>

        <!-- 问诊详情弹窗 -->
        <el-dialog
        title="问诊详情"
        :append-to-body="true"
        :visible.sync="modelDetailShow"
        width="60%">
            <inquisition-detail
                v-if="modelDetailShow"
                :pacient-detail="pacientSelectedDetail"
                @finish-action="getPacientList"
            ></inquisition-detail>
        </el-dialog>

        <!-- 黑名单列表弹窗 -->
        <el-dialog
        title="黑名单管理"
        :append-to-body="true"
        :visible.sync="modelBlackListShow"
        width="70%">
            <black-list-manage
                v-if="modelBlackListShow"
                @finish-action="getPacientList"
            ></black-list-manage>
        </el-dialog>

        <!-- 加入黑名单表单弹窗 -->
        <el-dialog
        title="加入黑名单"
        :append-to-body="true"
        :visible.sync="modelAddBlackShow"
        width="400px">
            <add-black-list
                v-if="modelAddBlackShow"
                :pacient-detail="pacientSelectedDetail"
                :model-close="modelAddBlackShow"
                @finish-add="getPacientList"
                @close-form="modelAddBlackShow = false"
            ></add-black-list>
        </el-dialog>

        <!-- 批量添加用户弹窗 -->
        <el-dialog
        title="批量添加用户"
        :append-to-body="true"
        :visible.sync="modelBatchAdd"
        width="600px">
            <batch-add-form
            v-if="modelBatchAdd"
            @finish-add="getPacientList"
            @close-form="modelBatchAdd = false"></batch-add-form>
        </el-dialog>

        <!-- 单独添加用户弹窗 -->
        <el-dialog
        title="单独添加用户"
        :append-to-body="true"
        :visible.sync="modelSingleAdd"
        width="400px">
            <add-single-form
            v-if="modelSingleAdd"
            @finish-add="getPacientList"
            @close-form="modelSingleAdd = false"></add-single-form>
        </el-dialog>
    </div>
</template>

<script>
const AddBlackList = () => import('./AddBlackList.vue');
const InquisitionDetail = () => import('./InquisitionDetail.vue');
const BlackListManage= () => import('./BlackListManage.vue');
const BatchAddForm = () => import('./BatchAddForm.vue');
const AddSingleForm = () => import('./AddSingleForm');

import {
    getPacientListAPI,
} from '@/api/userManageAPI.js';

export default {
    name:'',
    data()   {
        return   {
            form: {
                filter: '',
                limit: 10,
                page: 1,
                attribute: 1,
            },
            attribute: 1, // 患者属性，1-普通，2-VIP
            filterValue: '', // 输入框
            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            totalCount: 0, // 总条数
            pacientSelectedDetail: {}, // 选中操作的患者详细信息

            modelBlackListShow: false, // 黑名单管理弹窗
            modelAddBlackShow: false, // 加入黑名单弹窗
            modelDetailShow: false, // 问诊详情弹窗
            modelBatchAdd: false, // 批量添加用户弹窗
            modelSingleAdd: false, // 单独添加用户弹窗
        };
    },
    components: {
        AddBlackList,
        InquisitionDetail,
        BlackListManage,
        BatchAddForm,
        AddSingleForm,
    },
    methods: {
        /**
         * 获取患者用户列表
         */
        getPacientList() {
            const params = {...this.form};

            this.tableLoading = true;
            getPacientListAPI(params)
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
            this.form.attribute = this.attribute;
            this.getPacientList();
        },
        /**
         * 切换表格每页大小，请求新页面患者列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getPacientList();
        },
        /**
         * 翻页，请求新页面患者列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getPacientList();
        },
        /**
         * 点击操作按钮
         * @param {Object} row 改行信息
         * @param {String} actions 操作名，addBlack: 加入黑名单，inquDetail：打开问诊详情
         */
        doSomeOption(row, actions) {
            this.pacientSelectedDetail = row;

            switch(actions) {
                case 'addBlack':
                    this.modelAddBlackShow = true;
                    break;
                case 'inquDetail':
                this.modelDetailShow = true;
                    break;
                default:
                    break;
            }
        },
    },
    created() {
        this.getPacientList();
    }
};
</script>

<style scoped lang="less">
.wrapper--pacient-user {
    padding: 20px;
}
.el-input-search {
    width: 300px;
    margin-right: 20px;
}
.selector-type {
    width: 100px;
    margin-right: 20px;
}
.table {
    margin: 30px 0;
}
</style>