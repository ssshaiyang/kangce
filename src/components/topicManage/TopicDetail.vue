<template>
    <div>
        <div v-if="!showEdit">    
            <section class="header--topic-detail">
                <h3 class="fl-l">话题详情</h3>
                <div class="topic-detail__options fl-r">
                    <el-button size="small" type="primary" @click="showEdit = true">编辑</el-button>
                    <el-button size="small" @click="goList">返回</el-button>
                </div>
            </section>
            <section class="content--topic-detail" v-loading="loading">
                <div>
                    <span class="title--content-item">话题ID</span>{{topicDetail.id}}
                    <span class="title--content-item publish-time">发布时间</span>{{topicDetail.publishTime}}
                </div>
                <div>
                    <span class="title--content-item">话题标题</span>
                    {{topicDetail.title}}
                </div>
                <div>
                    <span class="title--content-item">话题海报</span>
                    <img :src="topicDetail.imgUrl" width="300"/>
                </div>
                <div>
                    <span class="title--content-item">投票标签</span>
                    <span v-if="tags" class="tags-wrapper">
                        <el-tag v-for="(item, index) in tags" :type="['success', 'danger'][index]" :key="index">{{item}}</el-tag>
                    </span>
                    <span v-else>没有标签</span>
                </div>
                <div class="dis-f mt20">
                    <span class="title--content-item title--topic-data">话题数据</span>
                    <table class="data-table">
                        <tr>
                            <th>投票量</th>
                            <th>支持票</th>
                            <th>反对票</th>
                        </tr>
                        <tr>
                            <td>{{topicDetail.poll && topicDetail.poll.pollCount}}</td>
                            <td>{{topicDetail.poll && topicDetail.poll.support}}</td>
                            <td>{{topicDetail.poll && topicDetail.poll.oppose}}</td>
                        </tr>
                    </table>
                </div>
                <div class="dis-f mt20">
                    <span class="title--content-item"></span>
                    <table class="data-table">
                        <tr>
                            <th>浏览量</th>
                            <th>点赞量</th>
                            <th>评论量</th>
                            <th>收藏量</th>
                        </tr>
                        <tr>
                            <td>{{topicDetail.count && topicDetail.count.browseCount}}</td>
                            <td>{{topicDetail.count && topicDetail.count.focusCount}}</td>
                            <td>{{topicDetail.count && topicDetail.count.commentCount}}</td>
                            <td>{{topicDetail.count && topicDetail.count.favoriteCount}}</td>
                        </tr>
                    </table>
                </div>
            </section>
        </div>

        <!-- 编辑 -->
        <action-topic
        :topic-id="topicId"
        action-type="edit" 
        v-if="showEdit"
        @close-form="showEdit = false"
        @back-list="goList"
        @refresh-list="refreshList"
        @refresh-detail="checkTopic"></action-topic>
    </div>
</template>

<script>
const ActionTopic = () => import('./ActionTopic.vue');

import {
    checkTopicAPI,
} from '@/api/topicManageAPI';
import {
    TAG_MAP,
} from '@/public/constant';

export default {
    name:'',
    data() {
        return {
            topicDetail: {},
            loading: false,
            tags: null,
            showEdit: false,
        };
    },
    components: {
        ActionTopic,
    },
    props: {
        topicId: {
            required: true,
        },
    },
    methods: {
        /**
         * 获取详情
         */
        checkTopic() {
            this.loading = true;
            checkTopicAPI({
                id: this.topicId,
            })
                .then(res => {
                    let response = res.data;

                    this.topicDetail = response.data;
                    this.tags = this.topicDetail.tag ? TAG_MAP[this.topicDetail.tag].split('/') : '';
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        /**
         * 返回列表
         */
        goList() {
            this.$emit('back-list');
        },
        /**
         * 刷新列表
         */
        refreshList() {
            this.$emit('get-list');
        }
    },
    mounted() {
        this.checkTopic();
    }
};
</script>

<style scoped lang="less">
.header--topic-detail {
    margin-bottom: 20px;
    padding-bottom: 20px;
    overflow: hidden;
    border-bottom: 1px solid #e8e8e8;
}
.content--topic-detail {
    line-height: 4;
   color: #5e5e5e;

   img {
       vertical-align: text-top;
   }
}
.title--content-item {
    margin-right: 20px;
    width: 100px;
    display: inline-block;
    font-weight: bold;
    &.publish-time {
        margin-left: 200px;
    }
}
.tags-wrapper {
    & > * {
        margin-right: 10px;
    }
}
.title--topic-data {
    line-height: 1.2;
}
.data-table {
    line-height: 1.2;
    border-collapse: collapse;
    vertical-align: text-top;

    td, th {
        padding: 10px 20px;
        border: 1px solid #e8e8e8;
    }
}
</style>