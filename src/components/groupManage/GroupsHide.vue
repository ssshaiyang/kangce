<!-- 隐藏小组列表 -->
<template>
    <div class="p20">
        <div v-if="!detialShow">
            <div class="options">
                <h3 class="fl-l">隐藏小组</h3>
                <el-button class="fl-r" @click="backList">返回</el-button>
            </div>

            <el-table
            :data="tableData"
            size="medium "
            border
            max-height="400"
            v-loading="tableLoading"
            style="width: 100%">

                <el-table-column
                fixed
                prop="id"
                label="小组ID"
                width="150">
                </el-table-column>

                <el-table-column
                prop="name"
                label="小组名称"
                min-width="150">
                </el-table-column>

                <el-table-column
                prop="postCount"
                label="总发帖量"
                min-width="200">
                </el-table-column>

                <el-table-column
                prop="browseCount"
                label="总浏览量"
                min-width="100">
                </el-table-column>

                <el-table-column
                prop="peopleCount"
                label="总活跃用户量"
                min-width="100">
                </el-table-column>

                <el-table-column
                fixed="right"
                label="操作"
                min-width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="showDetail(scope.row)">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
                
            </el-table>
        </div>

        <!-- 小组详情 -->
        <group-detail
         v-if="detialShow" :group-id="groupId" @back-list="detialShow = false" @get-list="getIndexList"
        ></group-detail>
    </div>
</template>

<script>
const GroupDetail = () => import('./GroupDetail.vue');

import Buss from './Buss.js';
import {
    getGroupsHideAPI,
} from '@/api/groupManageAPI';

export default {
    name:'',
    data() {
        return {
            tableLoading: false, // 是否显示loading
            tableData: [],
            groupId: null,

            detialShow: false,
        };
    },
    components: {
        GroupDetail,
    },
    methods: {
        /**
         * 获取列表
         */
        getGroupsHide() {
            this.tableLoading = true;
            getGroupsHideAPI()
                .then(res => {
                    const data = res.data.data;

                    this.tableData = data;
                    this.tableLoading = false;
                })
                .catch(err => {
                    this.tableLoading = false;
                })
        },
        /**
         * 查看详情
         * @param {Object} row 行信息
         */
        showDetail(row) {
            this.groupId = row.id;
            this.detialShow = true;
            // 修改 Buss 的 isHideGroup 属性
            Buss.$emit('changeIsHideGroup', true);
            // 修改 Buss 的 isHideGroup 属性
            Buss.$emit('changeGroupType', false);
        },
        /**
         * 返回小组列表
         */
        backList() {
            this.$emit('back-index');
        },
        /**
         * 刷新主页面列表和隐藏列表
         */
        getIndexList() {
            this.getGroupsHide();
            this.$emit('get-index-list');
        },
    },
    mounted() {
        this.getGroupsHide();
    },
};
</script>

<style scoped lang="less">
.options {
    margin-bottom: 20px;
    overflow: hidden;
}
</style>