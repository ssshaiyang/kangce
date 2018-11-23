<!-- APP审核管理 -->
<template>
    <div class="wrapper--app-review">
        <el-table
        :data="tableData"
        size="medium "
        border
        max-height="460"
        style="width: 100%"
        v-loading="loading"
        >
            <el-table-column
            prop="platform"
            label="平台"
            fixed
            width="200"
            >
                <template slot-scope="scope">
                    {{
                        {
                            1: 'IOS',
                            2: 'Android',
                        }[scope.row.platform]
                    }}
                </template>
            </el-table-column>

            <el-table-column
            prop="version"
            label="app版本号"
            min-width="200"
            ></el-table-column>

            <el-table-column
            prop="isAuditing"
            label="是否审核中"
            min-width="200"
            >
                <template slot-scope="scope">
                    {{['否', '是'][scope.row.isAuditing]}}
                </template>
            </el-table-column>

            <el-table-column
            label="操作"
            fixed="right"
            width="100"
            >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editPlatform(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 修改表单 -->
        <el-dialog
        :title="`修改 ${{
            1: 'IOS',
            2: 'Android',
        }[rowSelected.platform]}`"
        :append-to-body="true"
        :visible.sync="modelForm"
        width="500px"
        >
            <form-edit v-if="modelForm" @close-form="modelForm = false" :msg-selected="rowSelected"></form-edit>
        </el-dialog>
    </div>
</template>

<script>
const FormEdit = () => import('./FormEdit.vue');

import { getAppReviewListAPI } from '@/api/appReviewManageAPI';

export default {
    name:'',
    data() {
        return {
            tableData: [
                {
                    platform: 1,
                    version: '1.0.0',
                    isAuditing: 1,
                    updateTime: '2018-08-16',
                    createTime: '2018-01-20',
                }
            ],
            rowSelected: {},
            modelForm: false,

            loading: false,
        };
    },
    components: {
        FormEdit,
    },
    methods: {
        /**
         * 获取APP审核列表
         */
        getAppReviewList() {
            this.loading = true;
            getAppReviewListAPI()
                .then(response => {
                    const res = response.data;

                    this.tableData = Object.keys(res.data).map(item => res.data[item] || []);
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        /**
         * 点击修改按钮
         * @param {Object} row 行信息
         */
        editPlatform(row) {
            this.rowSelected = {...row};
            this.modelForm = true;
        },
    },
    mounted() {
        this.getAppReviewList();
    },
};
</script>

<style scoped>
.wrapper--app-review {
    padding: 20px;
}
</style>