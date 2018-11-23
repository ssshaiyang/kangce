<!-- 应用顶部 -->
<template>
    <header class="system-header">
        <div class="title-system">
            819运营端
        </div>
        <div class="options child-vhc">
            <el-dropdown trigger="click" @command="selectUserOption">
                <div class="user-msg el-dropdown-link">
                    {{username}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="password">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <span class="timer">
                {{dateCounter}}
            </span>
        </div>

        <!-- 修改密码表单 -->
        <el-dialog
        title="修改密码"
        :append-to-body="true"
        :visible.sync="modelShow"
        width="500px">
            <password-edit :form-reset="modelShow" @close-form="modelShow = false" @logout-system="logoutSystem"></password-edit>
        </el-dialog>
    </header>
</template>
<script>
const PasswordEdit = () => import('./PasswordEdit.vue');

import moment from 'moment'

export default {
    name: "",
    data() {
        return {
            dateCounter: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), // 时间初始化
            username: localStorage.getItem('username'),
            modelShow: false,
        };
    },
    components: {
        PasswordEdit,
    },
    methods: {
        /**
         * 用户操作下拉菜单选择
         */
        selectUserOption(command) {
            switch (command) {
                case 'password':
                    this.modelShow = true;
                    break;
                case 'logout':
                    this.logoutSystem();
                    break;
                default:
                    break;
            }
        },
        /**
         * 登出操作
         */
        logoutSystem() {
            this.$store.commit('moduleLogin/logout');
            this.$router.push('/login');
        },
    },
    mounted() {
        // 系统时间显示
        this.timer = setInterval(() => {
            this.dateCounter = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
}
</script>

<style scoped="scoped" lang="less">
.system-header {
    width: 100%;
    padding: 10px 32px;
    position: fixed;
    color: #fff;
    background: #222;

    &:after,
    &:before {
        content: '';
        width: 0;
        height: 0;
        display: block;
        clear: both;
    }
}
.title-system {
    float: left;
}
.options {
    float: right;

    .timer {
        margin-left: 20px;
    }
    .user-msg {
        color: #fff;
        cursor: pointer;
        &:hover {
            color: #409eff;
        }
    }
}
</style>