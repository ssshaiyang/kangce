<!-- 添加疫苗-->
<template>
        <el-form ref="formEdit"   label-width="100px">
           <div class="headerbox">
            <span class="headerlabel">疫苗编辑</span>
            <div class="headerBtn">
                <el-button type="primary" @click='copyVaccine'>复制</el-button>
                <el-button type="primary" @click='pasteVaccine'>粘贴</el-button>
                <el-button type="primary" @click='saveVaccine'>保存</el-button>
                <el-button type="primary" @click='closeWindow'>取消</el-button>
            </div>
        </div>
        <el-form-item label="疫苗名称">
            <el-input style='width:400px;' v-model="form.vaccineName" type="text" ></el-input>
        </el-form-item>
        <div style="overflow:hidden">
            <el-form-item style='margin-left:0' class='totalbox' label="总剂数" prop="nickname">
                <el-select v-model="form.totalDose" placeholder="请选择">
                  <el-option
                    v-for="item in totalDoseList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class='totalbox' label="当前剂数" prop="nickname">
                <el-select v-model="form.dose" placeholder="请选择">
                  <el-option
                    v-for="doseNum in doseList"
                    :key="doseNum"
                    :label="doseNum"
                    :value="doseNum">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class='totalbox' label="接种年龄" prop="nickname">
                <el-select v-model="form.month" placeholder="请选择">
                  <el-option
                    v-for="monthNum in monthList"
                    :key="monthNum.month"
                    :label="monthNum.monthName"
                    :value="monthNum.month">
                  </el-option>
                </el-select>
            </el-form-item>
        </div>
        <el-form-item label="费用" >
           <template >
              <el-radio-group v-model="form.isCharge">
                <el-radio :label="1">一类(免费)</el-radio>
                <el-radio :label="2">二类(自费)</el-radio>
              </el-radio-group>
            </template>
        </el-form-item>
        <el-form-item label="接种效果" prop="Password">
            <el-input
              type="textarea"
              :rows="4"
              maxlength:500
              placeholder="请输入内容"
              v-model="form.inoculationEffect">
            </el-input>
        </el-form-item>
         <el-form-item label="接种部位" prop="Password">
            <el-input
              type="textarea"
              :rows="4"
              maxlength:500
              placeholder="请输入内容"
              v-model="form.inoculationSite">
            </el-input>
        </el-form-item>
         <el-form-item label="接种禁忌" prop="Password">
            <el-input
              type="textarea"
              :rows="4"
              maxlength:500
              placeholder="请输入内容"
              v-model="form.inoculationTaboo">
            </el-input>
        </el-form-item>
         <el-form-item label="不良反应" prop="Password">
            <el-input
              type="textarea"
              :rows="4"
              maxlength:500
              placeholder="请输入内容"
              v-model="form.adverseReaction">
            </el-input>
        </el-form-item>
         <el-form-item label="注意事项" prop="Password">
            <el-input
              type="textarea"
              :rows="4"
              maxlength:500
              placeholder="请输入内容"
              v-model="form.mattersNeeding">
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script>

import {
    getUserAuthsAPI,
    addVaccineAPI,
    changeVaccineAPI
}from '@/api/childVaccineAPI.js'

export default {
    name: "",
     data(){  
        return   {
            form:{
                 vaccineName:'',
                 totalDose:1,//当前总剂数
                 dose:1,//当前选中的剂数
                 month:1,//当前选中的接种年龄
                 isCharge: 1,//是否自费
                 inoculationEffect:'',//接种效果
                 inoculationSite:'',//接种部位
                 adverseReaction:'',//不良反应
                 inoculationTaboo:'',//接种禁忌
                 mattersNeeding:'',//注意事项
            },
            totalDoseList:[1,2,3,4],//总剂数下拉
            doseList:[1,2,3,4],//当前剂数下拉
            monthList:[
                {month:1,monthName:'1月龄'},
                {month:2,monthName:'2月龄'},
                {month:3,monthName:'3月龄'},
                {month:4,monthName:'4月龄'},
                {month:5,monthName:'5月龄'},
                {month:6,monthName:'6月龄'},
                {month:7,monthName:'7月龄'},
                {month:8,monthName:'8月龄'},
                {month:9,monthName:'9月龄'},
                {month:10,monthName:'10月龄'},
                {month:11,monthName:'11月龄'},
                {month:12,monthName:'1周岁'},
                {month:18,monthName:'1岁半'},
                {month:24,monthName:'2周岁'},
                {month:36,monthName:'3周岁'},
                {month:48,monthName:'4周岁'},
                {month:60,monthName:'5周岁'},
                {month:72,monthName:'6周岁'},
            ],//接种年龄下拉
        }
    },
    methods: {
      /**
        * 保存修改疫苗
        * @param {Number} this.checkvaccineId  保存还是修改 0:保存 其它:修改
        */
    	saveVaccine(){
            this.form = {
                ...this.form,
            }
            const params = this.form;
            if(params.totalDose < params.dose){
                this.$message.error('当前剂数不能大于总剂数')
            }else{
                if(this.checkvaccineId !== 0){
                    params['vaccineId'] = this.checkvaccineId;
                        changeVaccineAPI(params)
                        .then(res => {
                            if(res.data.code===1000){
                                this.$message({
                                    type: 'success',
                                    message: '修改疫苗成功',
                                });
                                this.$emit('close-form');
                                this.$emit('finish-action');
                            }else{
                                this.$message.error(res.data.msg)
                            }
                        })
                        .catch(err => {
                        })
                }else{
                    addVaccineAPI(params)
                    .then(res => {
                        if(res.data.code === 1000){
                            this.$message({
                                type: 'success',
                                message: '创建疫苗成功',
                            });
                            this.$emit('close-form')
                            this.$emit('finish-action')
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch(err => {
                    })
                }
            }
        },
        /**
          * 获取当前疫苗信息
          * @param {Number} this.checkvaccineId  疫苗id
          */
        getVaccine(){
            if(this.checkvaccineId !== 0){
                 getUserAuthsAPI(this.checkvaccineId)
                    .then(res => {
                        const vaccineData  =   res.data.data;
                        this.form = vaccineData;
                    })
                .catch(err => {
                })
            }else{
            }
        },

        /**
         * 粘贴疫苗内容
         */
        pasteVaccine(){
            if(sessionStorage.getItem("vaccine") == ''||sessionStorage.getItem("vaccine") == undefined){
              this.$message.error('未复制内容无法粘贴')
            }else{
              const content =JSON.parse(sessionStorage.getItem("vaccine"))
              this.form=content
            }
        },
        /**
         * 复制疫苗内容
         */
        copyVaccine(){
            sessionStorage.setItem("vaccine",JSON.stringify(this.form))
        },

        /*
         * 取消返回上级页面
         */
        closeWindow(){
            this.$emit('close-form')
        }
    },
    props: {
        // 疫苗 ID
        checkvaccineId: {
            required: true,
        },
    },
    mounted() {
        this.getVaccine()
    }
};
</script>

<style scoped lang="less">
.totalbox{
    width: 30%;
    float: left;
    margin-left: 1%;
}

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