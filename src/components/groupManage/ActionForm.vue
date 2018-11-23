<!-- 操作表单 -->
<template>
    <div v-loading="loadingGlobal">
        <div class="option-title-wrapper">
            <h3 class="fl-l">{{actionType === 'edit' ? '编辑' : '新增'}}小组</h3>
            <div class="options fl-r">
                <el-button v-if="actionType === 'edit' && !isMidnightGroup" size="small" type="danger" v-loading="loadingDelete" @click="deleteGroup">删除</el-button>
                <el-button v-if="actionType === 'edit' && !isMidnightGroup" size="small" type="danger" v-loading="loadingHide" @click="toggleGroup">{{isHideGroup ? '取消隐藏' : '隐藏'}}</el-button>
                <el-button size="small" type="primary" @click="oprateGroup" v-loading="loadingOption">保存</el-button>
                <el-button size="small" @click="closeForm">返回</el-button>
            </div>
        </div>

        <el-form class="content-edit" ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
            <div class="msg--detail-group" v-if="actionType === 'edit'">
                <span class="title--content-item">小组ID</span>{{groupId}}                
            </div>
            
            <el-form-item prop="name" label="小组名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="小组头像" prop="imgUrl">
                <p style="color: skyblue;">请上传图片比例为1：1的图片</p>
                <div class="poster-wrapper">
                    <el-upload
                    class="poster-uploader"
                    :disabled="isMidnightGroup"
                    :action="imgUploadAPI"
                    :show-file-list="false"
                    :on-success="handlePosterSuccess"
                    :before-upload="() => {imgLoading = true}"
                    :on-error="() => {imgLoading = false}"
                    accept="image/jpg,image/jpeg,image/png"
                    v-loading="imgLoading">
                    <img v-if="form.imgUrl" :src="form.imgUrl" class="poster">
                    <i v-else class="el-icon-plus poster-uploader-icon"></i>
                    </el-upload>
                </div>
            </el-form-item>

            <el-form-item label="小组介绍" prop="describe">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入小组介绍"
                v-model="form.describe"
                ></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Buss from './Buss.js';
import { getStringRealLength } from '@/public/functions';
import {
    imgUploadAPI,
} from '@/api/globalAPI';
import {
    getInitGroupInfoAPI,
    createGroupAPI,
    modifyGroupAPI,
    hideGroupAPI,
    cancleHideGroupAPI,
    deleteGroupAPI,
} from '@/api/groupManageAPI'

