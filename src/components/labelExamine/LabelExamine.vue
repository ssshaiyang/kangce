<!-- 系统管理：行为标签管理 -->
<template>
    <div class="labelbox">
        <div class="filter">
        	<div class="labelheader">患者端行为标签管理</div>
        	<div class="labelheader">请在下方添加标签（不超过五个汉字，不包括英文字符）</div>
        </div>
        <div>
        <div class="addinput"><input v-model='labelText' type="text"><el-button type="primary">删除</el-button><el-button @click='addNewLabel' type="primary">添加</el-button></div>
        <ul class="labelList">
		  <li 
          :key="index"
          v-for="(item,index) in items"
          >
		  	<div><input type="text" :id="'label'+index" :value='item.tagName'><el-button @click='delLabel(item.id)' type="primary">删除</el-button><el-button type="primary" @click='changeLabel(item.id,index)'>修改</el-button></div>
		  </li>
		</ul>        	
        </div>
    </div>
</template>

<script>
import {
	getLabelListAPI,
	addLabelAPI,
	delLabelAPI,
	changeLabelAPI,
} from '@/api/labelExamineAPI.js'
export default {
    name:'',
    data()   {
        return   {
            items:[],//行为标签数组
            labelText:'',//要添加的行为标签
        };
    },
    methods: {
        getLableList(){
        	getLabelListAPI()
        		.then(res => {
                   this.items=res.data.data
                });
        },
        /*
         * 添加行为标签
         */
        addNewLabel(){
        	var reg = /^[\u4E00-\u9FA5]+$/; 
            if(this.labelText.length<=0){
              this.$message.error('无法添加空标签')
            }else if(!reg.test(this.labelText)){
                this.$message.error('不能输入英文及符号')
            }else{
            	const params ={
            		tagName:this.labelText
            	}
            	addLabelAPI(params)
    	        	.then(res => {
    			        const data = res.data;
    			        if (data.code === 1000) {
                            this.$message({
                                    type: 'success',
                                    message: '添加标签成功',
                            });
    			            this.labelText='';
    			            this.getLableList();
    			        } else {
    			           this.$message.error(res.data.msg)
    			        }
    			    })
    			    .catch(err => {
    		    	});
            }
        },
        /*
         * 删除行为标签 
         * @param {Number} id  删除的标签id
         */
        delLabel(id){
        	this.$confirm('确定要删除该标签么？（此操作不可逆）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    delLabelAPI(id)
                    .then(res => {
				        if (res.data.code === 1000) {
                            this.$message({
                                type: 'success',
                                message: '删除行为标签成功',
                            });
                            this.getLableList();
                        } else {
                           this.$message.error(res.data.msg)
                        }                 
                    })
                    .catch(err => {
                    })
                })
        },
        /*
         * 修改行为标签
         * @param {Number} id  修改的标签id
         * @param {Number} index  修改标签内容的下标
         */
        changeLabel(id,index){
        	const tagName =document.getElementById('label'+index).value;
            var reg = /^[\u4E00-\u9FA5]+$/; 
            if(tagName.length<=0){
              this.$message.error('无法修改为空标签')
            }else if(!reg.test(tagName)){
                this.$message.error('"不能输入英文及符号"')
            }else{
                const params={
                tagName:tagName,
                id:id,
            }
            changeLabelAPI(params)
                .then(res => {
                   if(res.data.code===1000){
                       this.$message({
                           type: 'success',
                           message: '修改行为标签成功',
                       });
                       this.getLableList();
                   }else{
                        this.$message.error(res.data.msg)
                   }                   
                })
                .catch(err => {
                })
            }
        }
    },
    mounted(){
       this.getLableList()
    }
};
</script>

<style scoped lang="less">
.labelbox{
    margin:20px;
}

.labelheader{
    width: 100%;
	font-size:30px;
	margin-bottom:50px;
}
.addinput,.labelList li{
	list-style: none;
	margin-top: 20px;
    height: 60px;
    border: 2px solid #C0C0C0;
    overflow: hidden;
}


.addinput  input,.labelList input{
	float: left;
    width: 200px;
    padding-left: 10px;
    height: 40px;
    margin-left: 20px;
    margin-top: 10px;
}

.addinput  button,.labelList button{
	text-align: center;
    padding:0;
	float: right;
    width: 60px;
    height: 40px;
    margin-top: 10px;
    margin-right: 20px
}
</style>