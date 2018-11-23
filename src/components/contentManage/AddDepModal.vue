<!-- 一级科室管理 -->
<template>
    <div>
        <h5>请输入一级科室名称</h5>
        <el-input v-model="firstDepName" placeholder="请输入内容"></el-input>
        <div>
            <h5>科室图片</h5>
            <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="uploadImg"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageShowUrl" :src="imageShowUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <el-button v-if="depId>0" type="primary" @click="submitFirstDep">
            修改
        </el-button>
        <el-button v-else type="primary" @click="submitFirstDep">
            添加
        </el-button>
    </div>
</template>


<script>
import { 
    addFirstDepAPI,
    getFirstDepartmentAPI,
    changeFirstDepAPI
 } from '@/api/contentManageAPI.js'
    export default {
    data() {
        return {
            imageUrl: '',
            addFirstDepAPI:`${addFirstDepAPI}`,
            departmentImage:'',//科室图片
            imgFile:'',//图片file
            firstDepName:'',//科室名称
            imageShowUrl:'',//显示科室的URL
        };
    },
    props:{
        depId:{
            type:Number,
            required:true
        }
    },
    methods: {
        /*
         * 图片上传
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
        uploadImg(file,fileList){
            this.imgFile = file.raw;
            this.imageShowUrl = URL.createObjectURL(file.raw);
        },
        /*
         * 添加修改提交一级科室
         */
        submitFirstDep(){
            console.log(this.depId)
            if(this.depId == 0){
                    console.log(this.depId)
                    var formData = new FormData();
                    if(this.imgFile !==0){ 
                        formData.append('departmentImage', this.imgFile)
                    }
                    formData.append('departmentName',this.firstDepName);
                    addFirstDepAPI(formData)
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
                 //修改提交
                    var formData = new FormData();
                    if(this.imgFile !== ''){ 
                        formData.append('departmentImage', this.imgFile); 
                    }
                    formData.append('departmentName',this.firstDepName)
                    console.log(formData.get('departmentImage'))
                    changeFirstDepAPI(this.depId,formData)
                        .then((res) => {
                        const response = res.data;
                        console.log(response)
                        let status = 'success';
                        if (response.code === 1000) {
                            this.$message({
                                type: status,
                                message: status === 'success' ? '修改成功！' : response.msg,
                            }).then(
                            this.finishOption()
                            )
                        } else {
                            status = 'error';
                        }
                        this.$message({
                            type: this.status,
                            message: this.status === 'success' ? '操作成功！' : response.msg,
                        });
                    }).catch((err) => {
                        
                    });
                    
                
            }

        },
        /*
         * 获取一级科室详情
         * @param {Number} id  一级科室id
         */
        getDetails(id){
            getFirstDepartmentAPI(id)
                .then((result) => {
                    this.imageUrl = result.data.data.departmentImage;
                    this.imageShowUrl = result.data.data.departmentImage;
                    this.firstDepName = result.data.data.departmentName;
                }).catch((err) => {
                    
                });
        },
        /*
         * 关闭弹窗
         */
        finishOption(){
            this.$emit('finish-action');
            this.$emit('close-form')
        }

    },
    mounted(){
        if(this.depId >0){
             this.getDetails(this.depId)
        }
    }
}
</script>


<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
