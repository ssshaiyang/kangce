<!-- 系统管理：账号管理 -->
<template>
    <div class="wrapper--doctor-user">
        <div class="filter">
            <el-button type="primary" @click="modelAddRoleShow = true">添加角色</el-button>
        </div>
        <div class="table" v-loading="tableLoading">
            <el-table
            :data="tableData"
            size="medium"
            border
            max-height="350"
            style="width: 100%;overflow:auto">
                <el-table-column
                fixed
                prop="username"
                label="登录名"
                width="200">
                </el-table-column>
                <el-table-column
                prop="nickname"
                label="用户名"
                min-width="300">
                </el-table-column>
                <el-table-column
                prop="lastLoginTime"
                label="最后登录时间"
                min-width="200">
                </el-table-column>
                <el-table-column
                prop="phone"
                label="	联系方式"
                min-width="200">
                </el-table-column>
                <el-table-column
                prop="abnormal"
                label="操作"
                min-width="200">
                <template slot-scope="scope">
                    <el-button type="primary"  @click="updateUserDetail(scope.row.uid)">重置</el-button>
                    <el-button type="primary" @click="delUserAccount(scope.row.uid)">删除</el-button>
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
            <div class="options" style="margin-top:20px">
                <el-button type="primary" @click="modelAddUserShow = true">添加用户</el-button>
            </div>
            <el-dialog
                title="添加用户"
                :append-to-body="true"
                :visible.sync="modelAddUserShow"
                width="60%">
                    <add-user
                     v-if="modelAddUserShow"
                    :model-close="modelAddUserShow"
                    @close-form="modelAddUserShow = false"
                    @finish-action="getUserList"
                    ></add-user>
            </el-dialog>
            <el-dialog
                title="添加角色"
                :append-to-body="true"
                :visible.sync="modelAddRoleShow"
                width="60%">
                    <add-role
                     v-if="modelAddRoleShow"
                    :model-close="modelAddRoleShow"
                    @close-form="modelAddRoleShow = false"
                    @finish-action="getUserList"
                    ></add-role>
            </el-dialog>
        </div>
    </div>
</template>

<script>
const AddUser = () => import('./AddUser.vue');
const AddRole = () => import('./AddRole.vue')

import {
    getUserAdminListAPI,
    resetPasswordAPI,
    delUserAccountAPI
} from '@/api/userAdminAPI.js';


export default {
    name:'',
    data()   {
        return   {
            form: {
                filter: '',
                limit: 10,
                page: 1,
            },
            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            totalCount: 0, // 总条数
            modelAddUserShow: false, // 是否显示添加用户
            modelAddRoleShow:false,// 是否显示新建角色
        };
    },
    components: {
        AddUser,
        AddRole
    },
    methods: {
        /**
         * 获取账号列表
         */
        getUserList() {
            const params = {...this.form};

            this.tableLoading = true;
            getUserAdminListAPI(params)
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
            this.getUserList();
        },
        /**
         * 翻页，请求新页面账号列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getUserList();
        },

    /**
         * 重置密码
         * @param {Number} uid 用户ID
         */
        updateUserDetail(uid) {
            resetPasswordAPI(uid)
                .then(res => {
                    if(res.data.code === 1000){
                        this.$message({
                            type: 'success',
                            message: '密码已经重置成功',
                        });
                        this.getUserList()
                    }else{
                        this.$message.error(res.data.msg)
                    }
                    
                })
                .catch(err => {
                })
        },
        /**
         * 删除账户
         * @param {Number} uid 用户ID
         */
        delUserAccount(uid){
            this.$confirm('确定要删除该账户么？（此操作不可逆）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    delUserAccountAPI(uid)
                    .then(res => {
                        if(res.data.code === 1000){
                            this.$message({
                                type: 'success',
                                message: '该用户已经删除',
                            });
                            this.getUserList()
                        }else{
                            this.$message.error(res.data.msg)
                        }                   
                    })
                    .catch(err => {
                    })
                })
        },
    },
    created() {
        this.getUserList();
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