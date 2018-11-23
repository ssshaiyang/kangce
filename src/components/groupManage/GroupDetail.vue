<!-- 小组详情 -->
<template>
    <div>
        <div v-if="!showEdit">    
            <section class="header--group-detail">
                <h3 class="fl-l">小组详情</h3>
                <div class="group-detail__options fl-r">
                    <el-button size="small" type="primary" @click="showEdit = true">编辑</el-button>
                    <el-button size="small" type="primary" @click="checkDynamic">查看动态</el-button>
                    <el-button size="small" @click="goList">返回</el-button>
                </div>
            </section>
            <section class="content--group-detail" v-loading="loading">
                <div>
                    <span class="title--content-item">小组ID</span>{{groupDetail.id}}
                </div>
                <div>
                    <span class="title--content-item">小组名称</span>
                    {{groupDetail.name}}
                </div>
                <div>
                    <span class="title--content-item">小组头像</span>
                    <img v-if="groupDetail.imgUrl" :src="groupDetail.imgUrl" width="300"/>
                    <span v-else>-</span>
                </div>
                <div>
                    <span class="title--content-item">小组介绍</span>
                    {{groupDetail.describe}}
                </div>
                <div class="dis-f mt20">
                    <span class="title--content-item title--topic-data">小组数据</span>
                    <table class="data-table">
                        <tr>
                            <th>日期</th>
                            <th>发帖量</th>
                            <th>浏览量</th>
                            <th>活跃用户量</th>
                            <th>累计发帖量</th>
                            <th>累计浏览量</th>
                            <th>累计活跃用户量</th>
                        </tr>
                        <tr v-for="(item, index) in (groupDetail.count || [])" :key="index">
                            <td>{{item.date}}</td>
                            <td>{{item.postCount}}</td>
                            <td>{{item.browseCount}}</td>
                            <td>{{item.peopleCount}}</td>
                            <td>{{item.postTotalCount}}</td>
                            <td>{{item.browseTotalCount}}</td>
                            <td>{{item.peopleTotalCount}}</td>
                        </tr>
                    </table>
                </div>
            </section>
        </div>

        <!-- 编辑 -->
        <action-form
        :group-id="groupId"
        action-type="edit" 
        v-if="showEdit"
        @close-form="showEdit = false"
        @back-list="goList"
        @refresh-list="refreshList"
        @refresh-detail="getGroupDetail"></action-form>
    </div>
</template>

<script>
const ActionForm = () => import('./ActionForm.vue');

import {
    getGroupDetailAPI,
} from '@/api/groupManageAPI';

export default {
    name:'',
    data() {
        return {
            groupDetail: {},
            loading: false,
            showEdit: false,
        };
    },
    components: {
        ActionForm,
    },
    props: {
        groupId: {
            required: true,
        },
    },
    methods: {
        /**
         * 获取详情
         */
        getGroupDetail() {
            this.loading = true;
            getGroupDetailAPI({
                id: this.groupId,
            })
                .then(res => {
                    let response = res.data;

                    this.groupDetail = response.data;
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
        },
        /**
         * 查看动态
         */
        checkDynamic() {
            this.$store.commit('menu/changeActiveItem', 43);
        },
    },
    mounted() {
        this.getGroupDetail();
    }
};
</script>

<style scoped lang="less">
.header--group-detail {
    margin-bottom: 20px;
    padding-bottom: 20px;
    overflow: hidden;
    border-bottom: 1px solid #e8e8e8;
}
.content--group-detail {
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