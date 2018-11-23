<!-- 异常管理列表 -->
<template>
    <div class="wrapper--doctor-user" v-loading="tableLoading">
        <el-table
        :data="tableData"
        size="medium "
        border
        :max-height="400"
        style="width: 100%">
            <el-table-column
            fixed
            prop="name"
            label="异常名称"
            min-width="200">
            </el-table-column>
            <el-table-column
            prop="decisionMethod"
            label="判断方式"
            min-width="200">
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="200">
                <template slot-scope="scope">
                    <el-button @click="makesureToggleAbnormal(scope.row)" type="danger">
                        {{scope.row.status === 1 ? '解除' : '恢复'}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    getAbnormalTypeListAPI,
    toggleAbnormalStatusAPI,
} from '@/api/userManageAPI.js';

export default {
    name:'',
    data()   {
        return   {
            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
        };
    },
    methods: {
        /**
         * 获取黑名单用户列表
         */
        getAbnormalTypeList() {
            const params = {
                page: 1,
                limit: 1000,
            };

            this.tableLoading = true;
            getAbnormalTypeListAPI(params)
                .then(res => {
                    const data = res.data.data;

                    this.tableData = data.data;
                    this.tableLoading = false;
                })
                .catch(err => {
                    this.tableLoading = false;
                });
        },
        /**
         * 确认解除/开启异常
         * @param {Object} row 该行信息
         */
        makesureToggleAbnormal(row) {
            this.$confirm(`确定${row.status === 1 ? '解除' : '恢复'}该异常吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.toggleAbnormalStatus(row);
                })
                .catch(err => {});
        },
        /**
         * 解除/开启异常
         * @param {Object} row 该行信息
         */
        toggleAbnormalStatus(row) {
            toggleAbnormalStatusAPI({
                abnormal_type_id: row.id,
                abnormalOperation: row.status === 1 ? 1 : 2,
            })
                .then(res => {
                    const data = res.data;

                    if (data.code === 1000) {
                        this.$message({
                            type: 'success',
                            message: `${row.status === 1 ? '解除' : '恢复'}异常成功！`,
                        });
                        this.getAbnormalTypeList();
                        this.$emit('refresh-doctor-list');
                    } else {
                        this.$message({
                            type: 'error',
                            message: data.msg,
                        });
                    }
                });
        },
    },
    created() {
        this.getAbnormalTypeList();
    }
};
</script>

<style scoped lang="less">
</style>