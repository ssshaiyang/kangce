<!-- 医生审核管理：批量导入已通过名单 -->
<template>
    <el-form  ref="batchAddForm" label-width="200px">
        <el-form-item>
            <el-button type="primary" @click="downloadTem">下载模板</el-button>
        </el-form-item>
        <el-form-item label="请选择要导入的名单：">
            <el-upload
            accept=".xlsx"
            :headers="headers"
            :limit="1"
            :show-file-list="true"
            :action="doctorManageListUplodAPI"
            :on-remove="removeUploadedFile"
            :on-success="uploadSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
            </el-upload>
        </el-form-item>
        <el-form-item class="pt10">
            <el-button type="primary" @click="submitForm" v-loading="loading">导入</el-button>
            <el-button @click="closeForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {
    downloadDocManageTempAPI,
    doctorManageListUplodAPI,
    importDoctorManagePassAPI,
} from '@/api/reviewManageAPI.js';

export default {
    name:'',
    data()   {
        return {
            loading: false,
            doctorManageListUplodAPI: `${doctorManageListUplodAPI}`,
            headers: {
                'Authorization': `${localStorage.getItem('token')}`,
            },
            filePath: '',
        };
    },
    methods: {
        /**
         * 下载模板
         */
        downloadTem() {
            downloadDocManageTempAPI()
                .then(res => {
                    let link = document.createElement('a');

                    link.target = '_blank';
                    link.download = '身份审核模板.xlsx';
                    link.href = URL.createObjectURL(res.data);
                    link.click();
                });
        },
        /**
         * 上传成功
         */
        uploadSuccess(response, file, fileList) {
            if (response.code === 1000) {
                this.filePath = response.data.filePath;
            } else {
                this.$message({
                    type: 'error',
                    message: response.msg,
                });
            }
        },
        /**
         * 移除文件后
         */
        removeUploadedFile() {
            this.filePath='';
        },
        /**
         * 提交表单
         */
        submitForm() {
            if (this.filePath) {
                importDoctorManagePassAPI({
                    filename: this.filePath,
                })
                    .then(response => {
                        const res = response.data;
                        
                        if (res.code === 1000) {
                            this.$message({
                                type: 'success',
                                message: '导入名单成功',
                            });
                            this.closeForm();
                            this.$emit('finish-add');
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg,
                            });
                        }
                    })
            } else {
                this.$message({
                    type: 'warning',
                    message: '请上传要导入的用户名单！',
                });
            }
        },
        /**
         * 关闭批量添加用户弹窗
         */
        closeForm() {
            this.$emit('close-form');
        },
    }
};
</script>

<style scoped>

</style>