<!-- 举报详情 -->
<template>
    <div class="wrapper--doctor-detail" v-loading="wholeLoding">
        <section class="options">
            <el-button type="primary" @click="addblack">拉黑用户</el-button>
            <el-button type="primary" @click="delreport">删除</el-button>
            <el-button type="primary" @click="ignorereport">忽略</el-button>
            <el-button type="primary" @click="back">返回</el-button>
        </section>
        
        <section class="base-msg">
            <div class="base-msg__report-person">
                <el-row :gutter="10">
                    <el-col :span="6">
                        发布时间  {{releaseTime}}
                    </el-col>
                    <el-col :span="6">
                        举报时间  {{reportTime}}
                    </el-col>
                    <el-col :span="12">
                    	是否匿名 <span v-if="isAnonymous===1">是</span><span v-else-if="isAnonymous===2">否</span>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="6">
                        被举报人用户名 {{beReportedUserName}}
                    </el-col>
                    <el-col :span="6">  
                        姓名  {{beReportedRealName}}	
                    </el-col>
                    <el-col :span="12">  
                        手机  {{beReportedPhone}}
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="6">
                        举报人用户名  {{username}}
                    </el-col>
                    <el-col :span="6">
                        姓名  {{realName}}
                    </el-col>
                    <el-col :span="12">
                        手机  {{phone}}
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="6">
                        小组  {{groupName}}
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="6">
                        内容  {{content	}}
                    </el-col>
                </el-row>
                <el-row style='margin-top:20px;' :gutter="10">
                    <el-col :span="2">
                        图片
                    </el-col>
                    <el-col :span="22">
                    	<img 
                            :key="index"
                            v-for="(item,index) in imgArr"
						    :src="item"
						    width="100"
						    height="100">
                    </el-col>
                </el-row>
                 <!-- 违规记录 -->
		        <el-row class="detail-section">
		            <el-col class="detail-section__title" :span="2">
		                违规记录
		            </el-col>
		            <el-col :span="22">
		                <table class="data-table-show">
		                    <tr>
		                        <th>日期</th>
		                        <th>操作记录</th>
		                    </tr>
		                     <tr
                                :key="key"
		                     	v-for="(item,key) in irregularitiesRecord" 
		                     >
		                        <td>{{item.irregularitiesDate}}</td>
		                        <td>{{item.irregularitiesStatus}}</td>
		                    </tr>
		                </table>
		            </el-col>
		        </el-row>
		        <el-row :gutter="10">
                    <el-col :span="6">
                        违规次数 {{irregularitiesCount}}
                    </el-col>
                </el-row>
            </div>
        </section>
    </div>
</template>

<script>

import {
	getReportDetailsAPI,
	delReportAPI,
	ignoreReportAPI
} from '@/api/reportManageAPI.js';

import {
	addBlacklistAPI
} from '@/api/userManageAPI.js';

