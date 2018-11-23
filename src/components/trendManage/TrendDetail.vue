<!-- 动态详细信息 -->
<template>
    <div class="wrapper--doctor-detail" v-loading="wholeLoding">
        <section class="options">
            <el-button type="primary" @click="handleSetTop">置顶</el-button>
            <el-button type="primary" @click="openDelectModel">删除</el-button>
        </section>
        
        <section class="base-msg">
            <div class="base-msg__doctor-person">
                <el-row :gutter="10">
                    <el-col :span="6">
                        动态ID：{{trendDetail.id}}
                    </el-col>
                    <el-col :span="6">
                        时间：{{trendDetail.releaseTime}}
                    </el-col>
                    <el-col :span="12">
                        是否匿名：{{trendDetail.isAnonymous==1 ? '是' : '否'}}
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="6">
                        用户名：{{trendDetail.username}}
                    </el-col>
                    <el-col :span="6">
                        姓名：{{trendDetail.realName}}
                    </el-col>
                    <el-col :span="12">
                        手机：{{trendDetail.phone}}
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        小组：{{trendDetail.groupName || '-'}}
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        动态内容：{{trendDetail.content || '-'}}
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        图片：
                        <div v-html="imageArray"></div>                       
                    </el-col>
                    
                </el-row>
            </div>
        </section>

        <!--  动态数据 -->
        <el-row class="detail-section">
            <el-col class="detail-section__title" :span="2">
                动态数据
            </el-col>
            <el-col :span="22">
                <table class="data-table-show">
                    <tr>
                        <th>点赞量</th>
                        <th>评论量</th>
                        <th>收藏量</th>
                        <th>浏览量</th>
                    </tr>
                    <tr>
                        <td>{{trendDetail.focusNum}}</td>
                        <td>{{trendDetail.commentNum}}</td>
                        <td>{{trendDetail.collectNum}}</td>
                        <td>{{trendDetail.viewNum}}</td>
                    </tr>
                </table>
            </el-col>
        </el-row>

        <!-- 接诊数据 -->
        <el-row class="detail-section">
            <el-col class="detail-section__title" :span="2">
                评论数据
            </el-col>
            <el-col :span="22">
                <div>
                <el-table
                :data="commentData"
                size="medium "
                border
                height="350px"
                style="width: 100%">
                    <el-table-column
                    prop="username"
                    label="用户名"
                    min-width="100">
                    </el-table-column>
                    <el-table-column
                    prop="phone"
                    label="手机号"
                    min-width="100">
                    </el-table-column>
                    <el-table-column
                    prop="createTime"
                    label="时间"
                    min-width="100">
                    </el-table-column>
                    <el-table-column
                    prop="id"
                    label="评论ID"
                    min-width="50">
                    </el-table-column>
                    <el-table-column
                    prop="comment"
                    label="评论"
                    min-width="100">
                    </el-table-column>
                    <el-table-column
                    prop="focusNum"
                    label="点赞量"
                    min-width="50">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    min-width="120">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="handleSecondCheck(scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="handleDelComment(scope.row)">删除</el-button>
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
            </el-col>
        </el-row>
        <el-dialog
        title="动态详细"
        custom-class="el-dialog--user-manage__doctor-detail"
        :append-to-body="true"
        :visible.sync="secondCommentShow"
        width="70%">
            <comment :comment-id="commentId" @close-model="secondCommentShow = false" :get-trend-detail="getTrendDetail"></comment>
        </el-dialog>
    </div>
</template>

<script>


