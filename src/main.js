import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from '@/App.vue';
import echarts from 'echarts';

import store from '@/store';
import router from '@/router';

Vue.use(ElementUI);
Vue.config.productionTip = false;

Vue.prototype.$echarts = echarts;

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');