<!-- 系统理：资讯管理 -->
<template>
    <div class="infomationManager">
        <div class="info-filter">
            <div>
                <p>发布时间：</p>
                <div class="block">
                    <el-date-picker
                    v-model="issueTime"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="dateChange"
                    :picker-options="pickerOptions2">
                    </el-date-picker>
                </div>
            </div>
            <div>
                <p>状态：</p>
                <el-select class="el-select" @change="selectChange" v-model="selectValue" placeholder="请选择">
                    <el-option
                    v-for="item in stateSelectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-button type="danger" @click="addInformation" size="small" plain>添加资讯</el-button>
            </div>
            <!-- <el-input class="el-input-search" v-model="info-filterValue" clearable placeholder="请输入你要查找的医生名或手机号"></el-input> -->
            <!-- <el-button type="primary" @click="filtDoctorList">查找</el-button> -->
        </div>
        <div class="table" v-loading="tableLoading">
            <el-table
            :data="tableData"
            size="medium "
            border
            @selection-change="handleSelectionChange"
            height="350px"
            style="width: 100%">
                <el-table-column
                type="selection"
                min-width="55">
                </el-table-column>
                <el-table-column
                prop="id"
                label="ID"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="title"
                label="标题"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="status"
                label="状态"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="createTime"
                label="发布时间"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="readAmount"
                label="阅读量"
                min-width="70">
                </el-table-column>
                <el-table-column
                prop="readAmount"
                label="评论量"
                min-width="70">
                </el-table-column>
                <el-table-column
                prop="readAmount"
                label="点赞量"
                min-width="70">
                </el-table-column>
                <el-table-column
                prop="operationName"
                label="作者"
                min-width="100">
                </el-table-column>
                <el-table-column label="操作" min-width="220px">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleCheck(scope.$index, scope.row)">查看</el-button>
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <el-button 
            class="del_All"
            size="medium "
            type="primary"
            @click="deleteAll">批量删除</el-button>
        <el-button 
            class="del_All"
            size="medium "
            type="primary"
            @click="handleChangeBannge">设为Banner</el-button>
        <!-- 相关的弹窗 -->
        <el-dialog
        :title="this.isEdit ? '编辑资讯' : '添加资讯'"
        :append-to-body="true"
        :visible.sync="modelAddInfoShow"
        width="960px">
            <add-information
            :news-info-id="this.isEdit ? this.newsInfoID : -1"
            :isEdit="this.isEdit ? this.isEdit : false"
            :model-status="modelAddInfoShow"
            v-if="modelAddInfoShow"
            :model-add-info-show="this.modelAddInfoShow"
            @close-form="modelAddInfoShow = false" 
            @finish-action="getNewsList"></add-information>
        </el-dialog>
        <el-dialog
        title="查看资讯"
        :append-to-body="true"
        :visible.sync="modelCheckInfoShow"
        width="960px">
            <check-info
            :news-info-id="this.newsInfoID"
            :model-status="modelCheckInfoShow"
            v-if="modelCheckInfoShow"
            @close-form="modelCheckInfoShow = false" 
            @finish-action="finishOptions"></check-info>
        </el-dialog>
        <el-dialog
        title="设置Banner"
        :append-to-body="true"
        :visible.sync="modelChangeBanngeShow"
        width="960px">
            <change-banner
            v-if="modelChangeBanngeShow"
            :model-status="modelChangeBanngeShow"
            :get-news-list="getNewsList"
            @close-form="modelChangeBanngeShow = false" 
            @finish-action="getNewsList">></change-banner>
        </el-dialog>
    </div>
</template>


<script>
import moment from 'moment';
import {
    getNewsListAPI,
    delAllImfoAPI,
    deleteNews
} from '@/api/informationManagerAPI.js';
const AddInformation = () => import('./AddInformation.vue'); 
const ChangeBanner = () => import('./ChangeBanner.vue');
const CheckInfo = () => import('./CheckInfo.vue');

