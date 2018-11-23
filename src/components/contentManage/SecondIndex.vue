/*
 * @Description: 内容管理
 * @Author: haiyang.shao
 * @Date: 2018-11-01 10:49:29
 */

<template>
    <div>
        <div class="header">
            <p>二级科室列表</p>
        </div>
        <div class="table_body">
            <el-table
            :data="tableData"
            border
            size="medium "
            style="width: 100%">
                <el-table-column
                prop="departmentName"
                label="名称"
                min-width="180">
                </el-table-column>
                <el-table-column
                prop="doctorNum"
                label="医生人数"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="InquisitionNum"
                label="月平均问诊量"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="superiorDepartment"
                label="所属一级科室"
                min-width="200">
                </el-table-column>
                <el-table-column
                label="操作"
                min-width="300">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            plain
                            @click="handleCheck(scope.$index, scope.row)">修改</el-button>
                        <el-button
                            v-if="scope.row.doctorNum> 0"
                            disabled
                            size="mini"
                            type="danger"
                            plain
                            >删除</el-button>
                        <el-button
                            v-else
                            size="mini"
                            type="danger"
                            plain
                            @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
            <div>
                <el-button
                class="addDep"
                type="primary"
                @click="handleAddDep"
                >新增科室</el-button>
            </div>
        </div>
        <div>
            <el-dialog
            :title="this.isEdit ? '修改科室' : '新增科室'"
            :append-to-body="true"
            :visible.sync="modalAddDepShow"
            width="40%">
                <add-sec-dep-modal
                v-if="modalAddDepShow"
                :dep-id="depId"
                @finish-action="getSecondDepList"
                @close-form="modalAddDepShow = false"
                ></add-sec-dep-modal>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    getSecondDepListAPI,
    deleteFirstDepAPI,
    modifyFirstDepAPI,
    addFirstDepAPI,
    deleteSecondDepAPI,
    } from '@/api/contentManageAPI.js'
const AddSecDepModal = () => import('./AddSecDepModal.vue');

export default {
    name:'',
    data(){
        return{
            form:{
                limit:10,
                page:1,
                filters: '',
            },
            tableData:[],
            totalCount:0,
            tableLoading:false,
            modalAddDepShow:false,//新增科室弹窗
            isEdit:false,//是否编辑
            depId:0,//科室ID
        };
    },
    components:{
        AddSecDepModal
    },
    methods:{
        /*
         * 获取二级科室列表
         */
        getSecondDepList(){
            const params = {...this.form};
            this.tableLoading = true;
            getSecondDepListAPI(params)
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
         * @msg: 翻页
         * @param {type} 
         * @return: 
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getSecondDepList();
        },
        
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getSecondDepList();
        },
        /**
         * @msg: 新增科室
         * @param {type} 
         * @return: 
         */
        handleAddDep(){
            this.depId = 0;
            this.isEdit = false;
            this.modalAddDepShow = true;
        },
        /**
         * @msg: 修改科室
         * @param {Number} row  修改科室的信息
         */
        handleCheck(index, row) {
            this.depId = row.id;
            this.modalAddDepShow = true;
            this.isEdit = true;
        },
        /**
         * @msg: 删除科室
         * @param {Number} row  删除科室的信息
         */
        handleDel(index, row){
            let delID = row.id
            deleteSecondDepAPI(delID)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getSecondDepList();
                    } else {
                        status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '删除成功！' : response.msg,
                    })
                })
        },

    },
    created(){
        this.getSecondDepList()
    }
}
</script>

<style>
    .header{
        display: flex;
        justify-content: space-between;
    }
    .header p{
        margin:20px;
    }
    .header button{
        margin: 10px
    }
    .table_body{
        padding: 20px;
    }
    .addDep{
        margin-top: 20px;
    }
</style>

