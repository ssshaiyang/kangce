const CHANGE_ACTIVE_ITEM = 'changeActiveItem';

const menu = {
    namespaced: true,
    state: {
        itemActiveIndex: '', // 激活的菜单项 index
    },
    mutations: {
        /**
         * 修改激活的菜单和 tab，若需要跳转页面，传入对应的 id 即可，
         * 如：this.$store.commit('menu/changeActiveItem', 11)
         * @param {Object} state 
         * @param {Number|String} payload 传入的值
         */
        [CHANGE_ACTIVE_ITEM](state, payload) {
            state.itemActiveIndex = payload + '';
        },
    }
};

export default menu;