export default {
    data(){
        return {
            form:{
                filter: '',
                limit: 10,
                page: 1,
                startTime:'',
                endTime:'',
                status:'',
            },
            tableLoading: false,
            tableData: [],
            pickerOptions2: { //时间快捷选择
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            stateSelectOptions: [{
                // value: null,
                // label: '全部'
                // },{//状态下拉框
                value: '1',
                label: '正常'
                }, {
                value: '2',
                label: '下线'
                }, {
                value: '3',
                label: 'banner'
                }, {
                value: '0',
                label: '草稿'
                }
            ],
            issueTime:'',//发布时间
            selectValue:'',//下拉框
            totalCount:0,//总条数
            modelAddInfoShow:false,//新增资讯弹窗
            modelChangeBanngeShow:false,//改变BANNER弹窗
            modelCheckInfoShow:false,//查看资讯弹窗
            isEdit:false,//编辑OR新增
            newsInfoID:'',
            deleteArray:[],//批量删除列表
        }
    },
    components: {
        AddInformation,
        ChangeBanner,
        CheckInfo
    },
    methods: {
        /*
         * 获取资讯列表
         */
        getNewsList(){
            const params = {...this.form};
            this.tableLoading = true;
            getNewsListAPI(params)
                .then(res => {
                    const data = res.data.data;
                    data.data.map(item => {
                        if(item.status==0){
                            item.status = "草稿"
                        }
                        if(item.status==1){
                            item.status = "上线"
                        }
                        if(item.status==2){
                            item.status = "下线"
                        }
                        if(item.status==3){
                            item.status = "banner"
                        }
                    })
                    this.tableData = data.data;
                    this.totalCount = data.totalCount;
                    this.tableLoading = fasle;
                    
                })
                .catch(err => {
                    this.tableLoading = false;
                })
        },
        /**
         * @msg: 
         * @param {type} 
         * @return: 
         */
        handleEdit(index, row) {
            this.isEdit = true;
            this.modelAddInfoShow = true;
            this.newsInfoID = parseInt(row.id)
            
        },
        /**
         * @msg: 删除
         * @param {type} 
         * @return: 
         */
        handleDelete(index, row) {
            let delID =  parseInt(row.id);
            deleteNews(delID)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getNewsList();
                    } else {
                        this.status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    })
                })
        },
        /**
         * @msg: 查看
         * @param {type} 
         * @return: 
         */
        handleCheck(index, row) {
            this.modelCheckInfoShow = true;
            this.newsInfoID = parseInt(row.id)
        },
        /**
         * 切换表格每页大小，请求新页面医生列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getNewsList();
        },
        /**
         * 翻页，请求新页面医生列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getNewsList();
        },
        handleSelectionChange(val){
            this.deleteArray = [];
            val.map(item => this.deleteArray.push(parseInt(item.id)));
        },
        /**
         * @msg: 批量删除
         * @param {type} 
         * @return: 
         */
        deleteAll(){
            delAllImfoAPI({
                ids:this.deleteArray
                })
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getNewsList();
                    } else {
                        this.status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    })
                })
        },
        dateChange(date){
            console.log(date)
            if(date !== null){
                this.form.startTime = moment(date[0]).format('YYYY-MM-DD');
                this.form.endTime = moment(date[1]).format('YYYY-MM-DD');
            }else if(date === null){
                this.form.startTime = "";
                this.form.endTime = "";
            }
            this.getNewsList();
        },
        selectChange(status){
            this.form.status = parseInt(status); 
            this.getNewsList();
        },
        /*
         * 添加资讯
         */
        addInformation(){
            this.isEdit = false;
            this.modelAddInfoShow = true;
        },
        /*
         * 结束查看时刷新列表
         */
        finishOptions(){
            this.getNewsList();
        },
        /*
         * 修改banner
         */
        handleChangeBannge(){
            this.modelChangeBanngeShow = true;
        }
    },
    created(){
        this.getNewsList();
    }

}
</script>

<style scoped>
    .infomationManager .info-filter{
        margin-top:20px; 
        display: flex;
        justify-content: space-around;
    }
    .infomationManager .info-filter div{
        display: flex;

    }
    .infomationManager .info-filter div p{
        line-height: 40px;
    }
    .infomationManager .el-input-search{
        width: 200px;
    }
    .infomationManager .el-select{
        width: 100px;
    }
    .infomationManager .table{
        margin-top: 20px;
    }
    .infomationManager .del_All{
        margin: 15px;
    }

</style>


