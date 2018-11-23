<!-- 协议管理 -->
<template>
    <div>
        <h1 class="agreementtitle">登录协议</h1>
        <el-input type="textarea" :rows="16" v-model="loginText" placeholder="请输入内容">
        </el-input>
        <el-button type="primary" class="agreementbtn" @click="saveLoginText">保存</el-button>
        <h1 class="agreementtitle">就诊协议</h1>
        <el-input type="textarea" :rows="16" v-model="visitText" placeholder="请输入内容">
        </el-input>
        <el-button type="primary" class="agreementbtn" @click="saveVisisText">保存</el-button>
    </div>
</template>

<script>
import {
    modifyTextAPI,
    getInitTextAPI
} from '@/api/agreeMentAPI.js'

export default {
    data(){
        return{
            loginText:'',
            visitText:''
        }
    },
    methods:{
        /*
         * 获取协议内容
         */
        getInitText(){
            getInitTextAPI()
                .then((result) => {
                    this.loginText = result.data.data.loginContent;
                    this.visitText = result.data.data.receiveContent
                }).catch((err) => {
                    
                });
        },
        /*
         * 保存登录协议
         */
        saveLoginText(){
            modifyTextAPI(2,this.loginText)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getInitText();
                    } else {
                        status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '保存成功！' : response.msg,
                    })
                })
        },

        /*
         * 保存就诊协议
         */
        saveVisisText(){
            modifyTextAPI(1,this.visitText)
                .then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.getInitText();
                    } else {
                        status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '保存成功！' : response.msg,
                    })
                })
        },
    },
    mounted(){
        this.getInitText();
    }
}
</script>

<style>
    .agreementtitle{
        margin: 10px;
    }
    .agreementbtn{
        margin: 10px
    }
</style>

