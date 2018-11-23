<!-- 义诊管理 -->
<template>
    <div class="free-clinic-manage-index p20">
        <el-form ref="filterForm" :model="form" :rules="rules" class="filter" inline label-width="80px" >
            <el-form-item prop="startTime" label="时间">
                <el-date-picker
                :clearable="true"
                v-model="date"
                type="daterange"
                value-format="yyyy-MM-dd"
                @change="changeDate"
                :picker-options="pickerOption"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="医生姓名">
                <el-input v-model="form.docName"></el-input>
            </el-form-item>
            <el-form-item label="医生手机">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="医生 uid">
                <el-input v-model="form.docId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="filterTable(false)">查询</el-button>
            </el-form-item>
        </el-form>
        <section class="action-content mt30">
            <div class="header--action-content mb30">
                <span class="fl-l mr30">该时间（{{`${startTime} 至 ${endTime}`}}）义诊情况</span>
                <div class="fl-r">
                    <el-button type="primary" @click="tableType = 1" >下周情况</el-button>
                    <el-button type="primary" @click="modelSetting = true">义诊设置</el-button>
                </div>
            </div>
            <div class="table-wrapper--free-clinic" v-loading="loadingTable">
                <table class="body--action-content">
                    <tr style="position: relative;">
                        <th class="table-header-time">时间</th>
                        <th v-if="tableData.length === 0">日期</th>
                        <th v-else v-for="(item, index) in tableData" :key="index">
                            <p>{{weekText[(new Date(item.date)).getDay()]}}</p>
                            {{item.date}}
                        </th>
                    </tr>
                    <tr v-if="tableData && Object.keys(tableData).length > 0">
                        <td>参加名单</td>
                        <td class="table-name-list" v-for="(item, index) in tableData" :key="index">
                            <div class="name-list__wrapper">
                                <el-button type="primary" size="small" @click="doActionDoctor(item.date, 'add', {}, item)">添加</el-button>
                                <div class="docmsg-block" v-for="(itemDoc, index) in item.docList" :key="index" @click="doActionDoctor(item.date, 'edit', itemDoc, item)">
                                    <span class="mr20">{{itemDoc.docName}}</span>
                                    <span>{{itemDoc.positionalTitle}}</span>
                                    <div>{{itemDoc.hospitalName}}</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-else>
                        <td>参加名单</td>
                        <td :colspan="tableData.length">暂无数据</td>
                    </tr>
                </table>
            </div>
        </section>

        <!-- 义诊设置弹窗 -->
        <el-dialog
        title="义诊设置"
        :append-to-body="true"
        :visible.sync="modelSetting"
        width="600px">
            <form-setting v-if="modelSetting" @cancle-action="modelSetting = false"></form-setting>
        </el-dialog>

        <!-- 添加义诊弹窗 -->
        <el-dialog
        title="添加义诊"
        :append-to-body="true"
        :visible.sync="modelAdd"
        width="1150px">
            <form-add-doctor v-if="modelAdd" :free-clinic-msg="freeClinicSelected" @refresh-list="getWeeksList"></form-add-doctor>
        </el-dialog>

        <!-- 修改义诊弹窗 -->
        <el-dialog
        title="修改义诊"
        :append-to-body="true"
        :visible.sync="modelEdit"
        width="1150px">
            <form-doctor-edit v-if="modelEdit" :free-clinic-msg="freeClinicSelected" :doc-selected="doctorSeleted" @refresh-list="getWeeksList" @close-model="modelEdit = false"></form-doctor-edit>
        </el-dialog>
    </div>
</template>

<script>
const FormSetting = () => import('./FormSetting.vue');
const FormAddDoctor = () => import('./FormAddDoctor.vue');
const FormDoctorEdit = () => import('./FormDoctorEdit.vue');

import {
    getFreeClinicListAPI,
} from '@/api/freeClinicManageAPI';

import moment from 'moment';
import {
    WEEK_TEXT,
} from '@/public/constant';
import {
    computeWeek, 
    completeWeekList,
} from './freeCinicPublic.js';