export default {
    name:'ReportDetail',
    data() {
        return   {
            wholeLoding: false, // 获取页面信息时 loading
            beReportedPhone: '',// 被举报人手机号
			beReportedRealName: '',// 被举报人姓名
			beReportedUid: null,// 被举报人id
			beReportedUserName: '',// 被举报人用户名
			content: '',// 被举报的内容
			groupName: '',// 小组名称
			id: null, // 举报id
			imgArr: [],// 内容图片数组
			irregularitiesCount: 0,// 违规次数
			irregularitiesRecord: [],// 违规记录（最多展示4条）
			isAnonymous: null,// 是否匿名 ：1-是，2-否
			phone: "",// 举报人手机号
			realName: "",// 举报人姓名
			releaseTime: "",// 发表时间
			reportTime: "",// 举报时间
			status: null,// 状态：0-未处理，1-已删除，2-已忽略
			username:'',// 	举报人用户名
        };
    },
    components: {
    },
    props: {
        reportId: {
            required: true,
        },
    },
    watch: {
    },
    methods: {
        /**
         * 初始化页面
         * @param {Number} reportId 举报ID
         */
        initPage() {
        	 getReportDetailsAPI(this.reportId)
                .then(res => {
                    if(res.data.code === 1000){
                    	const repoortdata =res.data.data;
                    	this.beReportedPhone = repoortdata.beReportedPhone;
						this.beReportedRealName = repoortdata.beReportedRealName;
						this.beReportedUid= repoortdata.beReportedUid;
						this.beReportedUserName = repoortdata.beReportedUserName;
						this.content = repoortdata.content;
						this.groupName = repoortdata.groupName;
						this.id= repoortdata.id;
						this.imgArr = repoortdata.imgArr;
						this.irregularitiesCount = repoortdata.irregularitiesCount;
						this.irregularitiesRecord = repoortdata.irregularitiesRecord;
						this.isAnonymous = repoortdata.isAnonymous;
						this.phone = repoortdata.phone;
						this.realName = repoortdata.realName;
						this.releaseTime = repoortdata.releaseTime;
						this.reportTime = repoortdata.reportTime;
						this.status = repoortdata.status;
						this.username = repoortdata.username;
                    }
                })
                .catch(err => {
                    this.wholeLoding = false;
                })
        },
        /*
         * 返回
         */
        back(){
        	this.$emit('close-form');
        },
        /*
         * 删除动态
         * @param {Number} reportId 举报id
         */
        delreport(){
        	this.$confirm('是否要删除这个动态？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    delReportAPI(this.reportId)
                    .then(res => {
	                       	if(res.data.code ===1000){
	                       		 this.$message({
	                                   type: 'success',
	                                   message: '该动态已删除',
	                           	});
	                       		 this.$emit('close-form');
	                       		 this.$emit('finish-action');
	                       	}else{
	                       		this.$message.error(res.data.msg)
	                       	}
                        })
                        .catch(err => {
                        })
                })
        },
        /*
         * 忽略动态
         * @param {Number} reportId 举报id
         */
        ignorereport(){
        	this.$confirm('确定要忽略这个动态?', '提示', {
                confirmButtonText: '忽略',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                        ignoreReportAPI(this.reportId)
                        .then(res => {
	                        	if(res.data.code ===1000){
	                        		 this.$message({
	                                    type: 'success',
	                                    message: '已忽略该条动态',
	                            	});
	                        		this.$emit('close-form');
	                        		this.$emit('finish-action');
	                        	}else{
	                        		this.$message.error(res.data.msg)
	                        	}
                            })
                            .catch(err => {
                            })
                })
        },
        /*
         * 加入黑名单
         * @param {Number} beReportedUid 医生id
         */
        addblack(){
        	this.$confirm('确定要将该用户加入黑名单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                	const params = {
                		docId:this.beReportedUid,
                		reason:'社区违规次数达到上限',
                	}
                        addBlacklistAPI(params)
                        .then(res => {
	                        	if(res.data.code ===1000){
	                        		this.$message({
	                                    type: 'success',
	                                    message: '已将该用户拉黑',
	                            	});
	                        		this.$emit('close-form');
	                        		this.$emit('finish-action');
	                        	}else{
	                        		this.$message.error(res.data.msg)
	                        	}
                            })
                            .catch(err => {
                            })
                })
        }


    },
   created() {
        this.initPage();
    },
};
</script>

<style scoped lang="less">
.wrapper--doctor-detail {
    max-height: 600px;
    overflow: auto;

    & > .detail-section {
        margin: 30px auto 0;

        .detail-section__title {
            margin-bottom: 30px;
            font-size: 16px;
            font-weight: bold;
        }
    }
}
.base-msg {
    line-height: 2;
    overflow: hidden;
}
.base-msg__report-person {
    font-size: 16px;
    font-weight: bold;

    img {
        vertical-align: text-top;
    }

    div {
    	margin-top:10px;
    	margin-bottom:10px;
    }
}
.data-table-show {
    border-collapse: collapse;

    td, th {
        padding: 8px 20px;
        border: 1px solid #ebeef5;
    }
}
.options {
    margin-bottom: 30px;
    padding-bottom: 12px;
    text-align: right;
    border-bottom: 1px solid #e8e8e8;
}
</style>