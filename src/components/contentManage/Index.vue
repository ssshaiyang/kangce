/*
 * @Description: 内容管理
 * @Author: haiyang.shao
 * @Date: 2018-11-01 10:49:29
 */

<template>
    <div>
        <div class="header">
            <p>一级科室列表</p>
            <el-button type="primary" @click="handleSecondDepShow">二级科室管理</el-button>
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
                prop="peopleNum"
                label="拥有人数"
                min-width="180">
                </el-table-column>
                <el-table-column
                prop="subordinateDepartment"
                label="下属科室"
                min-width="300">
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
                            v-if="scope.row.subordinateDepartment.length > 0"
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
                <add-dep-modal
                v-if="modalAddDepShow"
                :dep-id="depId"
                @finish-action="getFirstDepList"
                @close-form="modalAddDepShow = false"
                ></add-dep-modal>
            </el-dialog>
            <el-dialog
            title="二级科室管理"
            :append-to-body="true"
            :visible.sync="secondDepShow"
            width="90%">
                <second-index
                v-if="secondDepShow"
                @close-form="secondDepShow = false"
                ></second-index>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    getFirstDepListAPI,
    deleteFirstDepAPI,
    modifyFirstDepAPI,
    addFirstDepAPI,
    
    } from '@/api/contentManageAPI.js'
const AddDepModal = () => import('./AddDepModal.vue');
const SecondIndex = () => import('./SecondIndex.vue');

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
            secondDepShow:false,//第二科室弹窗
        };
    },
    components:{
        AddDepModal,
        SecondIndex
    },
    methods:{
        /*
         * 获取一级科室科室列表
         */
        getFirstDepList(){
            const params = {...this.form};
            this.tableLoading = true;
            getFirstDepListAPI(params)
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
            this.getFirstDepList();
        },
        
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getFirstDepList();
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
            deleteFirstDepAPI(delID)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getFirstDepList();
                    } else {
                        status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '删除成功！' : response.msg,
                    })
                })
        },
        handleSecondDepShow(){
            this.secondDepShow = true;
        }
    },
    created(){
        this.getFirstDepList()
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

