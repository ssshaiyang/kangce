/**
 * vuex 示例
 * @author weichaozhan
 */
const AM = 'am';

const moduleA = {
    namespaced: true,
    state: {
        a: 2,
    },
    mutations: {
        [AM](state) {
            state.a++;
        },
    },
    actions: {
        am(context) {
            setTimeout(() => {
                context.commit(AM);
                console.log('moduleA a:', context.state.a);
            }, 1000);
        },
    },
    getters: {
        aAdd(state) {
            return state.a + 1;
        },
    }
};

export default moduleA;