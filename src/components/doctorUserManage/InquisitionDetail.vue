<!-- 问诊详情 -->
<template>
    <div class="wrapper--inquisition-detail" v-loading="loading">
        <section class="base-msg">
            <div class="base-msg__doctor-person">
                <img v-if="doctorDetail.avatar" :src="doctorDetail.avatar" height="140" width="140" />
                <img v-else src="@/assets/images/doc_default_avatar.jpg" height="140" width="140" /> 
                <div class="doctor-person__msg">
                    <h2>
                        <span class="mr10">{{doctorDetail.docName}}</span>
                        <span>{{doctorDetail.positionalTitle}}</span>
                    </h2>
                    <h3>
                        {{doctorDetail.hospitalName}}
                    </h3>
                    <h3>
                        联系电话：{{doctorDetail.phone}}
                    </h3>
                </div>
            </div>
            <div class="base-msg__doctor-work">
                <h2>
                    当月工作时间：{{doctorDetail.workHour}}&ensp;小时
                </h2>
                <h3>
                    （还需完成&ensp;{{doctorDetail.surplusHour}}&ensp;小时）
                </h3>
                <h2>
                    当前获得评分：{{doctorDetail.evaluationScore}}&ensp;分
                </h2>
            </div>
        </section>

        <section class="inquisition-content">
            <div class="action">
                <div class="description">
                    <span>得分：{{Object.prototype.toString.call(inquisitionDetail.commentInfo) === '[object Object]' ? inquisitionDetail.commentInfo.score : '-'}}</span>
                    <p>评价：{{Object.prototype.toString.call(inquisitionDetail.commentInfo) === '[object Object]' ? inquisitionDetail.commentInfo.comment : '-'}}</p>
                    <p>异常原因：{{inquisitionDetail.abnormal_reason}}</p>
                </div>
                <el-button type="primary" @click="removeAbnormal(inquisitionDetail)">消除异常</el-button>
                <el-button type="primary" @click="modelSendMsgShow = true">发送 APP 消息</el-button>
            </div>
            <div class="inquisition-list">
                <div class="inquisition-content">
                    <div class="inquisition-content__detail" v-for="(item, index) in inquisitionDetail.msgList" :key="`${index}-${item.inquisitionId}`">
                        <div class="pacient-q">
                            <h4>第 {{index + 1}} 次提问（{{item.askTime}}）</h4>
                            <p>{{item.content}}</p>
                            <img 
                            width="100" 
                            height="100" 
                            v-for="(imgItem, index) in item.imgPic" 
                            :key="index" 
                            :src="imgItem" 
                            @click="enlargeImg(imgItem)"/>
                        </div>
                        <div class="doctor-a">
                            <h4>医生回复</h4>
                            <div v-if="item.doctorAnswer.length > 0" class="doctor-a__content" v-for="(docItem, docIndex) in item.doctorAnswer" :key="docIndex">
                                <e>{{docItem.answerTime}}</e>
                                <p>{{docItem.answerContent}}</p>
                            </div>
                            <div else>
                                暂无回复
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 发送 APP 消息弹窗 -->
        <el-dialog
        title="发送 APP 消息"
        :append-to-body="true"
        :visible.sync="modelSendMsgShow"
        width="500px">
            <app-msg-send-form
            v-if="modelSendMsgShow"
            :doctor-id="doctorDetail.docId"
            :inquisition-id="inquisitionId"
            @close-form="modelSendMsgShow = false"
            ></app-msg-send-form>
        </el-dialog>
        
        <!-- 图片放大弹窗 -->
        <el-dialog
        title="问诊图片"
        :append-to-body="true"
        :visible.sync="modelImgShow"
        width="500px">
            <div class="img-amplification">
                <img :src="imgAmplification"/>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const AppMsgSendForm = () => import('./AppMsgSendForm.vue');

import {
    getInquisitionDetailAPI,
    removeAbnormalAPI,
} from '@/api/userManageAPI.js';

const STATUS_MAP = {
    1: '正常',
    2: '删除',
    3: '冻结',
    4: '黑名单',
};

export default {
    name:'DoctorDetail',
    data() {
        return   {
            doctorStatus: STATUS_MAP[this.doctorDetail.status],
            inquisitionDetail: [],
            loading: false,
            imgAmplification: '', // 放大图片 src

            modelImgShow: false, // 图片弹窗
            modelSendMsgShow: false, // 发送 APP 消息弹窗
        }
    },
    components: {
        AppMsgSendForm,
    },
    props: {
        // 医生详情
        doctorDetail: {
            required: true,
            type: Object,
        },
        // 问诊记录 ID
        inquisitionId: {
            required: true,
        },
    },
    watch: {
        
    },
    methods: {
        /**
         * 问诊记录详情
         */
        getInquisitionDetail() {
            this.loading = true;
            getInquisitionDetailAPI({
                inquisitionId: this.inquisitionId,
            })
                .then(res => {
                    this.loading = false;

                    this.inquisitionDetail = res.data.data;
                })
                .catch(err => {
                    this.loading = false;
                })
        },
        /**
         * 放大图片
         * @param {String} src 图片路径
         */
        enlargeImg(src) {
            this.imgAmplification = src;
            this.modelImgShow = true;
        },
        /**
         * 消除异常
         * @param {Object} inquisitionDetail 问诊记录信息
         */
        removeAbnormal(inquisitionDetail) {
            if (!inquisitionDetail.abnormal_id || inquisitionDetail.abnormal_reason === '正常') {
                this.$message({
                    message: '没有异常，无需消除'
                });
                return;
            }
            
            this.$confirm('确定要消除异常么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    removeAbnormalAPI({
                        abnormal_id: inquisitionDetail.abnormal_id
                    })
                        .then(res => {
                            const data = res.data;
                            
                            if (data.code === 1000) {
                                this.$message({
                                    type: 'success',
                                    message: '消除异常成功',
                                });
                                this.getInquisitionDetail();
                                this.$emit('finish-action');
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: data.msg,
                                });
                            }
                        })
                })
                .catch(err => {});
        },
    },
    mounted() {
        this.getInquisitionDetail();
    },
};
</script>

<style scoped lang="less">
.wrapper--inquisition-detail {
    max-height: 600px;
    overflow: hidden;
}
.base-msg {
    line-height: 2;
    overflow: hidden;
}
.base-msg__doctor-person {
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;

    & > img {
        float: left;
        border-radius: 100px;
    }
    .doctor-person__msg {
        margin-left: 26px;
    }
}
.base-msg__doctor-work {
    float: right;
}
.inquisition-content {
    margin-top: 30px;
    overflow: hidden;

    .action {
        width: 200px;
        padding: 0 0 0 20px;
        float: right;

        & > button {
            margin: 10px 0 10px;
        }
        .description {
            margin-bottom: 20px;
            font-size: 16px;
        }
    }
    .inquisition-list {
        padding-right: 40px; 
        max-height: 600px;
        overflow: auto;

        .inquisition-content {
            width: 100%;
        }
    }
}
.inquisition-content__detail {
    line-height: 1.8;
    margin-bottom: 16px;
    padding: 10px 20px;
    overflow: hidden;
    border: 1px solid #dcdfe6;
    border-radius: 8px;

    .pacient-q {
        width: 50%;
        margin-right: 20px;
        float: left;

        img {
            margin: 10px 10px 0 0;
            cursor: pointer;
        }
    }
}
.img-amplification {
    width: 100%;
    max-height: 500px;
    text-align: center;
    overflow: auto;

    img {
        width: 100%;
    }
}
</style>