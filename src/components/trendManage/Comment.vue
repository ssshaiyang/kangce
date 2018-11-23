<template>
    <div class="wrapper--doctor-detail" v-loading="wholeLoding">
        <section class="base-msg">
            <div class="base-msg__doctor-person">
                <el-row :gutter="10">
                    <el-col :span="6">
                        评论ID：{{trendDetail.firstId}}
                    </el-col>
                    <el-col :span="6">
                        时间：{{trendDetail.commentTime}}
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
                        评论：{{trendDetail.comment || '-'}}
                    </el-col>
                </el-row>
            </div>
        </section>

        <!-- 回复数据 -->
        <el-row class="detail-section">
            <el-col class="detail-section__title" :span="2">
                回复数据
            </el-col>
            <el-col :span="22">
                <div>
                <el-table
                :data="secondData"
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
                    label="回复ID"
                    min-width="50">
                    </el-table-column>
                    <el-table-column
                    prop="comment"
                    label="回复"
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
                            @click="handleDelSecComment(scope.row)">删除</el-button>
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

        
    </div>
</template>


<script>


import {
    getTrendSecondCommenttAPI,
    delTrendCommentAPI
} from '@/api/trendManageAPI.js';

export default {
    name:'Comment',
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
            secondData:[],

        };
    },
    components: {
        
    },
    props: {
        commentId: {
            required: true,
        },
        // 获取医生列表
        getTrendDetail: {
            required: true,
            type: Function,
        },
    },
    watch: {
        commentId(newValue) {
            this.initPage(newValue);
        }
    },
    methods: {
        /**
         * 初始化页面
         * @param {Number} commentId 医生ID
         */
        initPage(commentId) {
            this.getSecCommentDetail(commentId);
        },
        /**
         * 获取医生详情
         * @param {Number} commentId 医生ID
         */
        getSecCommentDetail(commentId) {
            this.wholeLoding = true;
            getTrendSecondCommenttAPI(
                commentId,{...this.form}
            )
                .then(res => {
                    this.$set(this.$data, 'trendDetail', res.data.data);
                    this.totalCount = res.data.data.totalCount;
                    this.secondData = res.data.data.secondArray;
                    this.wholeLoding = false;
                    
                })
                .catch(err => {
                    
                })
        },
        /**
         * @msg: 获取一级评论
         * @param {type} 
         * @return: 
         */
        
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getTrendDetail();
        },
        /**
         * 翻页，请求新页面医生列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getTrendDetail();
        },
        // 删除回复数据
        handleDelSecComment(row){
            const delId = row.id;
            delTrendCommentAPI(delId)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getSecCommentDetail(this.commentId);
                    } else {
                        this.status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    })
                })
        }
    },
    mounted() {
        this.initPage(this.commentId);
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