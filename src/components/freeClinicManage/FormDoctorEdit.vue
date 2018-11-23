<!-- 编辑义诊医生 -->
<template>
    <div class="wrapper--free-clinic-form" v-loading="loading">
        <div class="doctor-msg">
            <div class="doc-base-msg fl-l">
                <img v-if="docMsg.avatar" :src="docMsg.avatar" width="140" height="140" />
                <img v-else src="@/assets/images/doc_default_avatar.jpg" width="140" height="140" />
                <div class="doc-base-msg__content">
                    <p>
                        <span class="mr30">{{docMsg.docName}}</span>
                        <span>{{docMsg.positionalTitle}}</span>
                    </p>
                    <p>{{docMsg.departmentName}}</p>
                    <p>{{docMsg.hospitalName}}</p>
                </div>
            </div>
            <div class="fl-r">
                <p>本月应工作：{{docMsg.workHour + docMsg.surplusHour || 0}} 小时</p>
                <p>本月已工作：{{docMsg.workHour || 0}} 小时</p>
                <p>当前平均分：{{docMsg.evaluationScore || 0}}</p>
            </div>
        </div>
        <div class="abnormal-list">
            <el-table
            :data="abnormalList"
            border
            style="width: 100%"
            max-height="500"
            v-loading="loadingTable"
            >
                <el-table-column
                prop="abnormalTime"
                label="异常时间"
                ></el-table-column>

                <el-table-column
                prop="abnormalReason"
                label="异常原因"
                ></el-table-column>
            </el-table>
            <el-pagination
            class="mt20"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="limit"
            layout="prev, pager, next, jumper"
            :total="totalCount">
            </el-pagination>
        </div>
        <div class="action-wrapper" v-if="btnRemoveShow">
            <el-button type="primary" @click="removeOutFreeClinic">移出义诊</el-button>
        </div>
    </div>
</template>

<script>
import {
    getDoctorDetailAPI,
} from '@/api/userManageAPI';
import {
    getFCAbnormalListAPI,
    removeDocFreeClinicAPI,
} from '@/api/freeClinicManageAPI';

export default {
    name:'',
    data() {
        return {
            docMsg: {},
            abnormalList: [], // 异常列表
            page: 1,
            limit: 5,
            totalCount: 0,
            btnRemoveShow: true, // 是否显示移除按钮
            
            loading: false,
            loadingTable: false,
        };
    },
    props: {
        freeClinicMsg: {
            required: true,
        },
        docSelected: {
            required: true,
        }
    },
    methods: {
        /**
         * 初始化页面
         */
        initPage() {
            this.loading = true;
            Promise.all([this.getDoctorDetail(), this.getFCAbnormalList()])
                .then(res => {
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        /**
         * 获取医生详细信息
         */
        getDoctorDetail() {
            return getDoctorDetailAPI({
                docId: this.docSelected.docId,
            })
                .then(response => {
                    const res = response.data;

                   this.docMsg = res.data; 
                });
        },
        /**
         * 获取医生异常列表
         */
        getFCAbnormalList() {
            this.loadingTable = true;

            return getFCAbnormalListAPI({
                page: this.page,
                limit: this.limit,
            }, this.docSelected.docId)
                .then(response => {
                    const res = response.data;

                    this.abnormalList = res.data.data;
                    this.totalCount = res.data.totalCount;
                    this.loadingTable = false;
                })
                .catch(err => {
                    this.loadingTable = false;
                });
        },
        /**
         * 异常列表翻页
         */
        handleCurrentChange(currentPage) {
            this.page = currentPage;
            this.getFCAbnormalList();
        },
        /**
         * 移出义诊
         */
        removeOutFreeClinic() {
            this.$confirm(`确认将 <b>${this.docSelected.docName}</b> 移出 <b>${this.freeClinicMsg.date}</b> 的义诊？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true,
            })
                .then(() => {
                    this.loading = true;
                    removeDocFreeClinicAPI({
                        id: this.docSelected.id,
                    })
                        .then(response => {
                            const res = response.data;
                            const success = res.code === 1000;

                            if (success) {
                                this.$emit('refresh-list');
                                this.$emit('close-model');
                            }
                            this.$message({
                                type: success ? 'success' : 'error',
                                message: success ? '移除成功！' : res.msg,
                            });
                            this.loading = false;
                        })
                        .catch(err => {
                            this.loading = false;
                        });
                })
                .catch(() => {});
        },
    },
    mounted() {
        this.initPage();
        this.btnRemoveShow = Date.parse(this.freeClinicMsg.date) - Date.parse((new Date()).toDateString()) > 0;
    },
};
</script>

<style scoped lang="less">
.wrapper--free-clinic-form {
    overflow: hidden;
}
.abnormal-list {
    margin-top: 30px;
}
.doctor-msg {
    line-height: 2.4;
    font-size: 16px;
    overflow: hidden;
}
.doc-base-msg {
    img {
        margin-right: 40px;
        float: left;
        border-radius: 100px;
    }
    .doc-base-msg__content {
        overflow: hidden;
    }
}
.action-wrapper {
    margin-top: 20px;
    text-align: center;
}
</style>