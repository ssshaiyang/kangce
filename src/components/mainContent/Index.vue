<!-- 内容主题 Tab -->
<template>
    <el-tabs class="el-tab--app-content" v-model="tabActive" type="card" @tab-click="clickTab" @tab-remove="removeTab">
        <el-tab-pane
        v-for="item in tabList"
        :key="item"
        :label="tabObj[item].name"
        :name="item"
        :lazy="true"
        :closable="item !== 'home'"
        >
            <app-components style="width:100%;" :tab-active="item" :tab-list="tabObj"></app-components>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
// app 系统内容组件
const AppComponents = () => import('./contentComponents.vue');

import {
    MENU_LIST,
} from '@/public/constant';

import { mapMutations } from 'vuex';

export default {
    name:'',
    data() {
        return {
            menuMap: {}, // 菜单映射，方便取值
            tabObj: {
                'home': {
                    name: '首页',
                    componentName: 'HomePage',
                },
            }, // 标签内容
            tabList: ['home',], // 标签数组，控制顺序
            tabActive: 'home',
        };
    },
    components: {
        AppComponents,
    },
    computed: {
            itemActiveIndex() {
                return this.$store.state.menu.itemActiveIndex;
            },
    },
    watch: {
        /**
         * 导航点击触发选项卡变化
         */
        itemActiveIndex(newValue) {
            if (newValue) {
                const msg = this.menuMap[newValue];
                
                if (Object.keys(this.tabObj).indexOf(newValue) === -1) {
                    this.tabList.push(newValue);
                    this.$set(this.tabObj, newValue, {
                        name: msg.name,
                        componentName: msg.componentName,
                    });
                }
                // 激活当前选项卡
                this.tabActive = newValue;
            }
        },
    },
    methods: {
        /**
         * 映射 mutations
         */
        ...mapMutations('menu', {
            changeActiveItem: 'changeActiveItem',
        }),
        /**
         * 选项卡点击后修改导航激活的项目
         * @param {Object} tabSelected 被选中的标签 tab 实例
         */
        clickTab(tabSelected) {
            if (tabSelected.name !== 'home') {
                this.changeActiveItem(tabSelected.name);
            } else {
                this.changeActiveItem('');
            }
        },
        /**
         * 点击 tab 移除按钮后触发
         * @param {String} tabRemoveName 被删除的标签的 name
         */
        removeTab(tabRemoveName) {
            if (tabRemoveName !== 'home') {
                let tabs = [...this.tabList];
                const indexRemove = tabs.indexOf(tabRemoveName);

                this.tabList.splice(indexRemove, 1);
                //如果关闭的tab为激活状态，关闭后激活显示前一个 tab 和导航
                if (this.tabActive === tabRemoveName) {
                    let currentIndex = tabs.indexOf(tabRemoveName);

                    this.tabActive = tabs[currentIndex - 1];
                    // 当关闭标签后，只剩 “首页” 标签，菜单置为无激活状态
                    this.changeActiveItem(currentIndex - 1 === 0 ? '' : this.tabActive);
                }
                this.$delete(this.tabObj, tabRemoveName);
            } else {
                this.changeActiveItem('');
            }
        },
    },
    created() {
        /**
         * 重构菜单为映射，方便取值
         */
        const createMenuMap = (menuList) => {
            menuList.forEach(item => {
                if (item.children && item.children.length > 0) {
                    createMenuMap(item.children);
                } else {
                    this.menuMap[item.id] = { ...item };
                }
            });
        }

        createMenuMap(MENU_LIST);
    },
}
</script>

<style lang="less">
.el-tab--app-content {
    .el-tabs__header {
        margin-bottom: 0;
    }
    .el-tabs__content {
        width: 100%;
        position: absolute;
        top: 41px;
        bottom: 0;
        overflow: auto;
    }
}
</style>