<!-- 审核管理：医院审核管理 -->
<template>
    <div class="wrapper--review-manage">
        <h1 class="fz24 mb20">
            医院审核管理
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
                prop="name"
                label="医院名称"
                width="300">
                </el-table-column>

                <el-table-column
                prop="hospitalClass"
                label="级别"
                min-width="300">
                </el-table-column>

                <el-table-column
                prop="address"
                label="详细地址"
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
                        <el-button type="success" size="mini" @click="handleExamine(scope.row, 'pass')">通过</el-button>
                        <el-button type="danger" size="mini" @click="handleExamine(scope.row, 'unpass')">不通过</el-button>
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

        <!--通过弹窗 -->
        <el-dialog
        title="通过"
        :append-to-body="true"
        :visible.sync="modelPassed"
        width="500px">
            <examine-passed-form
            :msg="rowSelected"
            :window-model="modelPassed"
            @finish-action="getHospitalExamineList"
            @close-form="modelPassed = false">                
            </examine-passed-form>
        </el-dialog>
        
        <!--不通过弹窗 -->
        <el-dialog
        title="提示"
        :append-to-body="true"
        :visible.sync="modelUnpassed"
        width="400px">
            <div class="form-unpass">
                <p class="color-red">确认不通过审核？</p>
                <el-checkbox v-model="msgSend" :true-label="1" :false-label="2">发送短信</el-checkbox>
                <div class="wrapper-examine-option">
                    <el-button type="primary" @click="submitExamineDoctor" v-loading="loadingUnpassed">确认</el-button>
                    <el-button @click="closeUnpassedForm">取消</el-button>
                </div>
            </div>
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
const ExaminePassedForm = () => import('./ExaminePassedForm.vue');

import {
    getHospitalExamineListAPI,
    refuseHospitalExamineAPI,
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
            
            loadingUnpassed: false, // 不通过审核loading
            msgSend: 1, // 是否发送信息
            imgEnlargeURL: '', // 放大图片的url
            rowSelected: {}, // 操作选中行

            modelPassed: false, // 通过弹窗
            modelUnpassed: false, // 不通过弹窗
            modelEnlargeImg: false, // 放大图片弹窗
        };
    },
    components: {
        ExaminePassedForm,
    },
    methods: {
        /**
         * 获取医院待审核列表
         */
        getHospitalExamineList() {
            this.tableLoading = true;

            getHospitalExamineListAPI({
                ...this.form,
                filter: '',
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
            this.getHospitalExamineList();
        },
        /**
         * 翻页，请求新页面黑名单列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getHospitalExamineList();
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
         * 操作按钮点击事件
         * @param {Object} row 当前行信息
         * @param {String} action 操作名：'pass'-通过，'unpass'-不通过
         */
        handleExamine(row, action) {
            this.rowSelected = row;

            switch(action) {
                case 'pass':
                    this.modelPassed = true;
                    break;
                case 'unpass':
                    this.modelUnpassed = true;
                    break;
                default:
                    break;
            }
        },
        /**
         * 提交不通过审核提交
         */
        submitExamineDoctor() {
            let args = {
                name: this.rowSelected.name,
                hospitalClass: this.rowSelected.hospitalClass,
                isSendSMS: this.msgSend
            };

            this.loadingUnpassed = true;
            refuseHospitalExamineAPI(args)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.closeUnpassedForm();
                        this.getHospitalExamineList();
                    } else {
                        status = 'error'
                    }
                    this.$message({
                        type: status,
                        msg: status === 'success' ? '操作成功！' : response.msg,
                    });
                    this.loadingUnpassed = false;
                })
                .catch(err => {
                    this.loadingUnpassed = false;
                });
        },
        /**
         * 关闭不通过审核弹窗
         */
        closeUnpassedForm() {
            this.modelUnpassed = false;
            this.msgSend = 1;
        }
    },
    mounted() {
        this.getHospitalExamineList();
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