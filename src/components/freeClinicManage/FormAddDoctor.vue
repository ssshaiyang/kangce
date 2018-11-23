<!-- 添加义诊 -->
<template>
    <div>
        <section class="filter">
            <el-form ref="form" label-width="90px" :model="form" inline>
                <el-form-item prop="docName" label="医生姓名">
                    <el-input v-model="form.docName"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="医生手机号">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item prop="docId" label="医生 Uid">
                    <el-input v-model="form.docId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="filtDoctorList" type="primary">查询</el-button>
                    <el-button @click="resetDoctorList">重置</el-button>
                </el-form-item>
            </el-form>
        </section>
        <section class="doctor-list mt30">
            <h3 class="mb30">查询结果：</h3>
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            :show-header="false"
            max-height="500"
            v-loading="loadingTable"
            >
                <el-table-column
                prop="docName"
                fixed
                min-width="100"
                ></el-table-column>

                <el-table-column
                prop="phone"
                min-width="100"
                ></el-table-column>

                <el-table-column
                prop="hospitalName"
                min-width="100"
                ></el-table-column>

                <el-table-column
                min-width="150"
                >
                    <template slot-scope="scope">
                        {{scope.row.firstLevelDepartmentName}}--{{scope.row.secondLevelDepartmentName}}
                    </template>
                </el-table-column>

                <el-table-column
                fixed="right"
                width="100"
                >
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="addDoctorToFreeClinic(scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            class="mt20"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="limit"
            layout="prev, pager, next, jumper"
            :total="totalCount">
            </el-pagination>
        </section>
    </div>
</template>

<script>
import {
    getFCDoctorListAPI,
    addDocFreeClinicAPI,
} from '@/api/freeClinicManageAPI';

export default {
    data() {
        return {
            form: {
                docName: '',
                phone: '',
                docId: '',
            },
            page: 1,
            limit: 10,
            totalCount: 0,
            listArgs: {},
            tableData: [],

            loadingTable: false,
        };
    },
    props: {
        freeClinicMsg: {
            required: true,
            type: Object,
        },
    },
    methods: {
        /**
         * 获取医生列表
         */
        getDoctorList() {
            const args = {...this.listArgs};

            args.page = this.page;
            args.limit = this.limit;
            this.loadingTable = true;
            getFCDoctorListAPI(args)
                .then(response => {
                    const res = response.data;

                    this.tableData = res.data.data;
                    this.totalCount = res.data.totalCount;
                    this.loadingTable = false;
                })
                .catch(err => {
                    this.loadingTable = false;
                });
        },
        /**
         * 查询列表
         */
        filtDoctorList() {
            this.page = 1;
            this.listArgs = {...this.form};
            this.getDoctorList();
        },
        /**
         * 重置列表
         */
        resetDoctorList() {
            this.$refs.form.resetFields();
            this.filtDoctorList();
        },
        /**
         * 翻页
         * @param {Number} currentPage 当前页
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getDoctorList();
        },
        /**
         * 添加医生义诊
         * @param {Object} row 要添加的医生的信息
         */
        addDoctorToFreeClinic(row) {
            this.$confirm(`确认添加 <b>${row.docName}</b> 到 <b>${this.freeClinicMsg.date}</b> 的义诊中吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true,
            })
                .then(() => {
                    addDocFreeClinicAPI({
                        // treatmentId: this.freeClinicMsg.id,
                        dId: row.docId,
                        date: this.freeClinicMsg.date,
                    })
                        .then(response => {
                            const res = response.data;
                            const success = res.code === 1000;

                            if (success) {
                                this.getDoctorList();
                                this.$emit('refresh-list');
                            }
                            this.$message({
                                type: success ? 'success' : 'error',
                                message: success ? '添加成功！' : res.msg,
                            });
                            this.loadingAdd = false;
                        })
                        .catch(err => {
                            this.loadingAdd = false;
                        });
                })
                .catch(() => {});
        },
    },
    mounted() {
        // this.filtDoctorList();
    },
};
</script>

<style scoped>

</style>