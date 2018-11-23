<!-- 添加修改资讯 -->
<template>
    <div id="wangeditor">
        <div class="uploadpic">
            <el-upload
                class="avatar-uploader"
                :action="uploadBannerAPI"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <i  class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
        </div>
        <div>
            <el-input placeholder="请输入标题" v-model="title" >
            </el-input>
            <div class="flex">
                <h3>请选择发布方式:&ensp;</h3>
                <el-radio-group v-model="poststyle">
                    <el-radio :label="1">及时发送</el-radio>
                    <el-radio :label="2">定时发送</el-radio>
                    <el-radio :label="0">保存为草稿</el-radio>
                </el-radio-group>
            </div>
            <div class="flex" v-if="poststyle == 2">
                <h3>请选择定时发送时间:&ensp;</h3>
                <el-date-picker
                v-model="postTime"
                type="datetime"
                placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <div class="flex">
                    <h3>请选择发布平台:&ensp;</h3>
                    <el-radio-group v-model="plateform">
                        <el-radio-button label="1">患者端</el-radio-button>
                        <el-radio-button label="2">医生端</el-radio-button>
                    </el-radio-group>
           </div>
        </div>
        <div id="editorElem" style="text-align:left"></div>
        <el-button type="primary" class="margin20" @click="postCentent">发送</el-button>
    </div>
</template>

<script>
import E from 'wangeditor';
import {
    uploadBannerAPI,
    addNewsAPI,
    getNewsInfo,
    modifyNewsAPI
    } from '@/api/informationManagerAPI.js'
export default {
    name:'editor',
    data(){
        return{
            editorContent :'',//编辑器内容
            imageUrl: '',//banner图URL
            uploadBannerAPI:`${uploadBannerAPI}`,//标题
            title:'',//资讯标题
            poststyle:'',//发送方式
            plateform:'',//发送平台
            postTime:'',//定时发送的时间
        }
    },
    props:{
        newsInfoId:{
            type:Number,
            required:true
        },
        modelAddInfoShow:{
            type:Boolean,
            required:true
        }
    },
    watch:{
        // newsInfoId(newValue) {
        //     if(newValue>0){
        //         this.getDetails(newValue);
        //     }
            
        // },
        // modelAddInfoShow(){}
    },
    methods:{
        /*
         * 添加修改资讯 newsInfoId newsInfoId<0 为添加资讯 newsInfoId>0为修改资讯
         */
        postCentent(){
            const form = {
                imgUrl:this.imageUrl,
                title:this.title,
                platform:parseInt(this.plateform),
                status:parseInt(this.poststyle),
                content:this.editorContent,
                initContent:null,
                publishTime:this.poststyle == 2 ? this.postTime : '' ,
            };
            if(this.newsInfoId < 0){
                addNewsAPI({...form})
                    .then((res) => {
                        const response = res.data;
                        let status = 'success';
                        if (response.code === 1000) {
                            this.$message({
                                type: status,
                                message: status === 'success' ? '添加成功！' : response.msg,
                            }).then(
                            this.finishOption()
                            )
                        } else {
                            status = 'error';
                        }
                        this.$message({
                            type: status,
                            message: status === 'success' ? '操作成功！' : response.msg,
                        });
                    }).catch((err) => {
                        
                    });
            }else{
                modifyNewsAPI(this.newsInfoId,{...form})
                    .then((res) => {
                        const response = res.data;
                        let status = 'success';
                        if (response.code === 1000) {
                            this.$message({
                                type: status,
                                message: status === 'success' ? '添加成功！' : response.msg,
                            }).then(
                            this.finishOption()
                            )
                        } else {
                            status = 'error';
                        }
                        this.$message({
                            type: status,
                            message: status === 'success' ? '操作成功！' : response.msg,
                        });
                    }).catch((err) => {
                        
                    });
            }
        },
        /**
         * @msg: 上传banner
         * @param {type} 
         * @return: 
         */
        handleAvatarSuccess(res, file) {
            this.imageUrl = res.data.url;
            console.log(this.imageUrl)
        },
        /*
         * 图片格式验证
         */
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        /*
         * 获取资讯详情
         */
        getDetails(){
            if(this.newsInfoId != -1){
                getNewsInfo(this.newsInfoId)
                    .then((res) => {
                        if(res.data.code===1000){
                            const response = res.data.data
                            this.imageUrl = response.imgUrl;
                            this.plateform = response.platform;
                            this.poststyle = response.status;
                            this.title = response.title;
                            this.editorContent = response.content;
                            this.postTime = response.publishTime;
                            var editor = new E('#editorElem')
                            editor.create()
                            editor.txt.html(this.editorContent)
                            console.log(this.poststyle)
                            console.log(this.plateform)
                        }
                    }).catch((err) => {
                        
                    });
                
            }else{
            }
        },
        
        finishOption(){
            this.$emit('finish-action');
            this.$emit('close-form')
        }
    },
    mounted() {
        //wangEditor自带方法
        var editor = new E('#editorElem')
        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        }
        console.log(this.newsInfoId)
        if(this.newsInfoId >0 ){
            this.getDetails(this.newsInfoId)
        }
        
        editor.create()
        if(this.newsInfoId >0 ){
            
        }
    },

}
</script>

<style>
    #wangeditor .avatar-uploader .el-upload {
        border: 1px dashed #adacac;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    #wangeditor .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    #wangeditor .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    #wangeditor .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    #wangeditor .uploadpic{
        display: flex;
    }
    #wangeditor .uploadpic img {
        height: 178px;
        width:600px;
        border: 1px solid #8c939d;
        margin-left: 30px;
    }
    #wangeditor .flex{
        display: flex;
        height: 40px;
        line-height: 40px;
        text-align: center;
        align-items:center;
        margin-top: 5px;
        margin-bottom: 5px;
    }
    #wangeditor .margin20{
        margin-top: 20px;
    }
</style>

