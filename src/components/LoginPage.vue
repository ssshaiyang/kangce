<!-- 登陆页面 -->
<template>
    <div class="child-vhc wrapper--login">
        <div class="form--login">
            <el-form ref="formLogin" :model="formLogin" :rules="rules">
                <el-form-item prop="username">
                    <el-input v-model="formLogin.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="formLogin.password" type="password"></el-input>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item prop="code" @keyup.enter.native="submitLoginForm">
                            <el-input v-model="formLogin.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <!-- 获取验证码 -->
                        <div class="captcha--wrapper child-vhc">
                        <img ref="ads" @click="this.getCaptcha"></div>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="submitLoginForm">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {mapMutations, mapState, mapActions} from 'vuex'

import {BASE_URL} from '@/public/constant'
import {loginAPI, getCaptchaAPI} from '@/api/globalAPI'

export default {
    name: 'HelloWorld',
    data() {
        return {
            codeImg: null,
            formLogin: {
                username: '',
                password: '',
                code: ''
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                ],
                code: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }
                ],
            },
        };
    },
    methods: {
        /**
         * 获取验证码
         */
        getCaptcha() {
            this.$refs.ads.setAttribute('src', `${BASE_URL}/captcha?t=${Date.now()}`)
        },

        /**
         * 提交登陆操作
         */
        submitLoginForm() {
            const formLogin = {
                ...this.formLogin
            }

            this.$refs.formLogin.validate(valid => {
                if (valid) {
                    loginAPI(formLogin).then(res => {
                        const {code, data, msg} = res.data

                        if (code === 1000) {
                            localStorage.setItem('token', data.token)
                            localStorage.setItem('rid', data.tid)
                            localStorage.setItem('username', formLogin.username)

                            this.$message({type: 'success', message: '登陆成功！'})
                            // 改变登录状态为已登录
                            this
                                .$store
                                .commit('moduleLogin/login')
                            // 跳转到应用
                            this
                                .$router
                                .push('/')
                        } else {
                            this.$message({type: 'error', message: msg})
                        }
                    })
                }
            })
        }
    },
    mounted() {
        this.getCaptcha()
    }
}
</script>

<style scoped="scoped" lang="less">
    .wrapper--login {
        width: 100%;
        min-height: 500px;
        position: absolute;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url("../assets/images/bg.jpg") center no-repeat;
        background-size: cover;
    }
    .form--login {
        width: 400px;
        min-height: 200px;
        padding: 30px 20px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 6px;
    }
    .captcha--wrapper {
        height: 40px;

        img {
            height: 100%;
            background: #fff;
        }
    }
</style>