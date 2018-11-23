// 本地服务
// export const BASE_URL = 'http://localhost:9091';
// 后端开发服务
// export const BASE_URL = 'http://192.168.1.180/819_operation'; // 雷文杰
// export const BASE_URL = 'http://192.168.1.179/operation_backend'; // 章圣明
// 测试服务
export const BASE_URL = 'http://819operationapi.j7w5.net';
// 内测服务
// export const BASE_URL = 'http://819operationapi.j7w5.cn';
// 开发后端
// export const BASE_URL = 'http://operation.api.819.kc';
// 内测服务
// export const BASE_URL = 'http://819operationapi.j7w5.cn';

// 定义 APP 内容组件名称
export const APP_COMPONENTS = {
    // 首页
    HomePage: () => import('../components/homePage/Index.vue'),
    
    // 审核管理：医生审核管理
    ReviewDoctorManage: () => import('../components/reviewDoctorManage/Index.vue'),
    // 审核管理：医院审核管理
    ReviewHospitalManage: () => import('../components/reviewHospitalManage/Index.vue'),
    // 审核管理：医生签名审核管理
    ReviewSignatureManage: () => import('../components/reviewSignatureManage/Index.vue'),
    
    // 用户管理：医生用户管理
    DoctorUserManage: () => import('../components/doctorUserManage/Index.vue'),
    // 用户管理：患者用户管理
    PatientUserManage: () => import('../components/patientUserManage/Index.vue'),

    //系统管理: 账号管理
    UserAdmin:  ()  =>  import('../components/systemManagement/UserAdminstration.vue'),
    // 系统管理--内容系统管理--科室数据展示
    DepartmentDataDisplay: () => import('../components/departmentDataDisplay/Index.vue'),
    //系统管理：协议管理
    AgreementManage:() => import('../components/agreementManage/Index.vue'),
    // APP审核管理
    AppReviewManage: () => import('../components/appReviewManage/Index.vue'),

    //数据管理：咨询管理
    InformationManage: () => import('../components/informationManage/Index.vue'),
    //数据管理：儿童疫苗管理
    ChildrenVaccine: () => import('../components/childVaccine/VaccineExamine.vue'),
    //数据管理：行为标签管理
    LabelPage: () => import('../components/labelExamine/LabelExamine.vue'),
    //数据管理：接诊设置管理
    DoctorPrice: () =>  import('../components/doctorPricerange/DoctorPricerange.vue'),
    //数据管理：科室数据管理(即内容管理)
    ContentManage: () => import('../components/contentManage/Index.vue'),
    // 数据管理：义诊管理
    FreeClinicManage: () => import('../components/freeClinicManage/Index.vue'),
    
    // 财务管理：用户交易管理
    AccountUserDeal: () => import('../components/accountUserDeal/Index.vue'),
    // 财务管理：结算管理
    AccountSettleManage: () => import('../components/accountSettleManage/Index.vue'),
    

    // 社区管理：话题管理
    TopicManage: () => import('../components/topicManage/Index.vue'),
    // 社区管理：小组管理
    GroupManage: () => import('../components/groupManage/Index.vue'),
    // 社区管理：敏感词管理
    SensitiveWord:() => import('../components/sensitiveWord/sensitiveWordExamine.vue'),
    // 社区管理： 举报管理
    ReportManage:() => import('../components/reportManage/reportExamine.vue'),
    // 社区管理：动态管理
    TrendManage:() => import('../components/trendManage/Index.vue'),

    // 404 页面
    NotFound: () => import('../components/NotFound.vue'),
};

// 菜单列表
// 注意：id 不可重复
export const MENU_LIST = [
    {
        id: 1,
        name: '审核管理',
        icon: 'el-icon-message',
        children: [
            {
                id: 11,
                name: '医生审核管理',
                icon: 'el-icon-news',
                componentName: 'ReviewDoctorManage',
            },
            {
                id: 12,
                name: '医院审核管理',
                icon: 'el-icon-date',
                componentName: 'ReviewHospitalManage',
            },
            {
                id: 13,
                name: '医生签名审核管理',
                icon: 'el-icon-bell',
                componentName: 'ReviewSignatureManage',
            },
        ],
    },
    {
        id: 2,
        name: '用户管理',
        icon: 'el-icon-time',
        children: [
            {
                id: 21,
                name: '医生用户管理',
                icon: 'el-icon-service',
                componentName: 'DoctorUserManage',
            },
            {
                id: 22,
                name: '患者用户管理',
                icon: 'el-icon-view',
                componentName: 'PatientUserManage',
            },
        ],
    },
    {
        id: 3,
        name: '数据管理',
        icon: 'el-icon-time',
        children: [
            {
                id: 31,
                name: '资讯管理',
                icon: 'el-icon-news',
                componentName: 'InformationManage',
            },
            {
                id: 32,
                name: '儿童疫苗管理',
                icon: 'el-icon-news',
                componentName: 'ChildrenVaccine',
            },
            {
                id: 33,
                name: '行为标签管理',
                icon: 'el-icon-tickets',
                componentName: 'LabelPage',
            },
            {
                id: 34,
                name: '接诊设置管理',
                icon: 'el-icon-time',
                componentName: 'DoctorPrice',
            },
            {
                id: 35,
                // name: '内容管理',
                name: '科室数据管理',
                icon: 'el-icon-news',
                componentName: 'ContentManage',
            },
            {
                id: 36,
                name: '义诊管理',
                icon: 'el-icon-date',
                componentName: 'FreeClinicManage',
            },
        ],
    },
    {
        id: 4,
        name: '医生社区管理',
        icon: 'el-icon-view',
        children: [
            {
                id: 41,
                name: '话题管理',
                icon: 'el-icon-star-on',
                componentName: 'TopicManage',
            },
            {
                id: 42,
                name: '小组管理',
                icon: 'el-icon-picture-outline',
                componentName: 'GroupManage',
            },
            {
                id: 43,
                name: '动态管理',
                icon: 'el-icon-news',
                componentName: 'TrendManage',
            },
            {
                id: 44,
                name: '举报管理',
                icon: 'el-icon-time',
                componentName: 'ReportManage',
            },
            {
                id: 45,
                name: '敏感词管理',
                icon: 'el-icon-sold-out',
                componentName: 'SensitiveWord',
            },
        ],
    },
    {
        id: 5,
        name: '财务管理',
        icon: 'el-icon-star-off',
        children: [
            {
                id: 51,
                name: '用户交易管理',
                icon: 'el-icon-refresh',
                componentName: 'AccountUserDeal',
            },
            {
                id: 52,
                name: '结算管理',
                icon: 'el-icon-edit-outline',
                componentName: 'AccountSettleManage',
            },
        ],
    },
    {
        id: 6,
        name: '系统管理',
        icon: 'el-icon-location',
        children: [
            {
                id: 61,
                name: '账号管理',
                icon: 'el-icon-news',
                componentName: 'UserAdmin',
            },
            {
                id: 62,
                name: '协议管理',
                icon: 'el-icon-news',
                componentName: 'AgreementManage',
            },
            {
                id: 63,
                name: '科室数据展示',
                icon: 'el-icon-star-off',
                componentName: 'DepartmentDataDisplay',
            },
            {
                id: 64,
                name: 'APP审核管理',
                icon: 'el-icon-star-on',
                componentName: 'AppReviewManage',
            },
        ],
    },
];


// 社区管理--话题管理--标签
export const TAG_MAP = {
    1: '支持/反对',
    2: '正确/错误',
    3: '喜欢/不喜欢',
};

// 周几文字
export const WEEK_TEXT = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
};
