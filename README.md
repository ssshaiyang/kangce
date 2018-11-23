# 说明

## 安装依赖

安装 npm 淘宝镜像

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
```
cnpm install
```

## 命令

### 本地开发服务
```bash
# 端口 3001
npm run serve
```

### 本地 mock 服务
```bash
# 端口 9091
npm run mock
```

### 启动 本地开发服务 + 本地 mock 服务
```
npm run start
```

### 编译生产
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

## 项目目录

```javascript
+ mockServer // mock 服务
+ src
    + api // 接口目录
        - globalAPI.js // 全局接口
        - homeAPI.js // 首页接口
    
    + assets // 资源目录
        + images // 图片
    
    + components // 组件目录
        + appHeader // APP 顶部 bar 条
        + charts // 公用图表
        + homePage // 首页
        + mainContent // 内容区域容器
        + menu // 菜单
        - Index.vue // 系统内容入口
        - LoginPage.vue // 登陆页
        - NotFound.vue // 404 页面
        ...
        ...
        ...
    + public // 公用 js
        - constant.js // 常量
        - http.js // axios 封装
    + router // 路由
    + store // vuex 状态管理
    + stykes // 公用样式
    ...
    ...
    ...
```

## 一些说明

```
    src/public/constant.js

    菜单：
    export const MENU_LIST

    菜单对应组件：
    export const APP_COMPONENTS

```

```javascript

    // 权限控制
    // src/components/menu/Index.vue
    /**
     * 构建对应权限菜单
     */
    buildAuthNav() {
        getAuthListAPI()
            .then(res => {
                let authList = res.data.data.map(item => item.subModuleName);

                function buildNewMenu(arrayDone) {
                    let newArray = [];

                    arrayDone.forEach((item, index) => {
                        if (item.children && item.children.length > 0) {
                            let newChildren = buildNewMenu(item.children);

                            if (newChildren.length > 0) {
                                newArray.push(Object.assign({}, item, {
                                    children: newChildren,
                                }));
                            }
                        } else {
                            if (authList.indexOf(item.name) > -1) {
                                newArray.push(item);
                            }
                        }
                    });

                    return newArray;
                }

                let newMenu = buildNewMenu(MENU_LIST);

                this.menuList = newMenu;
            })
    },

    created() {
        this.menuList = MENU_LIST; // 开发时不控制权限，生产注释
        // this.buildAuthNav(); // 生产环境菜单权限
    },

```

```javascript

    // 常用方法
    
    // store/modules/menu.js
    /**
    * 修改激活的菜单和 tab，若需要跳转页面，传入对应的 id 即可，
    * 如：this.$store.commit('menu/changeActiveItem', 11)
    * @param {Object} state 
    * @param {Number|String} payload 传入的值
    */
    [CHANGE_ACTIVE_ITEM](state, payload) {
        state.itemActiveIndex = payload + '';
    },
    
```