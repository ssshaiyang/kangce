<!-- 审核管理：医生审核管理 -->
<template>
    <div class="wrapper--review-manage">
        <div class="review-manage__header">
            <h1 class="fz24">
                医生身份审核管理
            </h1>
            <el-button class="import-list" type="primary" @click="modelBatchImport = true">批量导入已通过名单</el-button>
        </div>
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
                prop="imgArr"
                label="上传图片"
                min-width="200">
                    <template slot-scope="scope">
                        <img class="img-upload" v-for="item in scope.row.imgArr" :key="item" :src="item" height="20" width="50" @click="hangdleEnlargeImg(item)" />
                    </template>
                </el-table-column>

                <el-table-column
                fixed="right"
                label="是否通过"
                width="200">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" @click="examineDoctorManage(scope.row, 1)">通过</el-button>
                        <el-button type="danger" size="mini" @click="examineDoctorManage(scope.row, 2)">不通过</el-button>
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

        <!-- 审核操作弹窗 -->
        <el-dialog
        title="提示"
        :append-to-body="true"
        :visible.sync="modelExamine"
        width="400px">
            <div class="form-examine">
                <p class="msg-danger color-red">{{`确认${isPassExamine === 1 ? '通过' : '不通过'}该医生身份审核？`}}</p>
                <el-checkbox v-model="msgSend" :true-label="1" :false-label="2">发送短信</el-checkbox>
                <div class="wrapper-examine-option">
                    <el-button type="primary" @click="submitExamineDoctor" v-loading="loadingExamine">确认</el-button>
                    <el-button @click="closeExamineForm">取消</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 批量导入已通过名单弹窗 -->
        <el-dialog
        title="批量导入已通过名单"
        :append-to-body="true"
        :visible.sync="modelBatchImport"
        width="600px">
            <upload-pass-list-form
            v-if="modelBatchImport"
            @finish-add="getDoctorReviewMList"
            @close-form="modelBatchImport = false"></upload-pass-list-form>
        </el-dialog>

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
const UploadPassListForm = () => import('./UploadPassListForm.vue');

import {
    getDoctorReviewMListAPI,
    examineDoctorManageAPI,
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
            loadingExamine: false, // 审核loading
            rowSelected: {}, // 选中的操作行信息
            isPassExamine: '', // 审核操作是否通过，1-是，2-否
            msgSend: 1, // 审核操作是否发送短信

            modelExamine: false, // 审核操作弹窗
            modelBatchImport: false, // 批量导入已通过名单弹窗
            modelEnlargeImg: false, // 放大图片弹窗
        };
    },
    components: {
        UploadPassListForm,
    },
    methods: {
        /**
         * 获取医生待审核列表
         */
        getDoctorReviewMList() {
            this.tableLoading = true;

            getDoctorReviewMListAPI({
                ...this.form
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
         * 切换表格每页大小，请求新页面列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getDoctorReviewMList();
        },
        /**
         * 翻页，请求新页面列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getDoctorReviewMList();
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
         * 打开医生审核弹窗
         * @param {Object} row 选中医生的行信息
         * @param {String} isPass 是否通过:1-是，2-否
         */
        examineDoctorManage(row, isPass) {
            this.modelExamine = true;
            this.rowSelected = row;
            this.isPassExamine = isPass;
        },
        /**
         * 提交医生审核请求
         */
        submitExamineDoctor() {
            const args = {
                docId: this.rowSelected.docId,
                isPass: this.isPassExamine,
                isSendSMS: this.msgSend,
            };
            
            this.loadingExamine = true;
            examineDoctorManageAPI(args)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.closeExamineForm();
                        this.getDoctorReviewMList();
                    } else {
                        status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    });
                    this.loadingExamine = false;
                })
                .catch(err => {
                    this.loadingExamine = false;
                });
        },
        /**
         * 关闭审核弹窗
         */
        closeExamineForm() {
            this.modelExamine = false;
            this.msgSend = 1;
        }

    },
    mounted() {
        this.getDoctorReviewMList();
    },
};
</script>

<style scoped lang="less">
.wrapper--review-manage {
    padding: 20px;
}
.review-manage__header {
    margin-bottom: 20px;
    overflow: hidden;

    h1 {
        float: left;
    }
    .import-list {
        float: right;
    }
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
.form-examine {
    line-height: 2;
    font-size: 16px;
    text-align: center;
    // padding: 20px;

    .wrapper-examine-option {
        margin-top: 30px;
    }
}
</style>