<!-- 修改banner -->
<template>
    <div>
        <div class="changebanner">
            <div class="bannerBag">
                <p>文章标题</p>
                <el-radio-group v-model="newsId" class="changbannerradiogroup">
                    <el-radio
                    v-for="item in AnoData"
                    :key="item.key"
                    :label="item.key"
                    :value="item.key"
                    class="titleitem">{{item.label}}</el-radio>
                </el-radio-group>
            </div>
            <div class="bannerBag">
                <p>Banner标题</p>
                <el-radio-group v-model="bannerId" class="changbannerradiogroup">
                    <el-radio
                    v-for="item in bannerData"
                    :key="item.key"
                    :label="item.key"
                    :value="item.key">{{item.label}}</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="changebannerbtn">
        <el-button  @click="handleChangeBannge">
            提交
        </el-button>
        </div>
        
    </div>
</template>

<style>
    .transfer-footer {
        margin-left: 20px;
        padding: 6px 5px;
    }
</style>

<script>
import {
    getBannerList,
    getBannerAnoList,
    setBannerAPI
    } from '@/api/informationManagerAPI.js';
export default {
    data() {
        return {
            bannerData:[],//banner数据
            AnoData:[],//其他资讯数据
            bannerId:0,//bannerID
            newsId:0,//其他ID
        };
    },
    props:{
        getNewsList:{
            type:Function,
            required:true
        }
    },

    methods: {
        initData(){
            this.getBannerList();
            this.getBannerAnoList();
        },
        /*
         * 获取banner列表
         */
        getBannerList(){
            getBannerList()
                .then(res => {
                    const data = res.data.data;
                    this.bannerData = [];
                    data.map(item => {
                        this.bannerData.push({
                            key:item.id,
                            label:item.title
                            })
                    })
                })
        },
        /*
         * 获取不是banner的列表
         */
        getBannerAnoList(){
            getBannerAnoList()
                .then(res => {
                    const data = res.data.data;
                    this.AnoData = [];
                    data.map(item => {
                        this.AnoData.push({
                            key:item.id,
                            label:item.title
                            })
                        
                    })
                    
                })
        },
        /*
         * 修改banern
         */
        handleChangeBannge(){
            if(this.newsId !== 0){
                if(this.bannerData.length>=3 && this.bannerId == null){
                    this.$message({
                        type: 'error',
                        message: "Banner已经达到上限！不能增加，只能替换！",
                    })
                    return false;
                }
                console.log(this.newsId,this.bannerId)
                setBannerAPI({
                    newsId:this.newsId,
                    bannerId:this.bannerId || null
                }).then(res => {
                    const response = res.data;
                    let status = 'success';

                    if (response.code === 1000) {
                        this.initData();
                    } else {
                        status = 'error';
                    }
                    this.$message({
                        type: status,
                        message: status === 'success' ? '操作成功！' : response.msg,
                    });
                    if (response.code === 1000) {
                        this.finishOption();
                    }
                })
            }else{
                    this.$message({
                        type: 'error',
                        message: "没有选择标题",
                    })
            }
        },
        /*
         * 结束关闭
         */
        finishOption(){
            console.log("finishOption")
            this.$emit('finish-action');
            this.$emit('close-form')
        }
        
    },
    mounted(){
        this.initData();
    }
  };
</script>

<style>
    .changebanner{
        display: flex;
        justify-content:center;
    }
    .bannerBag{
        width:30%;
    }
    .changbannerradiogroup{
        display:flex;
        flex-direction:column
    }
    .bannerBag p{
        font-size:20px;
        margin:10px;
    }
    .titleitem{
        display: block;
    }
    .changebanner .el-radio+.el-radio{
        margin-left:0px!important;
        margin-top:10px;
    }
    .changebannerbtn{
        margin-top:20px;
        text-align:center;
    }
</style>
