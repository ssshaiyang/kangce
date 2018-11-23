<!-- 黑名单管理 -->
<template>
    <div class="wrapper--doctor-user">
        <div class="filter">
            <el-input class="el-input-search" v-model="filterValue" clearable placeholder="请输入你要查找的用户姓名或手机号"></el-input>
            <el-button type="primary" @click="filtDoctorList">查找</el-button>
        </div>
        <div class="table" v-loading="tableLoading">
            <el-table
            :data="tableData"
            size="medium "
            border
            :max-height="300"
            style="width: 100%">
                <el-table-column
                fixed
                prop="docName"
                label="用户名"
                width="200">
                </el-table-column>
                <el-table-column
                prop="phone"
                label="手机号"
                min-width="300">
                </el-table-column>
                <el-table-column
                prop="blacklistTime"
                label="加入黑名单时间"
                min-width="200">
                </el-table-column>
                <el-table-column
                prop="reason"
                label="加入黑名单原因"
                min-width="200">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="200">
                    <template slot-scope="scope">
                        <el-button @click="removeBlackList(scope.row)" type="danger">移出黑名单</el-button>
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
    </div>
</template>

<script>
import {
    getBlacklistAPI,
    removeBlacklistAPI,
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
        };
    },
    methods: {
        /**
         * 获取黑名单用户列表
         */
        getBlacklist() {
            const params = {...this.form};

            this.tableLoading = true;
            getBlacklistAPI(params)
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
            this.getBlacklist();
        },
        /**
         * 移出黑名单
         * @param {Object} rowMsg 该行信息
         */
        removeBlackList(rowMsg) {
            this.$confirm('确定要删除该账户么？（此操作不可逆）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    removeBlacklistAPI({
                        docId: rowMsg.docId
                    })
                        .then(res => {
                            const data = res.data;
                            
                            if (data.code === 1000) {
                                this.$message({
                                    type: 'success',
                                    message: '移出黑名单成功',
                                });
                                this.getBlacklist();
                                this.$emit('refresh-doctor-list');
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: data.msg,
                                });
                            }
                        })
                })
                .catch(err => {});
        },
        /**
         * 切换表格每页大小，请求新页面黑名单列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getBlacklist();
        },
        /**
         * 翻页，请求新页面黑名单列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getBlacklist();
        }
    },
    created() {
        this.getBlacklist();
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