import {
    getTrendDetailAPI,
    getTrendFirstCommentAPI,
    setTopTrendAPI,
    delTrendAPI,
    delTrendCommentAPI,
} from '@/api/trendManageAPI.js';
const Comment =() => import('./Comment.vue')
export default {
    name:'TrendDetail',
    data() {
        return   {
            trendDetail: {},
            wholeLoding:false,
            imageArray:'',
            commentData:[],
            form:{
                page:1,
                limit:10
            },
            totalCount:0,
            secondCommentShow:false,
            commentId:null,
        };
    },
    components: {
        Comment
    },
    props: {
        trendId: {
            required: true,
        },
        // 获取医生列表
        getTrendList: {
            required: true,
            type: Function,
        },
    },
    watch: {
        trendId(newValue) {
            this.initPage(newValue);
        }
    },
    methods: {
        /**
         * 初始化页面
         * @param {Number} trendId 医生ID
         */
        initPage(trendId) {
            this.getTrendDetail(trendId);
            this.getTrendFirstComment(trendId);
        },
        /**
         * 获取医生详情
         * @param {Number} trendId 医生ID
         */
        getTrendDetail(trendId) {
            this.wholeLoding = true;
            getTrendDetailAPI(
                trendId
            )
                .then(res => {
                    this.$set(this.$data, 'trendDetail', res.data.data);
                    this.wholeLoding = false;
                    res.data.data.imgArr.map(item => {
                        let imgItem = "<img class='datailImg' src="+item+" height='140' width='140' />"
                        this.imageArray = this.imageArray + imgItem;
                    })
                })
                .catch(err => {
                    
                })
        },
        /**
         * @msg: 获取一级评论
         * @param {type} 
         * @return: 
         */
        getTrendFirstComment(trendId,args){
            this.wholeLoding = true;
            getTrendFirstCommentAPI(trendId,{...this.form})
                .then(res =>{
                    this.wholeLoding = false;
                    this.commentData = res.data.data.data;
                    this.totalCount = res.data.data.totalCount;
                })
        },
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
         * 完成详情内操作后的刷新详情和医生列表
         */
        finishOptions() {
            this.getTrendList();
            this.$emit('close-model')
            this.initPage(this.trendId);
        },
        /*
         * 置顶
         */
        handleSetTop(){
            console.log(this.trendId)
            setTopTrendAPI({
                dynamicId:this.trendId
                })
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        
                    } else {
                        status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    })
                })

        },
        /*
         * 删除动态
         */
        handleDelete(){
            delTrendAPI(this.trendId)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.finishOptions();
                    } else {
                        status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '删除成功！' : response.msg,
                    })
                })
        },
        handleDelComment(row){
            const delId = row.id;
            delTrendCommentAPI(delId)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getTrendFirstComment(this.trendId);
                    } else {
                        this.status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    })
                })
        },
        handleSecondCheck(row){
            this.commentId = row.id;
            this.secondCommentShow = true;
        },
        // finishOptions(){
        //     this.$emit('close-model');

        // }
        openDelectModel(){
            this.$confirm('此操作将永久删除该动态, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=> {
                this.handleDelete()
                    .then(res => {
                        let response = res.data;
                        if(response.code == 1000){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        }
                    });
            })
        }
    },
    mounted() {
        this.initPage(this.trendId);
    },
};
</script>

<style scoped lang="less">
.wrapper--doctor-detail {
    max-height: 600px;
    overflow: auto;

    & > .detail-section {
        margin: 30px auto 0;

        .detail-section__title {
            margin-bottom: 30px;
            font-size: 16px;
            font-weight: bold;
        }
    }
}
.base-msg {
    line-height: 2;
    overflow: hidden;
}
.base-msg__doctor-person {
    font-size: 16px;
    font-weight: bold;

    img {
        vertical-align: text-top;
        border-radius: 100px;
    }
    .doctor-person__msg {
        margin-left: 26px;
    }
}
.base-msg__doctor-work {
    float: right;
}
.data-table-show {
    border-collapse: collapse;

    td, th {
        padding: 8px 20px;
        border: 1px solid #ebeef5;
    }
}
.options {
    margin-bottom: 30px;
    padding-bottom: 12px;
    text-align: right;
    border-bottom: 1px solid #e8e8e8;
}
.datailImg{
    margin: 10px;
}
</style>