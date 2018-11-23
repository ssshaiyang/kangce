<!-- 系统管理：接诊设置管理-->
<template>
	<div style="margin:20px 0 0 20px">
		<el-select v-model="region" placeholder="价格区间管理" @change="sectionChange">
	      <el-option label="价格区间管理" value="1"></el-option>
	      <el-option label="推荐价格区间" value="2"></el-option>
	    </el-select>
	    <div class="pricebox" style="margin-top:20px">
	    	<span>主任医师接诊价格区间</span>
	    	<div class="laberbox">
	    		<div>价格下限</div>
	    		<el-input class='inputcss'  v-model="directorprice.minPrice" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>价格上限</div>
	    		<el-input class='inputcss'  v-model="directorprice.maxPrice" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>人数下限</div>
	    		<el-input class='inputcss'  v-model="directorprice.minPeople" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>人数上限</div>
	    		<el-input class='inputcss'  v-model="directorprice.maxPeople" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<el-button @click="changeSection(1)"  type="primary">确定</el-button>
	    	</div>
	    </div>
	    <div class="pricebox">
	    	<span>副主任医师接诊价格区间</span>
	    	<div class="laberbox">
	    		<div>价格下限</div>
	    		<el-input class='inputcss'  v-model="deputydirectorPrice.minPrice" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>价格上限</div>
	    		<el-input class='inputcss'  v-model="deputydirectorPrice.maxPrice" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>人数下限</div>
	    		<el-input class='inputcss'  v-model="deputydirectorPrice.minPeople" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>人数上限</div>
	    		<el-input class='inputcss'  v-model="deputydirectorPrice.maxPeople" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<el-button @click="changeSection(2)" type="primary">确定</el-button>
	    	</div>
	    </div>
	    <div class="pricebox">
	    	<span>主治医师接诊价格区间</span>
	    	<div class="laberbox">
	    		<div>价格下限</div>
	    		<el-input class='inputcss'  v-model="chiefphysicianPrice.minPrice" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>价格上限</div>
	    		<el-input class='inputcss'  v-model="chiefphysicianPrice.maxPrice" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>人数下限</div>
	    		<el-input class='inputcss'  v-model="chiefphysicianPrice.minPeople" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>人数上限</div>
	    		<el-input class='inputcss'  v-model="chiefphysicianPrice.maxPeople" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<el-button @click="changeSection(3)"  type="primary">确定</el-button>
	    	</div>
	    </div>
	    <div class="pricebox">
	    	<span>医师接诊价格区间</span>
	    	<div class="laberbox">
	    		<div>价格下限</div>
	    		<el-input class='inputcss'  v-model="physicianPrice.minPrice" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>价格上限</div>
	    		<el-input class='inputcss'  v-model="physicianPrice.maxPrice" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>人数下限</div>
	    		<el-input class='inputcss'  v-model="physicianPrice.minPeople" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<div>人数上限</div>
	    		<el-input class='inputcss'  v-model="physicianPrice.maxPeople" clearable></el-input>
	    	</div>
	    	<div class="laberbox">
	    		<el-button @click="changeSection(4)" type="primary">确定</el-button>
	    	</div>
	    </div>
	</div>
</template>

<script>

import {
	getLevelPriceAPI,
	changePriceAPI
}from '@/api/doctorPriceargeAPI.js'

export default {
    name: "",
     data(){  
        return {
        	region: '价格区间管理',
        	filterValue:'',
        	directorprice:{
        		maxPeople: null,//主任医师人数上限
				maxPrice: null,//主任医师价格上限
				minPeople: null,//主任医师人数下限
				minPrice: null,//主任医师价格下限
        	},
        	deputydirectorPrice:{
        		maxPeople: null,//副主任医师人数上限
				maxPrice: null,//副主任医师价格上限
				minPeople: null,//副主任医师人数下限
				minPrice: null,//副主任医师价格下限
        	},
        	chiefphysicianPrice:{
        		maxPeople: null,//主治医师人数上限
				maxPrice: null,//主治医师价格上限
				minPeople: null,//主治医师人数下限
				minPrice: null,//主治医师价格下限
        	},
        	physicianPrice:{
        		maxPeople: null,//医师人数上限
				maxPrice: null,//医师价格上限
				minPeople: null,//医师人数下限
				minPrice: null,//医师价格下限
        	},
        }
    },
    methods: {
    	sectionChange(){
    		if(this.region==1){
    			this.getPriceSection()
    		}else if(this.region==2){
    			this.directorprice={
	        		maxPeople: 30,
					maxPrice: 99,
					minPeople: 1,
					minPrice: 70,
	        	};
	        	this.deputydirectorPrice={
	        		maxPeople: 30,//副主任医师人数上限
					maxPrice: 99,//副主任医师价格上限
					minPeople: 1,//副主任医师人数下限
					minPrice: 60,//副主任医师价格下限
				};
				this.chiefphysicianPrice={
	        		maxPeople: 30,//主治医师人数上限
					maxPrice: 59,//主治医师价格上限
					minPeople: 1,//主治医师人数下限
					minPrice: 40,//主治医师价格下限
	        	},
	        	this.physicianPrice={
	        		maxPeople: 30,//医师人数上限
					maxPrice: 30,//医师价格上限
					minPeople: 1,//医师人数下限
					minPrice: 20,//医师价格下限
        		}
    		}
    	},
    	getPriceSection(){
    		getLevelPriceAPI()
                .then(res => {
                   this.directorprice=res.data.data[0];
                   this.deputydirectorPrice=res.data.data[1];
                   this.chiefphysicianPrice=res.data.data[2];
                   this.physicianPrice=res.data.data[3];
                });
    	},
    	changeSection(type){
    		let params=[];
    		if(type==1){
    			params=this.directorprice;
    			params['type']=type;
    		}else if(type==2){
    			params=this.deputydirectorPrice;
    			params['type']=type;
    		}else if(type==3){
    			params=this.chiefphysicianPrice;
    			params['type']=type;
    		}else{
    			params=this.physicianPrice;
    			params['type']=type;
    		}
    		if(params.minPrice>params.maxPrice){
    			this.$message.error('价格下限不能高于价格上限')
    		}else if(params.minPeople>params.maxPeople){
    			this.$message.error('人数下限不能高于人数上限')
    		}else{
    			changePriceAPI(params)
		        .then(res => {
		            const data = res.data;
		            if (data.code === 1000) {
		                this.$message({
                                   type: 'success',
                                   message: '修改区间成功成功',
                        });
		            }else{
		            	this.$message.error(res.data.msg)
		            }
		        })
		        .catch(err => {
		        });
    		}
    	}
    },
    mounted() {
    	this.getPriceSection()
    }
};
</script>

<style scoped lang="less">>
.inputcss{
	width: 100px;
}

.laberbox{
	width: 160px;
	display: inline-block;
	margin-left: 20px;
}

.laberbox div{
	margin-bottom: 20px;
}

.pricebox{
	min-width:1100px;
}

.pricebox span{
	display: inline-block;
	width: 200px;
}
</style>