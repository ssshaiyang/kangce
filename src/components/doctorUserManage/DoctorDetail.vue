<!-- 医生详细信息 -->
<template>
    <div class="wrapper--doctor-detail" v-loading="wholeLoding">
        <section class="options">
            <el-button type="primary" @click="modelAddBlackShow = true">拉入黑名单</el-button>
            <el-button type="primary" @click="freezeAction(doctorDetail.status)">{{doctorDetail.status !== 3 ? '冻结' : '解冻'}}用户</el-button>
            <el-button type="primary" @click="modelDepRankShow = true">科室排序权重调整</el-button>
            <el-button type="primary" @click="modelEditMsgShow = true">修改信息</el-button>
        </section>
        
        <section class="base-msg">
            <div class="base-msg__doctor-person">
                <el-row :gutter="10">
                    <el-col :span="6">
                        姓名：{{doctorDetail.docName}}
                    </el-col>
                    <el-col :span="6">
                        用户名：{{doctorDetail.nickname}}
                    </el-col>
                    <el-col :span="12">
                        手机号：{{doctorDetail.phone}}
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="6">
                        医院：{{doctorDetail.hospitalName || '-'}}
                    </el-col>
                    <el-col :span="6">
                        科室：{{doctorDetail.departmentName}}
                    </el-col>
                    <el-col :span="12">
                        职称：{{doctorDetail.positionalTitle}}
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        用户头像：
                        <img v-if="doctorDetail.vice_avatar" :src="doctorDetail.vice_avatar" height="140" width="140" />
                        <img v-else src="@/assets/images/doc_default_avatar.jpg" height="140" width="140" />                      
                    </el-col>
                    <el-col :span="12">
                        医生名片头像：
                        <img :src="doctorDetail.avatar" height="140" width="140" />
                    </el-col>
                </el-row>
            </div>
        </section>

        <!-- 社区数据 -->
        <el-row class="detail-section">
            <el-col class="detail-section__title" :span="2">
                社区数据
            </el-col>
            <el-col :span="22">
                <table class="data-table-show">
                    <tr>
                        <th>发帖量</th>
                        <th>评论量</th>
                        <th>回复量</th>
                        <th>操作</th>
                    </tr>
                    <tr>
                        <td>{{doctorDetail.postingNum}}</td>
                        <td>{{doctorDetail.commentNum}}</td>
                        <td>{{doctorDetail.replyNum}}</td>
                        <td>
                            <el-button type="primary" size="mini" @click="jumpToDynamicManage">查看</el-button>
                        </td>
                    </tr>
                </table>
            </el-col>
        </el-row>

        <!-- 接诊数据 -->
        <el-row class="detail-section">
            <el-col class="detail-section__title" :span="2">
                接诊数据
            </el-col>
            <el-col :span="22">
                <table class="data-table-show">
                    <tr>
                        <th>本月工作时长</th>
                        <th>剩余工作时长</th>
                        <th>当前评分</th>
                    </tr>
                    <tr>
                        <td>{{doctorDetail.workHour || 0}}&ensp;h</td>
                        <td>{{doctorDetail.surplusHour || 0}}&ensp;h</td>
                        <td>{{doctorDetail.evaluationScore}}</td>
                    </tr>
                </table>
            </el-col>
        </el-row>

        <!-- 问诊记录 -->
        <section class="detail-section">
            <el-row>
                <el-col class="detail-section__title" :span="2">
                    接诊记录
                </el-col>
                <el-col :span="22">
                    <el-table
                    :data="inquisitionList"
                    border
                    :show-header="false"
                    style="width: 100%"
                    :max-height="300">

                        <el-table-column
                        prop="content">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" class="doc-name-text" @click="showContentDetail(scope.row.inquisitionId)">
                                    {{scope.row.content || '--'}}
                                </el-button>
                            </template>
                        </el-table-column>

                        <el-table-column
                        prop="createTime">
                        </el-table-column>

                        <el-table-column
                        prop="score">
                            <template slot-scope="scope">
                                {{scope.row.score === null ? '暂无评分' : scope.row.score}}
                            </template>
                        </el-table-column>

                        <el-table-column
                        prop="abnormal">
                        </el-table-column>

                    </el-table>
                </el-col>
            </el-row>
        </section>

        <!-- 问诊详情弹窗 -->
        <el-dialog
        title="问诊详情"
        :append-to-body="true"
        :visible.sync="modelInquisitionShow"
        height="100%"
        width="70%">
            <inquisition-detail
            v-if="modelInquisitionShow"
            :doctor-detail="doctorDetail"
            :inquisition-id="inquisitionId"
            @finish-action="finishOptions"></inquisition-detail>
        </el-dialog>

        <!-- 拉入黑名单弹窗 -->
        <el-dialog
        title="加入黑名单"
        :append-to-body="true"
        :visible.sync="modelAddBlackShow"
        width="500px">
            <black-list-add-form
            v-if="modelAddBlackShow"
            :model-close="modelAddBlackShow" 
            :doctor-id="doctorId" 
            @close-form="modelAddBlackShow = false" 
            @finish-action="finishOptions"></black-list-add-form>
        </el-dialog>

        <!-- 冻结解冻弹窗 -->
        <el-dialog
        title="冻结用户"
        :append-to-body="true"
        :visible.sync="modelFrozenShow"
        width="500px">
            <frozen-form
            :model-close="modelFrozenShow" 
            :doctor-id="doctorId" 
            @close-form="modelFrozenShow = false" 
            @finish-action="finishOptions"></frozen-form>
        </el-dialog>

        <!-- 科室排序权重调整弹窗 -->
        <el-dialog
        title="科室排序权重调整"
        :append-to-body="true"
        :visible.sync="modelDepRankShow"
        width="500px">
            <dep-rank-form
            :doctor-id="doctorId" 
            :dep-rank="doctorDetail.doctorDepRank"
            :model-status="modelDepRankShow"
            @close-form="modelDepRankShow = false" 
            @finish-action="finishOptions"></dep-rank-form>
        </el-dialog>

        <!-- 修改信息弹窗 -->
        <el-dialog
        title="修改信息"
        :append-to-body="true"
        :visible.sync="modelEditMsgShow"
        width="500px">
            <edit-msg-doc-form
            :doctor-id="doctorId" 
            :doctor-detail="doctorDetail"
            :model-status="modelEditMsgShow"
            @close-form="modelEditMsgShow = false" 
            @finish-action="finishOptions"></edit-msg-doc-form>
        </el-dialog>
    </div>
