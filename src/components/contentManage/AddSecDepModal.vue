<!-- 二级科室管理 -->
<template>
    <div>
        <h5>请输入二级科室名称</h5>
        <el-input v-model="firstDepName" placeholder="请输入内容"></el-input>
        <h5>所属第一科室</h5>
        <el-select v-model="selectFirstDep" placeholder="请选择" >
            <el-option
                v-for="item in firstDepOptions"
                :key="item.id"
                :label="item.departmentName"
                :value="item.id">
            </el-option>
        </el-select>
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
        <div>
            <h5>疾病XLS</h5>
            <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="true"
            :auto-upload="false"
            :file-list="xlsfileList"
            :multiple="false"
            :on-exceed="handleExceed"
            :limit="1"
            :on-change="uploadXls">
            <el-button size="small" type="primary">点击上传疾病XLS</el-button>
            <div slot="tip" class="el-upload__tip">只能上传XLS文件</div>
            </el-upload>
        </div>
        <div class="isSee-switch">
            <h5>是否可见</h5>
            <el-switch
                v-model="isSee"
                active-text="是"
                inactive-text="否">
            </el-switch>
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
    changeFirstDepAPI,
    getFirstDepSelectAPI,
    addSecondDepAPI,
    getSecondDepartmentAPI,
    changeSecondDepAPI,
 } from '@/api/contentManageAPI.js'
    export default {
    data() {
        return {
            imageUrl: '',
            addFirstDepAPI:`${addFirstDepAPI}`,
            departmentImage:'',
            imgFile:'',
            xlsFile:'',
            firstDepName:'',
            firstDepOptions:[],
            selectFirstDep:'',
            imageShowUrl:'',
            xlsfileList:[],
            isSee:true,
            
        };
    },
    props:{
        depId:{
            type:Number,
            required:true
        }
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        //图片验证
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
        //上传图片
        uploadImg(file){
            console.log(file)
            this.imgFile = file.raw;
            this.imageShowUrl = URL.createObjectURL(file.raw); //创建img file格式地址
        },
        //上传文件
        uploadXls(file,fileList){
            console.log(file)
            this.xlsFile = file.raw;
            this.xlsfileList = [{
                name:file.raw.name,
                url:URL.createObjectURL(file.raw) //创建file file格式地址
            }]
            console.log(file.raw.name)
        },
        /**
         * @msg: 超出限制
         * @param {type} 
         * @return: 
         */
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件,请先删除  ${this.xlsfileList[0].name}  后重新添加`);
        },
        /*
         * 添加提交
         */
        submitFirstDep(){
            if(this.depId <= 0){
                var formData = new FormData();
                if(this.imgFile !==0){ 
                    formData.append('departmentImage', this.imgFile); 
                }
                if(this.xlsFile !==0){ 
                    formData.append('disease', this.xlsFile); 
                }
                formData.append('departmentName',this.firstDepName);
                formData.append('superiorDepartmentId',this.selectFirstDep);
                formData.append('isSee',this.isSee === true ? 1 : 0); 
                addSecondDepAPI(formData)
                    .then(res => {
                        const response = res.data;
                        let status = 'success';

                        if (response.code === 1000) {
                            this.finishOption()
                        } else {
                            status = 'error';
                        }
                        this.$message({
                            type: status,
                            message: status === 'success' ? '添加成功！' : response.msg,
                        })
                    })
            }else{//修改提交  试用formdata格式
                var formData = new FormData();
                if(this.imgFile !==''){ 
                    formData.append('departmentImage', this.imgFile); 
                }
                console.log(this.xlsFile)
                if(this.xlsFile !==undefined){ 
                    formData.append('disease', this.xlsFile); 
                }
                formData.append('departmentName',this.firstDepName);
                formData.append('superiorDepartmentId',this.selectFirstDep); 
                formData.append('isSee',this.isSee === true ? 1 : 0); 
                changeSecondDepAPI(this.depId,formData)  
                    .then(res => {
                        const response = res.data;
                        let status = 'success';

                        if (response.code === 1000) {
                            this.finishOption()
                        } else {
                            status = 'error';
                        }
                        this.$message({
                            type: status,
                            message: status === 'success' ? '修改成功！' : response.msg,
                        })
                    })
            }
        },
        
        /*
         * 获取二级科室详情
         * @param {Number} id  二级科室id
         */
        getDetails(id){
            getSecondDepartmentAPI(id)
                .then((result) => {
                    this.imageUrl= result.data.data.departmentImage;
                    this.imageShowUrl = result.data.data.departmentImage;
                    this.firstDepName = result.data.data.departmentName;
                    this.xlsFile= result.data.data.disease;
                    this.selectFirstDep = result.data.data.superiorDepartmentId;
                    this.isSee = result.data.data.isSee == 1 ? true : false;
                }).catch((err) => {
                    
                });
        },
        /*
         * 获取一级科室下拉框
         */
        getFirstDepSelect(){
            getFirstDepSelectAPI()
                .then(res =>{
                    const response = res.data.data;
                    this.firstDepOptions = response
                })
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
        console.log(this.depId)
        if(this.depId >0){
             this.getDetails(this.depId)
        }
        this.getFirstDepSelect();
        
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
    .isSee-switch{
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>
