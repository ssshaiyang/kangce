<!-- 添加敏感词-->
<template>
        <el-form ref="formEdit"   label-width="100px">
           <div class="headerbox">
            <span class="headerlabel">新增敏感词</span>
            <div class="headerBtn">
                <el-button type="primary" @click="addWord">保存</el-button>
                <el-button type="primary">取消</el-button>
            </div>
        </div>
        <el-form-item label="敏感词名称">
            <el-input style='width:400px;' v-model="word" type="text" ></el-input>
        </el-form-item>
    </el-form>
</template>

<script>

import {
    addNewWordAPI,
}from '@/api/sensitiveWordAPI.js'
export default {
    name: "",
     data(){  
        return   {
            word:'',            
        }
    },
    components: {
    },
    methods: {
        /*
         * 添加敏感词
         */
    	addWord(){
            if(this.word===''){
            	 this.$message.error('敏感词不能为空');
            }else{
            	const params={
            		word:this.word
            	}
            	addNewWordAPI(params)
            	.then(res => {
                    if(res.data.code===1000){
                        this.$message({
                            type: 'success',
                            message: '敏感词添加成功',
                       });
                        this.$emit('close-form');
                        this.$emit('finish-action');
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
                .catch(err => {
                })
            }
           
        },
    },
};
</script>

<style scoped lang="less">

.headerBtn{
    float: right;
}

.headerlabel{
    float: left;
}

.headerbox{
    overflow:hidden;
    margin-bottom: 10px;
}
</style>