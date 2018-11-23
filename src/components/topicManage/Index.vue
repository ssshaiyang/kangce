<!-- 社区管理：话题管理 -->
<template>
    <div class="p20">
        <div v-if="!showDetail && !showAdd">
            <div class="options">
                <el-button class="fl-l" type="primary" @click="showAdd = true">新增话题</el-button>
                <el-button class="fl-r" type="primary" @click="downloadTopicList" v-loading="loadingExport">导出详细数据</el-button>
            </div>

            <div class="filter mt30">
                <el-form inline>
                    <el-form-item label="发布时间">
                        <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        range-separator="-"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="话题类型">
                        <el-select v-model="topicType">
                            <el-option
                            :value="''"
                            label="全部"
                            ></el-option>
                            <el-option
                            :value="1"
                            label="投票话题"
                            ></el-option>
                            <el-option
                            :value="2"
                            label="普通话题"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-input class="el-input-search" v-model="keyword" clearable placeholder="请输入话题名称"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="filtTopicList">查找</el-button>
                    </el-form-item>
                </el-form>
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
                    prop="id"
                    label="话题ID"
                    width="150">
                    </el-table-column>

                    <el-table-column
                    prop="title"
                    label="话题名称"
                    min-width="150">
                    </el-table-column>

                    <el-table-column
                    prop="publishTime"
                    label="发布时间"
                    min-width="150">
                    </el-table-column>

                    <el-table-column
                    prop="browseCount"
                    label="浏览量"
                    min-width="300">
                        <template slot-scope="scope">
                            {{scope.row.count.browseCount}}
                        </template>
                    </el-table-column>

                    <el-table-column
                    prop="focusCount"
                    label="点赞量"
                    min-width="200">
                        <template slot-scope="scope">
                            {{scope.row.count.focusCount}}
                        </template>
                    </el-table-column>

                    <el-table-column
                    prop="commentCount"
                    label="评论量"
                    min-width="100">
                        <template slot-scope="scope">
                            {{scope.row.count.commentCount}}
                        </template>
                    </el-table-column>

                    <el-table-column
                    prop="favoriteCount"
                    label="收藏量"
                    min-width="100">
                        <template slot-scope="scope">
                            {{scope.row.count.favoriteCount}}
                        </template>
                    </el-table-column>

                    <el-table-column
                    fixed="right"
                    label="操作"
                    min-width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="checkTopicDetail(scope.row.id)">
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
        </div>

        <!-- 话题详情-->
        <topic-detail v-if="showDetail" :topic-id="topicId" @back-list="backListFromDetail" @get-list="getTopicList"></topic-detail>
        
        <!-- 添加话题 -->
        <action-topic
        action-type="add" 
        v-if="showAdd"
        @close-form="showAdd = false"
        @refresh-list="getTopicList"></action-topic>
    </div>
</template>

<script>
const TopicDetail = () => import('./TopicDetail.vue');
const ActionTopic = () => import('./ActionTopic.vue');

import {
    getTopicListAPI,
    downloadTopicListAPI,
} from '@/api/topicManageAPI';

export default {
    name:'',
    data() {
        return {
            form: {
                keyword: '',
                limit: 10,
                page: 1,
                startTime: '',
                endTime: '',
                topicType: ''
            },
            dateRange: [], // 日期范围
            topicType: '', // 话题类型
            keyword: '', // 输入框
            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            totalCount: 0, // 总条数
            loadingExport: false, // 导出loading
            topicId: null, // 话题 ID

            showDetail: false, // 话题详情弹窗
            showAdd: false,
        };
    },
    components: {
        TopicDetail,
        ActionTopic,
    },
    methods: {
        /**
         * 获取列表
         */
        getTopicList() {
            const params = {...this.form};

            this.tableLoading = true;
            getTopicListAPI(params)
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
         * 导出话题数据
         */
        downloadTopicList() {
            const params = {...this.form};

            delete params.limit;
            delete params.page;

            this.loadingExport = true;
            downloadTopicListAPI(params)
                .then(res => {
                    this.loadingExport = false;

                    const response = res.data;
                    const url = URL.createObjectURL(response);

                    const link = document.createElement('a');

                    link.href = url;
                    link.download = '话题数据.xlsx';
                    link.target = '_blank';
                    link.click();
                })
                .catch(err => {
                    this.loadingExport = false;
                });
        },
        /**
         * 查看话题
         * @param {Number|String} topicId 话题ID
         */
        checkTopicDetail(topicId) {
            this.showDetail = true;
            this.topicId = topicId;
        },
        /**
         * 点击查找
         */
        filtTopicList() {
            const dateRange = this.dateRange ? this.dateRange : ['', ''];

            this.form.page = 1;
            this.form.keyword = this.keyword;
            this.form.startTime = dateRange[0];
            this.form.endTime = dateRange[1];
            this.form.topicType = this.topicType; 
            this.getTopicList();
        },
        /**
         * 切换表格每页大小，请求新页面列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getTopicList();
        },
        /**
         * 翻页，请求新页面列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getTopicList();
        },
        /**
         * 从详情返回列表
         */
        backListFromDetail() {
            this.showDetail = false;
        },
    },
    mounted() {
        this.getTopicList();
    },
};
</script>

<style scoped>
    .options {
        overflow: hidden;
    }
</style>