</template>

<script>
const InquisitionDetail = () => import('./InquisitionDetail.vue');
const BlackListAddForm = () => import('./formDocDetail/BlackListAddForm.vue');
const FrozenForm = () => import('./formDocDetail/FrozenForm.vue');
const DepRankForm = () => import('./formDocDetail/DepRankForm.vue');
const EditMsgDocForm = () => import('./formDocDetail/EditMsgDocForm.vue');

import {
    getDoctorDetailAPI,
    getInquisitionListAPI,
    unfreezeDoctorAPI,
} from '@/api/userManageAPI.js';

export default {
    name:'DoctorDetail',
    data() {
        return   {
            doctorDetail: {},
            wholeLoding: false, // 获取页面信息时 loading
            inquisitionList: [], // 问诊记录列表
            inquisitionId: '', // 问诊记录 ID

            modelInquisitionShow: false, // 问诊详情弹窗
            modelAddBlackShow: false, // 加入黑名单弹窗
            modelFrozenShow: false, // 冻结弹窗
            modelDepRankShow: false, // 科室排序权重调整弹窗
            modelEditMsgShow: false, // 修改信息弹窗
        };
    },
    components: {
        BlackListAddForm,
        FrozenForm,
        DepRankForm,
        EditMsgDocForm,
        InquisitionDetail,
    },
    props: {
        doctorId: {
            required: true,
        },
        // 获取医生列表
        getDoctorList: {
            required: true,
            type: Function,
        },
    },
    watch: {
        doctorId(newValue) {
            this.initPage(newValue);
        }
    },
    methods: {
        /**
         * 初始化页面
         * @param {Number} doctorId 医生ID
         */
        initPage(doctorId) {
            this.getDoctorDetail(doctorId);
            this.getInquisitionList(doctorId);
        },
        /**
         * 获取医生详情
         * @param {Number} doctorId 医生ID
         */
        getDoctorDetail(doctorId) {
            this.wholeLoding = true;
            getDoctorDetailAPI({
                docId: doctorId
            })
                .then(res => {
                    this.$set(this.$data, 'doctorDetail', res.data.data);
                    this.wholeLoding = false;
                })
                .catch(err => {
                    this.wholeLoding = false;
                })
        },
        /**
         * 点击查看问诊详情
         * @param {Number} inquisitionId 问诊记录 ID
         */
        showContentDetail(inquisitionId) {
            this.modelInquisitionShow = true;
            this.inquisitionId = inquisitionId;
        },
        /**
         * 获取问诊记录列表
         * @param {Number} doctorId 医生ID
         */
        getInquisitionList(doctorId) {
            this.wholeLoding = true;
            getInquisitionListAPI({
                docId: doctorId
            })
                .then(res => {
                    this.inquisitionList = res.data.data;
                    this.wholeLoding = false;
                })
                .catch(err => {
                    this.wholeLoding = false;
                })
        },
        /**
         * 点击冻结或解冻按钮
         */
        freezeAction(status) {
            if (status === 3) {
                this.$confirm('确定要解冻该账户么？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        unfreezeDoctorAPI({
                            docId: this.doctorId,
                            flag: 2,
                        })
                            .then(res => {
                                const data = res.data;
                                
                                if (data.code === 1000) {
                                    this.$message({
                                        type: 'success',
                                        message: '解冻成功',
                                    });
                                    this.finishOptions();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: data.msg,
                                    });
                                }
                            })
                    })
                    .catch(err => {});
            } else {
                this.modelFrozenShow = true;
                
            }
        },
        /**
         * 完成详情内操作后的刷新详情和医生列表
         */
        finishOptions() {
            this.getDoctorList();
            this.initPage(this.doctorId);
        },
        /**
         * 跳转动态管理
         */
        jumpToDynamicManage() {
            this.$store.commit('menu/changeActiveItem', 43)
            this.$emit('close-model');
        },
    },
    mounted() {
        this.initPage(this.doctorId);
    },
};
</script>

<style scoped lang="less">
.wrapper--doctor-detail {
    max-height: 600px;
    overflow: auto;

    & > .detail-section {
        margin: 30px auto 0;

        .detail-section__title {
            margin-bottom: 30px;
            font-size: 16px;
            font-weight: bold;
        }
    }
}
.base-msg {
    line-height: 2;
    overflow: hidden;
}
.base-msg__doctor-person {
    font-size: 16px;
    font-weight: bold;

    img {
        vertical-align: text-top;
        border-radius: 100px;
    }
    .doctor-person__msg {
        margin-left: 26px;
    }
}
.base-msg__doctor-work {
    float: right;
}
.data-table-show {
    border-collapse: collapse;

    td, th {
        padding: 8px 20px;
        border: 1px solid #ebeef5;
    }
}
.options {
    margin-bottom: 30px;
    padding-bottom: 12px;
    text-align: right;
    border-bottom: 1px solid #e8e8e8;
}
</style>