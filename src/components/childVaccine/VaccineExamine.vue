<!-- 系统管理：儿童疫苗管理 -->
<template>
    <div class="wrapper--doctor-user">
        <div class="filter">
            <el-button type="primary" @click="changeVaccine(0)">新建疫苗</el-button>
        </div>
        <div class="table" v-loading="tableLoading">
            <el-table
            :data="tableData"
            size="medium"
            border
            max-height="350"
            style="width: 100%">
                <el-table-column
                  fixed
                  type="index"
                  label="序号"
                  width="200">
                </el-table-column>
                <el-table-column
                fixed
                prop="vaccineName"
                label="疫苗名称"
                width="200">
                </el-table-column>
                <el-table-column
                prop="month"
                label="接种时间"
                min-width="300">
                </el-table-column>
                <el-table-column
                prop="totalDose"
                label="总剂数"
                min-width="200">
                </el-table-column>
                <el-table-column
                prop="dose"
                label="	当前剂数"
                min-width="200">
                </el-table-column>
                <el-table-column
                label=" 费用"
                min-width="200">
                <template slot-scope="scope">
                        <!-- 是否收费 1-免费(一类) 2-自费(二类) -->
                        {{
                            {
                                1: '免费(一类)',
                                2: '自费(二类)',
                            }[scope.row.isCharge]
                        }}
                    </template>
                </el-table-column>
                <el-table-column
                prop="abnormal"
                label="操作"
                min-width="200">
                <template slot-scope="scope">
                    <el-button type="primary"  @click="changeVaccine(scope.row.id)">编辑</el-button>
                    <el-button type="primary"  @click='delVaccine(scope.row.id)'>删除</el-button>
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
            <el-dialog
                title="疫苗编辑"
                :append-to-body="true"
                :visible.sync="modelVaccineShow"
                width="90%">
                <vaccine-detailes
                :checkvaccine-id="checkvaccineId"
                v-if="modelVaccineShow"
                @close-form="modelVaccineShow = false"
                @finish-action="getVaccineList"
                ></vaccine-detailes>
            </el-dialog>
        </div>
    </div>
</template>

<script>

const VaccineDetailes = () => import('./VaccineDetailes.vue');

import {
    getUserVaccineListAPI,
    delVaccineAPI
} from '@/api/childVaccineAPI.js';


export default {
    name:'',
    data()   {
        return   {
            form: {
                filter: '',
                limit: 10,
                page: 1,
            },
            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            totalCount: 0, // 总条数
            vaccineId:null, // 疫苗id
            modelVaccineShow:false,//疫苗编辑弹窗显示
            checkvaccineId:null,
        };
    },
    components: {
        VaccineDetailes
    },
    methods: {
        /**
         * 获取疫苗列表
         */
        getVaccineList() {
            const params = {...this.form};

            this.tableLoading = true;
            getUserVaccineListAPI(params)
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
         * 切换表格每页大小，请求新页面账号列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getVaccineList();
        },
        /**
         * 翻页，请求新页面账号列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getVaccineList();
        },
        /**
         * 修改疫苗
         * @param {Number} vaccineId 疫苗id
         */
        changeVaccine(vaccineId){
            this.checkvaccineId = vaccineId;
            this.modelVaccineShow = true;
        },
        /**
         * 删除疫苗
         * @param {Number} vaccineId 疫苗id
         */
        delVaccine(vaccineId){
            this.$confirm('是否删除该条疫苗信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    delVaccineAPI(vaccineId)
                    .then(res => {
                        if(res.data.code === 1000){
                            this.$message({
                                type: 'success',
                                message: '已删除该条疫苗',
                            });
                            this.getVaccineList()
                        }else{
                            this.$message.error(res.data.msg)
                        }
                            
                    })
                    .catch(err => {
                    })
                })
        }

    },
    created() {
        this.getVaccineList();
    }
};
</script>

<style scoped lang="less">
.wrapper--doctor-user {
    padding: 20px;
}
.el-input-search {
    width: 300px;
    margin-right: 20px;
}
.table {
    margin: 30px 0;
}
.doc-name-text {
    color: #606266;
    &:hover {
        color: #409EFF;
    }
}
</style>