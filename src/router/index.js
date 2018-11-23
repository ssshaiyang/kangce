import Vue from 'vue';
import vueRouter from 'vue-router';

import store from '@/store';

Vue.use(vueRouter);

const Home = resolve => require(['../components/Index'], resolve);
const LoginPage = resolve => require(['../components/LoginPage'], resolve);
const NotFound = resolve => require(['../components/NotFound'], resolve);

const routes = [
    // 后台内容
    {
        name: 'Home',
        path: '/',
        component: Home,
    },
    // 登陆
    {
        name: 'login',
        path: '/login',
        component: LoginPage,
    },
    // 404
    {
        name: '/notFound',
        path: '*',
        meta: {
            requireAuth: true,
        },
        component: NotFound,
    },
]
const router = new vueRouter({routes});

if (localStorage.getItem('token') || localStorage.getItem('rid')) {
    store.commit('moduleLogin/login');
}

router.beforeEach((to, from, next) => {
    if (!store.state.moduleLogin.isLogin && to.path !== '/login') {
        next('/login');
    } else {
        next();
    }
})
export default router;