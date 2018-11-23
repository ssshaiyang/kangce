/**
 * 本模块的公用数据
 */
import Vue from 'vue';

 const Buss = new Vue({
     data: {
        isHideGroup: false, // 操作的是否为隐藏的小组
        isMidnightGroup: false, // 操作的是否为深夜小组
     },
 });

/**
 * 监听事件：修改是否为隐藏的小组
 */
Buss.$on('changeIsHideGroup', (bool) => {
    Buss.isHideGroup = bool;
});

/**
 * 监听事件：修改是否为深夜小组
 */
Buss.$on('changeGroupType', (bool) => {
    Buss.isMidnightGroup = bool;
});

 export default Buss;
