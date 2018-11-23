<!-- 导出表单 -->
<template>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="导出时间段" prop="startTime">
            <el-date-picker
            type="daterange"
            value-format="yyyy-MM-dd"
            v-model="dateRange"
            @change="chageDate"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="请选择小组" prop="groupId">
            <el-select v-model="form.groupId">
                <el-option
                v-for="item in groups"
                :key="item.id"
                :value="item.id"
                :label="item.name"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" @click="submitForm" v-loading="loadingExport">确定</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    downloadGroupsDataAPI,
} from '@/api/groupManageAPI'

export default {
    name:'',
    data() {
        return {
            form: {
                startTime: '',
                endTime: '',
                groupId: '',
            },
            rules: {
                startTime: [
                    {required: true, message: '请选择日期范围', trigger: 'change'},
                ],
                groupId: [
                    {required: true, message: '请选择小组', trigger: 'change'},
                ],
            },
            dateRange: null,
            loadingExport: false,
        };
    },
    props: {
        groups: {
            type: Array,
            required: true,
        },
    },
    methods: {
        /**
         * 改变日期
         * @param {Array} value 当前值
         */
        chageDate(value) {
            const dateRange = this.dateRange ? [...this.dateRange] : ['', ''];

            this.form.startTime = dateRange[0];
            this.form.endTime = dateRange[1];
        },
        /**
         * 提交表单
         */
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const params = {...this.form};

                    this.loadingExport = true;
                    downloadGroupsDataAPI(params)
                        .then(res => {
                            this.loadingExport = false;

                            const response = res.data;
                            const url = URL.createObjectURL(response);

                            const link = document.createElement('a');

                            link.href = url;
                            link.download = '小组数据.xlsx';
                            link.target = '_blank';
                            link.click();
                        })
                        .catch(err => {
                            this.loadingExport = false;
                        });
                    console.log(this.form)
                }
            });
        },
        /**
         * 关闭表单
         */
        closeForm() {
            this.$emit('close-form');
        }
    },
};
</script>

<style scoped>

</style>