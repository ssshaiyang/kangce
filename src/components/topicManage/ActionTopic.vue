<template>
    <div v-loading="loadingGlobal">
        <div class="option-title-wrapper">
            <h3 class="fl-l">{{actionType === 'edit' ? '编辑' : '新增'}}话题</h3>
            <div class="options fl-r">
                <el-button v-if="actionType === 'edit'" size="small" type="danger" @click="deleteTopic" v-loading="loadingDelete">删除</el-button>
                <el-button size="small" type="primary" @click="oprateTopic" v-loading="loadingOption">保存</el-button>
                <el-button size="small" @click="closeForm">返回</el-button>
            </div>
        </div>

        <el-form class="content-edit" ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
            <div class="msg--detail-topic" v-if="actionType === 'edit'">
                <span class="title--content-item">话题ID</span>{{topicId}}                
            </div>
            
            <el-form-item prop="publishTime" label="发布时间">
                <el-date-picker
                v-model="form.publishTime"
                :clearable="false"
                type="datetime"
                placeholder="选择发布时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
            </el-form-item>

            <el-form-item prop="title" label="话题标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>

            <el-form-item label="话题海报" prop="imgUrl">
                <p style="color: skyblue;">请上传图片比例为31：13的图片</p>
                <div class="poster-wrapper">
                    <el-upload
                    class="poster-uploader"
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

            <el-form-item prop="topicType" label="话题类型">
                <el-radio-group v-model="form.topicType" @change="changeTopicType">
                    <el-radio :label="1">投票话题</el-radio>
                    <el-radio :label="2">普通话题</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item v-if="form.topicType === 1" prop="tag" label="投票标签">
                <el-select v-model="form.tag" placeholder="请选择">
                    <el-option
                    label="支持/反对"
                    :value="1">
                    </el-option>
                    <el-option
                    label="正确/错误"
                    :value="2">
                    </el-option>
                    <el-option
                    label="喜欢/不喜欢"
                    :value="3">
                    </el-option>
                </el-select>
                <p>当前投票标签为：<span style="color: gray;">{{tabLabel[form.tag]}}</span></p>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    imgUploadAPI,
} from '@/api/globalAPI';
import {
    initTopicEditInfoAPI,
    modifyTopicAPI,
    deleteTopicAPI,
    addTopicAPI,
} from '@/api/topicManageAPI'

export default {
    name:'',
    data() {
        return {
            form: {
                publishTime: '',
                title: '',
                imgUrl: '',
                topicType: 1,
                tag: 1,
            },
            rules: {
                publishTime: [
                    {required: true, message: '请选择发布时间', trigger: 'blur'},
                ],
                title: [
                    {required: true, message: '请输入话题标题', trigger: 'blur'},
                ],
                imgUrl: [
                    {required: true, message: '请上传话题海报', trigger: 'blur'},
                ],
                topicType: [
                    {required: true, message: '请选择话题类型', trigger: 'blur'},
                ],
                tag: [
                    {required: true, message: '请选择投票标签', trigger: 'blur'},
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
        };
    },
    props: {
        actionType: {
            required: 'true',
        },
        topicId: {
            type: Number,
        },
    },
    methods: {
        /**
         * 获取话题详情
         */
        getTopicDetailInfo() {
            this.loadingGlobal = true;
            initTopicEditInfoAPI({
                id: this.topicId,
            })
                .then(res => {
                    const response = res.data.data;
                    
                    this.form = {
                        publishTime: response.publishTime,
                        title: response.title,
                        imgUrl: response.imgUrl,
                        topicType: response.topicType,
                        tag: response.tag,
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
         * 话题类型改变时
         * @param {Number} value 话题值
         */
        changeTopicType(value) {
            this.form.tag = value === 1 ? 1 : 0;
        },
        /**
         * 添加或编辑话题
         */
        oprateTopic() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const api = this.actionType === 'edit' ? modifyTopicAPI : addTopicAPI;
                    
                    this.loadingOption = true;
                    api({
                        ...this.form
                    }, this.topicId)
                        .then(res => {
                            const response = res.data;

                            if (response.code === 1000) {
                                this.$message({
                                    type: 'success',
                                    message: '编辑成功！',
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
        deleteTopic() {
            this.$confirm('是否要删除这个话题？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.loadingDelete = true;
                    deleteTopicAPI({
                        id: this.topicId,
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
         * 关闭窗口
         */
        closeForm() {
            this.$emit('close-form');
        }
    },
    mounted() {
        if (this.actionType === 'edit') {
            this.getTopicDetailInfo();
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
.msg--detail-topic {
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
    max-height: 500px;
    line-height: 178px;
    text-align: center;
}
.poster {
    width: 500px;
    height: 178px;
    display: block;
}
.poster-wrapper {
    width: 506px;
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