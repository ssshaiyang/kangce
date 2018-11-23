<!-- 社区管理：敏感词管理 -->
<template>
    <div class="wrapper--doctor-user">
        <div style="overflow:hidden">
            <el-button type="primary" style="display:inline-block" @click="modelWordShow = true">新建敏感词</el-button>
            <div style="display:inline-block;margin-left:20px">
                <el-upload
                :action="wordUplodAPI"
                accept=".xlsx"
                :headers="headers"
                :show-file-list="false"
                :on-success="uploadWordSuccess">
                     <el-button type="primary">excel导入敏感词</el-button>
                </el-upload>
            </div>
        </div>
        <div class="table" v-loading="tableLoading">
            <el-table
            :data="tableData"
            size="medium "
            border
            max-height="400"
            style="width: 100%">
                <el-table-column
                  fixed
                  type="index"
                  label="序号"
                  width="200">
                </el-table-column>
                <el-table-column
                fixed
                prop="word"
                label="敏感词"
                min-width="200">
                </el-table-column>
                <el-table-column
                prop="abnormal"
                label="操作"
                min-width="200">
                <template slot-scope="scope">
                    <el-button type="primary" @click="delWord(scope.row.id)">删除</el-button>
                 </template>
                </el-table-column>
            </el-table>
            <div class="table-footer--APP" slot="append">
                <el-pagination
                :current-page="form.page"
                :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90]"
                :page-size="form.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
                </el-pagination>
            </div>
            <el-dialog
                title="新增敏感词"
                :append-to-body="true"
                :visible.sync="modelWordShow"
                width="1000">
                <add-new-sensitive-word
                v-if="modelWordShow"
                @close-form="modelWordShow = false"
                @finish-action="getWordList"
                ></add-new-sensitive-word>
        </el-dialog>
        </div>
    </div>
</template>

<script>

import {
    getWordListAPI,
    delWordAPI,
    wordUplodAPI,
}from '@/api/sensitiveWordAPI.js'

const AddNewSensitiveWord = () => import('./addNewSensitiveWord.vue');

export default {
    name:'',
    data()   {
        return   {
            form: {
                filter: '',
                limit: 10,
                page: 1,
            },
            tableLoading: false, // 是否显示loading
            tableData: [], // 展示数据
            totalCount: 0, // 总条数
            modelWordShow:false,//新增窗口显示
            wordUplodAPI: `${wordUplodAPI}`,//导入敏感词
            headers: {
                'Authorization': `${localStorage.getItem('token')}`,
            },
        };
    },
    components: {
    	AddNewSensitiveWord
    },
    methods: {
        /**
         * 获取敏感词列表
         */
        getWordList() {
        	const params = {...this.form};

            this.tableLoading = true;
            getWordListAPI(params)
                .then(res => {
                    const data = res.data.data;
                    this.totalCount = data.totalCount;
                    this.tableData = data.data;
                    this.tableLoading = false;
                })
                .catch(err => {
                    this.tableLoading = false;
                })
        },
        /**
         * 切换表格每页大小，请求新页面账号列表
         * @param {Number} cSize 切换后页面大小
         */
        handleSizeChange(cSize) {
            this.form.limit = cSize;
            this.getWordList();
        },
        /**
         * 翻页，请求新页面账号列表
         * @param {Number} currentPage 翻页后页码
         */
        handleCurrentChange(currentPage) {
            this.form.page = currentPage;
            this.getWordList();
        },
        /**
         * 删除敏感词
         * @param {Number} id  敏感词id
         */
        delWord(id){
            this.$confirm('是否要删除这个敏感词？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    delWordAPI(id)
                    .then(res => {
                        if(res.data.code===1000){
                            this.$message({
                                type: 'success',
                                message: '敏感词删除成功',
                           });
                            this.getWordList();
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                    .catch(err => {
                    })
                })
        },
        /*
         * 批量导入敏感词
         */
        uploadWordSuccess(response, file, fileList) {
            if (response.code === 1000) {
                this.$message({
                    type: 'success',
                    message: '敏感词导入成功',
                });
                this.getWordList();
            } else {
                this.$message({
                    type: 'error',
                    message: response.msg,
                });
            }
        },

    },
    created() {
        this.getWordList();
    }
};
</script>

<style scoped lang="less">
.wrapper--doctor-user {
    padding: 20px;
}
.el-input-search {
    width: 300px;
    margin-right: 20px;
}
.table {
    margin: 30px 0;
}
.doc-name-text {
    color: #606266;
    &:hover {
        color: #409EFF;
    }
}
</style>