<template>
    <div>
        <div class="bannerdiv">
        <img class="banner" :src="bannerUrl" height="140" width="140" />  
        </div>
        <div class="infoContent" v-html="initContent"></div>
    </div>
</template>

<script>
import {
    
    getNewsInfo,
    } from '@/api/informationManagerAPI.js'
export default {
    data(){
        return{
            bannerUrl:'',
            initContent:'',
        }
        
    },
    props:{
        newsInfoId:{
            type:Number,
            required:true
        }
    },
    methods:{
        getDetails(){
            if(this.newsInfoId != -1){
                getNewsInfo(this.newsInfoId)
                    .then((res) => {
                        if(res.data.code===1000){
                            const response = res.data.data
                            this.bannerUrl = response.imgUrl;
                            this.initContent = response.content;
                        }
                    }).catch((err) => {
                        
                    });
                
            }else{
                
            }
            console.log(this.newsInfoId)
        }
    },
    mounted(){
        this.getDetails()
    }
}
</script>

<style scoped>
    .bannerdiv{
            text-align: center;
    }
    .banner{
        display: inline-block;
        width: 400px;
        height: 100px;
        vertical-align: middle;
    }
    .infoContent{
        margin: 20px auto;
        width: 420px;
        border: 1px solid #0f0f0f;
        height: 900px;
        overflow: scroll;
    }
</style>

