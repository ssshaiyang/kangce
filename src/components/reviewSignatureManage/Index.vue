<!-- 审核管理：医生签名审核管理 -->
<template>
    <div class="wrapper--review-manage">
        <h1 class="fz24 mb20">
            签名审核管理
        </h1>
        <div class="table" v-loading="tableLoading">
            <el-table
            :data="tableData"
            size="medium "
            border
            :max-height="500"
            style="width: 100%">
                <el-table-column
                fixed
                prop="docName"
                label="姓名"
                width="200">
                </el-table-column>

                <el-table-column
                prop="hospitalName"
                label="医院"
                min-width="300">
                </el-table-column>

                <el-table-column
                prop="phone"
                label="联系电话"
                min-width="200">
                </el-table-column>

                <el-table-column
                prop="department"
                label="科室"
                min-width="200">
                </el-table-column>

                <el-table-column
                prop="positionalTitle"
                label="职称"
                min-width="200">
                </el-table-column>

                <el-table-column
                prop="signatureImg"
                label="签名图片"
                min-width="200">
                    <template slot-scope="scope">
                        <img v-if="scope.row.signatureImg" class="img-upload" :src="scope.row.signatureImg" height="20" width="50" @click="hangdleEnlargeImg(scope.row.signatureImg)" />
                        <p v-else>
                            -
                        </p>
                    </template>
                </el-table-column>

                <el-table-column
                fixed="right"
                label="是否通过"
                width="200">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" @click="handleOptions(scope.row, 'pass')">通过</el-button>
                        <el-button type="danger" size="mini" @click="handleOptions(scope.row, 'refuse')">不通过</el-button>
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

        <!-- 放大图片弹窗 -->
        <el-dialog
        title="查看"
        :append-to-body="true"
        :visible.sync="modelEnlargeImg"
        width="600px">
            <div class="img-enlarge-wrapper">
                <img :src="imgEnlargeURL" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getDoctorExamineSignListAPI,
    passDoctorSignExamineAPI,
    refuseDoctorSignExamineAPI,
} from '@/api/reviewManageAPI.js';

export default {
    name:'ReviewDoctorManage',
    data() {
        return {
            form: {
                limit: 10,
                page: 1,
            },
            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            totalCount: 0, // 总条数
            
            imgEnlargeURL: '', // 放大图片的url
            rowSelected: {}, // 操作选中行

            modelEnlargeImg: false, // 放大图片弹窗
        };
    },
    methods: {
        /**
         * 获取医院待审核列表
         */
        getDoctorExamineSignList() {
            this.tableLoading = true;

            getDoctorExamineSignListAPI({
                ...this.form,
            })
                .then(res => {
                    const response = res.data; 

                    this.tableLoading = false;
                    if (response.code === 1000) {
                        this.tableData = response.data.data;
                        this.totalCount = response.data.totalCount;
                    } else {
                        console.log(response.msg);
                    }
                })
                .catch(err => {
                    this.tableLoading = false;
                })
        },
        /**
         * 切换表格每页大小，请求新页面黑名单列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getDoctorExamineSignList();
        },
        /**
         * 翻页，请求新页面黑名单列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getDoctorExamineSignList();
        },
        /**
         * 放大图片
         * @param {String} url 图片的 URL
         */
        hangdleEnlargeImg(url) {
            this.modelEnlargeImg = true;
            this.imgEnlargeURL = url;
        },
        /**
         * 操作
         * @param {Object} row 选中行信息
         * @param {String} action 操作名：pass-通过，refuse-不通过
         */
        handleOptions(row, action) {
            this.rowSelected = row;

            this.$confirm('是否确认执行该操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                switch(action) {
                    case 'pass':
                        this.passDoctorSignExamine();
                        break;
                    case 'refuse':
                        this.refuseDoctorSignExamine();
                        break;
                    default:
                        break;
                }
            }).catch(() => {
            });
        },
        /**
         * 审核通过
         */
        passDoctorSignExamine() {
            passDoctorSignExamineAPI({
                docId: this.rowSelected.docId,
            })
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getDoctorExamineSignList();
                    } else {
                        this.status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    });
                });
        },
        /**
         * 审核不通过
         */
        refuseDoctorSignExamine() {
            refuseDoctorSignExamineAPI({
                docId: this.rowSelected.docId,
            })
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getDoctorExamineSignList();
                    } else {
                        this.status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    });
                });
        },
    },
    mounted() {
        this.getDoctorExamineSignList();
    },
};
</script>

<style scoped lang="less">
.wrapper--review-manage {
    padding: 20px;
}
.img-upload {
    cursor: pointer;
    
    &:not(:first-child) {
        margin-left: 8px;
    }
}
.img-enlarge-wrapper {
    width: 100%;
    max-height: 500px;
    text-align: center;
    overflow: auto;

    img {
        width: 100%;
    }
}
.form-unpass {
    line-height: 2;
    text-align: center;

    .wrapper-examine-option {
        margin-top: 30px;
    }
}
</style>