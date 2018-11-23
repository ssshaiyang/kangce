<!-- 首页 -->
<template>
    <div class="wrapper-index">
        <div class="home-overview">
            <div class="sum-count" @click="showDetail('doctor')">
                <h3>
                    医生注册总人数
                </h3>
                <p>
                    {{doctorNum}}
                </p>
            </div>
            <div class="sum-count">
                <h3>
                    平台总问诊数
                </h3>
                <p>
                    {{inquisitionNum}}
                </p>
            </div>
            <div class="sum-count" @click="showDetail('pacient')">
                <h3>
                    用户注册总人数
                </h3>
                <p>
                    {{patientNum}}
                </p>
            </div> 
        </div>

        <!-- 详情 -->
        <div class="detail-msg" v-show="detailName">
            <doctor-detail @back-overview="showDetail" v-if="detailName === 'doctor'"></doctor-detail>
            <pacient-detail @back-overview="showDetail" v-if="detailName === 'pacient'"></pacient-detail>
        </div>
    </div>
</template>

<script>
const DoctorDetail = () => import('./DoctorDetail.vue');
const PacientDetail = () => import('./PacientDetail.vue');

import {
    getPeopleCountAPI,
} from '@/api/homeAPI.js';

export default {
    name: '',
    data() {
        return {
            doctorNum: '',
            inquisitionNum: '',
            patientNum: '',
            detailName: '',
        };
    },
    components: {
        DoctorDetail,
        PacientDetail,
    },
    methods: {
        /**
         * 获取首页人数数据
         */
        getPeopleCount() {
            getPeopleCountAPI()
                .then(res => {
                    const dataCount = res.data.data;

                    this.doctorNum = dataCount.doctorNum;
                    this.inquisitionNum = dataCount.inquisitionNum;
                    this.patientNum = dataCount.patientNum;
                });
        },
        /**
         * 展示详情
         * @param {String} detailName 要展示的详情模块名称，'doctor':医生详情，'pacient':患者详情，'':返回首页
         */
        showDetail(detailName) {
            this.detailName = detailName;
        },
    },
    created() {
        this.getPeopleCount();
    },
}
</script>

<style scoped="scoped" lang="less">
.wrapper-index > *{
    padding: 20px 10px;
}
.home-overview {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
} 
.sum-count {
    width: 200px;
    height: 200px;
    line-height: 2;
    padding: 60px 0px;
    color: #fff;
    text-align: center;
    background: #409EFF;
    border-radius: 100px;
    &:not(:nth-child(2)) {
        cursor: pointer;
    }

    p {
        font-size: 20px;
    }
}
.detail-msg {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background: #fff;
}
</style>