export default {
    name:'',
    data() {
        return {
            form: {
                name: '',
                imgUrl: '',
                describe: '',
            },
            rules: {
                name: [
                    {required: true, message: '请输入小组名称', trigger: 'blur'},
                    {max: 6, message: '小组名称是最多6个字', trigger: 'blur'},
                ],
                imgUrl: [
                    {required: true, message: '请上传头像', trigger: 'blur'},
                ],
                describe: [
                    {required: true, message: '请输入小组介绍', trigger: 'blur'},
                    {validator: (rules, value, callback) => {
                        let length = getStringRealLength(value);

                        if (length > 60) {
                            callback('小组介绍最多60个字符，30个汉字');
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'},
                ],
            },
            imgUploadAPI: imgUploadAPI,
            tabLabel: {
                0: '没有标签',
                1: '支持 vs 反对',
                2: '正确 vs 错误',
                3: '喜欢 vs 不喜欢',
            },

            loadingGlobal: false,
            imgLoading: false,
            loadingOption: false,
            loadingDelete: false,
            loadingHide: false,

            // 是否为隐藏小组
            isHideGroup: Buss.isHideGroup,
            // 是否为深夜小组
            isMidnightGroup: Buss.isMidnightGroup,
        };
    },
    props: {
        actionType: {
            required: 'true',
        },
        groupId: {
            type: Number,
        },
    },
    methods: {
        /**
         * 获取话题详情
         */
        getGroupDetailInfo() {
            this.loadingGlobal = true;
            getInitGroupInfoAPI({
                id: this.groupId,
            })
                .then(res => {
                    const response = res.data.data;
                    
                    this.form = {
                        name: response.name,
                        imgUrl: response.imgUrl,
                        describe: response.describe,
                    }
                    this.loadingGlobal = false;
                })
                .catch(err => {
                    this.loadingGlobal = false;
                });
        },
        /**
         * 海报上传成功回调
         */
        handlePosterSuccess(res, file) {
            this.imgLoading = false;
            this.form.imgUrl = res.data.url;
        },
        /**
         * 添加或编辑话题
         */
        oprateGroup() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const api = this.actionType === 'edit' ? modifyGroupAPI : createGroupAPI;

                    this.loadingOption = true;
                    api({
                        ...this.form
                    }, this.groupId)
                        .then(res => {
                            const response = res.data;

                            if (response.code === 1000) {
                                this.$message({
                                    type: 'success',
                                    message: `${this.actionType === 'edit' ? '编辑': '新增'}成功！`,
                                });
                                this.$emit('refresh-list');
                                this.$emit('refresh-detail');
                                this.closeForm();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: response.msg,
                                });
                            }

                            this.loadingOption = false;
                        })
                        .catch(err => {
                            this.loadingOption = false;
                        });
                }
            });
        },
        /**
         * 删除话题
         */
        deleteGroup() {
            this.$confirm('是否要删除这个小组？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.loadingDelete = true;
                    deleteGroupAPI({
                        id: this.groupId,
                    })
                        .then(res => {
                            const response = res.data;

                            if (response.code === 1000) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功！',
                                });
                                this.$emit('refresh-list');
                                this.$emit('back-list');
                                this.closeForm();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: response.msg,
                                });
                            }
                            this.loadingDelete = false;
                        })
                        .catch(err => {
                            this.loadingDelete = false;
                        });
                })
                .catch(() => {});
        },
        /**
         * 隐藏、取消隐藏话题
         */
        toggleGroup() {
            this.$confirm(`是否${this.isHideGroup ? '取消隐藏' : '隐藏'}该小组，该操作不会对数据产生影响？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    const api = this.isHideGroup ? cancleHideGroupAPI : hideGroupAPI;

                    this.loadingHide = true;
                    api({
                        id: this.groupId,
                    })
                        .then(res => {
                            const response = res.data;

                            if (response.code === 1000) {
                                this.$message({
                                    type: 'success',
                                    message: `${this.isHideGroup ? '取消隐藏' : '隐藏'}成功！`,
                                });
                                this.$emit('refresh-list');
                                this.$emit('back-list');
                                this.closeForm();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: response.msg,
                                });
                            }
                            this.loadingHide = false;
                        })
                        .catch(err => {
                            this.loadingHide = false;
                        });
                })
                .catch(() => {});
        },
        /**
         * 关闭窗口
         */
        closeForm() {
            this.$emit('close-form');
        }
    },
    mounted() {
        if (this.actionType === 'edit') {
            this.getGroupDetailInfo();
        }
    }
};
</script>

<style scoped lang="less">
.option-title-wrapper {
    margin-bottom: 20px;
    padding-bottom: 20px;
    overflow: hidden;
    border-bottom: 1px solid #e8e8e8;
}
.content-edit {
    width: 500px;
}
.msg--detail-group {
    line-height: 4;
    font-size: 14px;
    color: #606266;
}
.title--content-item {
    margin-right: 50px;
}
.publish-time {
    margin-left: 80px;
}
.poster-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    max-height: 178px;
    line-height: 178px;
    text-align: center;
}
.poster {
    width: 178px;
    height: 178px;
    display: block;
}
.poster-wrapper {
    width: 178px;
    max-height: 200px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    text-align: center;
    overflow: auto;

    &:hover {
        border-color: #409EFF;
    }
}
</style>