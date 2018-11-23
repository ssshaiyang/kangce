<!-- 系统管理：动态管理 -->
<template>
    <div class="ternd">
        <div class="trendfilter">
            <div class="trendfilteritem">
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
            <div class="trendfilteritem">
                <p>小组：</p>
                <el-select class="el-select" @change="selectChange" v-model="selectValue" placeholder="请选择">
                    <el-option
                    v-for="item in selectGroup"
                    :key="item.id"
                    :label="item.groupName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="trendsearch trendfilteritem">
                <el-input placeholder="请输入内容" v-model="queryInput" class="input-with-select">
                    <el-select v-model="dynamicSelect" slot="prepend" placeholder="请选择" @change="dynamicSelectChange">
                        <el-option label="用户名" value="1"></el-option>
                        <el-option label="姓名" value="2"></el-option>
                        <el-option label="动态内容" value="3"></el-option>
                        <el-option label="手机号" value="4"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
                </el-input>
            </div>
            <!-- <el-input class="el-input-search" v-model="filterValue" clearable placeholder="请输入你要查找的医生名或手机号"></el-input> 
             <el-button type="primary" @click="filtDoctorList">查找</el-button> -->
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
                prop="id"
                label="ID"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="releaseTime"
                label="发表时间"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="username"
                label="用户名"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="groupName"
                label="小组"
                min-width="100">
                </el-table-column>
                <el-table-column
                prop="content"
                label="动态内容"
                min-width="300">
                </el-table-column>
                <el-table-column
                prop="viewNum"
                label="浏览量"
                min-width="70">
                </el-table-column>
                <el-table-column
                prop="focusNum"
                label="点赞量"
                min-width="70">
                </el-table-column>
                <el-table-column
                prop="commentNum"
                label="评论量"
                min-width="70">
                </el-table-column>
                <el-table-column
                prop="collectNum"
                label="收藏量"
                min-width="70">
                </el-table-column>
                <el-table-column label="操作" min-width="220px">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleCheck(scope.row)">查看</el-button>
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
        <!-- 相关的弹窗 -->
        <!-- 医生详情弹窗 -->
        <el-dialog
        title="动态详细"
        custom-class="el-dialog--user-manage__doctor-detail"
        :append-to-body="true"
        :visible.sync="showTrendDetail"
        width="70%">
            <trend-detail 
            v-if='showTrendDetail'
            :trend-id="trendId" 
            @close-model="showTrendDetail = false" 
            :get-trend-list="getTrendList"></trend-detail>
        </el-dialog>
        
    </div>
</template>


<script>
import moment from 'moment';
import {
    getTrendListAPI,
    getGroupListAPI
} from '@/api/trendManageAPI.js';
const TrendDetail = () => import ('./TrendDetail.vue')

export default {
    data(){
        return {
            form:{
                filter: '',
                limit: 10,
                page: 1,
                groupId:0,

                //startTime:'',
                //endTime:'',
                //status:'',
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
            issueTime:'',//发布时间
            selectValue:'',//下拉框
            totalCount:0,//总条数
            selectGroup:[],//小组下拉列表
            dynamicSelect:'',//查询类型
            queryInput:'',//查询关键字
            showTrendDetail: false,
            trendId:null,
        }
    },
    components: {
        TrendDetail,
    },
    methods: {

        /*
         * 获取动态列表
         */
        getTrendList(){
            const params = {...this.form};
            this.tableLoading = true;
            getTrendListAPI(params)
                .then(res => {
                    const data = res.data.data;
                    this.tableData = data.data;
                    this.totalCount = data.totalCount;
                    this.tableLoading = fasle;
                    
                })
                .catch(err => {
                    this.tableLoading = false;
                })
        },
        /*
         * 获取小组下拉列表
         */
        getGroupList(){
            getGroupListAPI()
                .then(res => {
                    this.selectGroup.push(
                        {id: 0, groupName: "全部"}
                    )
                    const data = res.data.data;
                    this.selectGroup.push(
                       ...data
                    )
                })
        },
        /**
         * @msg: 关键字查询
         */
        handleQuery(){
            this.form.filter = this.queryInput;
            this.getTrendList()
        },
        /**
         * @msg: 编辑 
         * @param row :行
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
                        this.getTrendList();
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
        handleCheck(row) {
            this.trendId = row.id;
            this.showTrendDetail = true;
            
        },
        /**
         * 切换表格每页大小，请求新页面医生列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getTrendList();
        },
        /**
         * 翻页，请求新页面医生列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getTrendList();
        },
        /**
         * @msg: 勾选框 
         */
        handleSelectionChange(val){
            this.deleteArray = [];
            val.map(item => this.deleteArray.push(parseInt(item.id)));
        },
        /**
         * @msg: 更改时间
         */
        dateChange(date){
            if(date !== null){
                this.form.startTime = moment(date[0]).format('YYYY-MM-DD');
                this.form.endTime = moment(date[1]).format('YYYY-MM-DD');
            }else if(date == null){
                this.form.startTime = "";
                this.form.endTime = "";
            }
            this.getTrendList();
        },
        /**
         * @msg: 小组查询
         * @param {type} 
         * @return: 
         */
        selectChange(status){
            this.form.groupId = parseInt(status); 
            this.getTrendList();
        },
        /**
         * @msg: 查询类型
         * @param {type} 
         * @return: 
         */
        dynamicSelectChange(status){
            this.form.dynamicQueryFlag = parseInt(status); 
        },
        /**
         * @msg: 打开改变banner弹窗
         */
        handleChangeBannge(){
            this.modelChangeBanngeShow = true;
        }
    },
    created(){
        this.getGroupList();
        this.getTrendList();
    }

}
</script>

<style>
    .trendfilter{
        margin-top:20px; 
        display: flex;
        justify-content: space-around;
    }
    .trendfilteritem{
        display: flex;
    }
    .trendfilter div p{
        line-height: 40px;
    }
    .ternd .el-input-search{
        width: 200px;
    }
    .ternd .el-select{
        width: 125px;
    }
    .ternd .table{
        margin-top: 20px;
    }
    .ternd .del_All{
        margin: 15px;
    }
    .ternd .el-input-group__prepend .el-select .el-input {
        width: 80px;
    }
    .ternd .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    .ternd .trendsearch .el-select{
        width:80px;
    }
    .ternd .trendsearch .el-input__inner{
        width:120px;
    }

</style>