export default {
    name:'',
    data() {
        return {
            listType: 'week', // 列表类型，week 为周，filter 为筛选，为周时如果返回数据不足七天需要补全
            date: [],
            rules: {
                startTime: [
                    {validator: (rule, value, callback) => {
                        const difference = moment(this.form.endTime).diff(moment(this.form.startTime)) + 8.64e7;

                        if (difference > 2.592e9) {
                            callback('时间跨度最多 30 天');
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'}
                ], 
            },
            pickerOption: {
                disabledDate(time) {
                    const today = Date.parse(moment(new Date()).format('YYYY-MM-DD'));

                    return time.getTime() > today;
                },
            },
            form: {
                docName: '',
                phone: '',
                docId: '',
                startTime: '',
                endTime: '',
            },
            startTime: '', // 用于显示的开始时间
            endTime: '', // 用于显示的结束时间
            listArgs: {}, // 请求列表参数
            tableType: 2, // 义诊情况类型，1 为非搜索情况，2 为下周情况
            tableData: [],
            weekText: WEEK_TEXT,

            freeClinicSelected: '', // 选中的义诊列信息
            doctorSeleted: {}, // 选中的医生

            modelSetting: false, // 义诊设置弹窗
            modelAdd: false,
            modelEdit: false,

            loadingTable: false, // loading 表格
        };
    },
    components: {
        FormSetting,
        FormAddDoctor,
        FormDoctorEdit,
    },
    watch: {
        tableType() {
            this.getWeeksList();
        },
    },
    methods: {
        /**
         * 获取列表
         */
        getWeeksList() {
            let args = {...this.listArgs};
            
            if (this.tableType === 2) {
                this.startTime = this.listArgs.startTime;
                this.endTime = this.listArgs.endTime;
            } else {
                const dateRange = computeWeek(new Date(Date.now() + 8.64e7 * 7));

                args = {
                    docName: '',
                    phone: '',
                    docId: '',
                    startTime: dateRange[0],
                    endTime: dateRange[1],
                }
                this.startTime = dateRange[0];
                this.endTime = dateRange[1];
                this.listType = 'week';
            }

            this.loadingTable = true;
            getFreeClinicListAPI(args)
                .then(response => {
                    const res = response.data;
                    
                    this.tableData = this.listType === 'week' ? completeWeekList(res.data, this.tableType) : res.data;
                    this.loadingTable = false;
                })
                .catch(err => {
                    this.loadingTable = false;
                });
        },
        /**
         * 查询
         * @param {Boolean} currentWeek 是否为当前周
         */
        filterTable(currentWeek) {
            this.listType = currentWeek ? 'week' : 'filter';
            this.$refs.filterForm.validate((valid) => {
                if (valid) {
                    // 设置请求参数
                    this.listArgs = {...this.form};
                    // 设置类型为搜索类型
                    this.tableType = 2;
                    // 条件全部为空默认选择当前周
                    if (Object.keys(this.form).every(item => !this.form[item] && this.form[item] !== 0)) {
                        const dateRange = computeWeek(new Date());

                        this.listArgs.startTime = dateRange[0];
                        this.listArgs.endTime = dateRange[1];
                        this.listType = 'week';
                    } else if (
                        this.form.startTime === ''
                        && Object.keys(this.form).some(item => this.form[item])
                    ) {
                        // 时间为空但有其他条件默认选择最近 30 天
                        this.listArgs.startTime = moment().subtract(29, 'd').format('YYYY-MM-DD');
                        this.listArgs.endTime = moment().format('YYYY-MM-DD');
                    }
                    
                    this.startTime = this.listArgs.startTime;
                    this.endTime = this.listArgs.endTime;

                    // 请求列表
                    this.getWeeksList();
                }
            });
        },
        /**
         * 日期改变事件，根据选择的时间计算出该周的周一和周日
         * @param {String} value 当前日期
         */
        changeDate(value) {
            this.form.startTime = value ? value[0] : '';
            this.form.endTime = value ? value[1] : '';
        },
        /**
         * 操作医生
         * @param {String} time 选中时间
         * @param {String} action 操作类型，'add': 添加医生，'edit': 修改
         * @param {Object} docMsg 选中医生信息，编辑必须，添加不需要
         * @param {Object} freeClinicMsg 选中的义诊信息
         */
        doActionDoctor(time, action, docMsg, freeClinicMsg) {
            const date = Date.parse(time);
            
            this.doctorSeleted = action === 'add' ? {} : docMsg;
            this.freeClinicSelected = freeClinicMsg;
            if (action === 'add') {
                if (date - Date.parse((new Date()).toDateString()) < 0) {
                    this.$message({
                        type: 'error',
                        message: `历史义诊不能进行添加！`,
                        dangerouslyUseHTMLString: true,
                    });
                } else {
                    this.modelAdd = true;
                }
            } else {
                this.modelEdit = true;
            }
        },
    },
    mounted() {
        this.date = computeWeek(new Date()); // 初始化为当前周
        this.changeDate(this.date);
        this.filterTable(true);
    },
};
</script>

<style scoped lang="less">
.action-content {
    min-width: 1200px;
}
.header--action-content {
    overflow: hidden;
}
.table-wrapper--free-clinic {
    width: 100%; 
    overflow: auto;
}
.body--action-content {
    width: 100%;
    line-height: 2;
    border-collapse: collapse;
    
    td, th {
        min-width: 180px;
        text-align: center;
        padding: 4px 10px;
        border: 1px solid #ebeef5;
    }
    .table-header-time {
        width: 150px;
    }
    .name-list__wrapper {
        width: 100%;
        min-height: 350px;
        max-height: 450px;
        overflow: auto;
    }
    .docmsg-block {
        margin: 10px auto;
        padding: 4px 8px;
        width: 80%;
        font-size: 12px;
        text-align: center;
        border: 1px solid #d8d8d8;
        border-radius: 8px;
        transition: all .3s;
        cursor: pointer;
        &:hover {
            color: #409EFF;
            border-color: #409EFF;
        }
    }
}
</style>
<style lang="less">
.free-clinic-manage-index {
    .el-form-item.is-success .el-input__inner {
        border-color: #c0c4cc;
    }
}
</style>
