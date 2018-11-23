/**
 * @author weichaozhan
 * @description 登陆相关
 */

const LOGIN = 'login';
const LOGOUT = 'logout';

const moduleLogin = {
    namespaced: true,
    state: {
        isLogin: false,
    },
    mutations: {
        /**
         * 改变状态为登陆
         * @param {Object} state
         */
        [LOGIN](state) {
            state.isLogin = true;
        },
        /**
         * 改变状态为登出
         * @param {Object} state
         */
        [LOGOUT](state) {
            localStorage.removeItem('token');
            localStorage.removeItem('rid');
            localStorage.removeItem('username');

            state.isLogin = false;
        }
    }
};

export default moduleLogin;