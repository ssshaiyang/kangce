<!-- 社区管理：小组管理 -->
<template>
    <div class="p20">
        <div v-if="!showAdd && !detialShow && !groupsHideShow">
            <div class="options">
                <el-button class="fl-l" type="primary" @click="showAdd = true">新增小组</el-button>
                <el-button class="fl-r" type="primary" @click="modelExport = true">导出详细数据</el-button>
                <el-button class="fl-r" type="primary" @click="groupsHideShow = true">查看隐藏列表</el-button>
            </div>

            <div class="table" v-loading="tableLoading">
                <!-- 深夜小组 -->
                <h3 class="pb20 pt30" >深夜小组（无法添加可编辑）</h3>
                <el-table
                :data="midnightTable"
                size="medium "
                border
                max-height="400"
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
                    min-width="150">
                    </el-table-column>

                    <el-table-column
                    prop="browseCount"
                    label="总浏览量"
                    min-width="300">
                    </el-table-column>

                    <el-table-column
                    prop="peopleCount"
                    label="总活跃用户量"
                    min-width="200">
                    </el-table-column>

                    <el-table-column
                    fixed="right"
                    label="操作"
                    min-width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="showDetail(scope.row, true)">
                                查看
                            </el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>

                <!-- 普通小组 -->
                <h3 class="pb20 pt30" >普通小组</h3>
                <el-table
                :data="normalTable"
                size="medium "
                border
                max-height="400"
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
                    prop="rank"
                    label="位置排序"
                    min-width="150">
                    </el-table-column>

                    <el-table-column
                    prop="browseCount"
                    label="调整"
                    min-width="300">
                        <template slot-scope="scope">
                            <el-button circle @click="setGroupPosition(scope.row, 1)">
                                <i class="el-icon-arrow-up"></i>
                            </el-button>
                            <el-button circle @click="setGroupPosition(scope.row, 2)">
                                <i class="el-icon-arrow-down"></i>
                            </el-button>
                        </template>
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
                            <el-button size="mini" type="primary" @click="showDetail(scope.row, false)">
                                查看
                            </el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>
            </div>
        </div>

        <!-- 新增表单 -->
        <action-form
        action-type="add"
        v-if="showAdd"
        @close-form="showAdd = false"
        @refresh-list="getGroupList"
        ></action-form>

        <!-- 小组详情 -->
        <group-detail
         v-if="detialShow" :group-id="groupId" @back-list="detialShow = false" @get-list="getGroupList"
        ></group-detail>

        <!-- 隐藏小组列表 -->
        <groups-hide
        v-if="groupsHideShow"
        @get-index-list="getGroupList"
        @back-index="groupsHideShow = false"
        ></groups-hide>

        <!-- 导出弹窗 -->
        <el-dialog
        title="导出详细数据"
        :append-to-body="true"
        :visible.sync="modelExport"
        width="500px"
        >
            <export-form
            v-if="modelExport"
            :groups="midnightTable.concat(normalTable)"
            @close-form="modelExport = false"
            ></export-form>
        </el-dialog>
    </div>
</template>

<script>
const ExportForm = () => import('./ExportForm.vue');
const ActionForm = () => import('./ActionForm.vue');
const GroupDetail = () => import('./GroupDetail.vue');
const GroupsHide = () => import('./GroupsHide.vue');

import Buss from './Buss.js';
import {
    getGroupListAPI,
    setGroupPositionAPI,
} from '@/api/groupManageAPI';

export default {
    name:'',
    data() {
        return {
            tableLoading: false, // 是否显示loading
            midnightTable: [], // 深夜小组数据
            normalTable: [], // 普通小组数据
            groupId: null,

            modelExport: false,
            detialShow: false,
            showAdd: false,
            groupsHideShow: false,
        };
    },
    components: {
        ExportForm,
        ActionForm,
        GroupDetail,
        GroupsHide,
    },
    methods: {
        /**
         * 获取列表
         */
        getGroupList() {
            this.tableLoading = true;
            getGroupListAPI()
                .then(res => {
                    const data = res.data.data;

                    this.midnightTable = data.nightGroup;
                    this.normalTable = data.normalGroup.sort((pre, after) => {
                        return pre.rank - after.rank;
                    });
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
         * 查看详情
         * @param {Object} row 行信息
         * @param {Boolean} isMidnightGroup 是否为深夜小组
         */
        showDetail(row, isMidnightGroup) {
            this.groupId = row.id;
            this.detialShow = true;
            // 修改 Buss 的 isHideGroup 属性
            Buss.$emit('changeIsHideGroup', false);
            // 修改 Buss 的 isHideGroup 属性
            Buss.$emit('changeGroupType', isMidnightGroup);
        },
        /**
         * 调整小组位置
         * @param {Object} row 小组信息
         * @param {Number} type 调整类型 1-上升 2-下降
         */
        setGroupPosition(row, type) {
            setGroupPositionAPI({
                groupId: row.id,
                type: type,
            })
                .then(res => {
                    const response = res.data;

                    if (response.code === 1000) {
                        this.$message({
                            type: 'success',
                            message: '调整成功！',
                        });
                        this.getGroupList();
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.msg,
                        });
                    }
                });
        },
    },
    mounted() {
        this.getGroupList();
    },
};
</script>

<style scoped lang="less">
    .options {
        overflow: hidden;
    }
</style>