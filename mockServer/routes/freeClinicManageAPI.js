/**
 * 义诊管理接口
 * @author weichaozhan
 */
const Mock = require('mockjs');

module.exports = function (router, koaBody) {
    // 获取义诊管理列表
    router.get('/treatment/getList', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code": 1000,
            "msg": "ok",
            "time": "2018-10-08 10:34:50",
            "data": [
                {
                    "id": 2,
                    "date": "2018-11-12",
                    "docList": [
                        {
                            "id": 1,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        },
                        {
                            "id": 2,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        }
                    ],
                },
                {
                    "id": 3,
                    "date": "2018-11-13",
                    "docList": [
                        {
                            "id": 31,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        },
                        {
                            "id": 32,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        }
                    ],
                },
                {
                    "id": 4,
                    "date": "2018-11-14",
                    "docList": [
                        {
                            "id": 41,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        },
                        {
                            "id": 32,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        }
                    ],
                },
                {
                    "id": 5,
                    "date": "2018-11-15",
                    "docList": [
                        {
                            "id": 51,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        },
                        {
                            "id": 52,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        }
                    ],
                },
                {
                    "id": 6,
                    "date": "2018-11-18",
                    "docList": [
                        {
                            "id": 1,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        },
                        {
                            "id": 2,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        }
                    ],
                },
                {
                    "id": 7,
                    "date": "2018-11-19",
                    "docList": [
                        {
                            "id": 1,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        },
                        {
                            "id": 2,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        }
                    ],
                },
                {
                    "id": 8,
                    "date": "2018-11-20",
                    "docList": [
                        {
                            "id": 1,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        },
                        {
                            "id": 2,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        }
                    ],
                },
                {
                    "id": 9,
                    "date": "2018-11-21",
                    "docList": [
                        {
                            "id": 1,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        },
                        {
                            "id": 2,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        }
                    ],
                },
                {
                    "id": 10,
                    "date": "2018-11-22",
                    "docList": [
                        {
                            "id": 1,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        },
                        {
                            "id": 2,
                            "docName": "李狗",
                            "positionalTitle": "主任医师",
                            "hospitalName": "北京市朝阳区豆各庄医院",
                        }
                    ],
                },
             ]
          });
        ctx.body = data;
        await next();
    });
    
    // 获取医生列表
    router.get('/treatment/doctorList', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code": 1000,
            "msg": "ok",
            "time": "2018-10-16 16:13:07",
            "data": {
                "data": [
                    {
                        "docId": 88,
                        "docName": "饼干",
                        "phone": "15266666666",
                        "hospitalName": "杭州市人民医院",
                        "firstLevelDepartmentName": "内科",
                        "secondLevelDepartmentName": "消化内科",
                    },
                    {
                        "docId": 90,
                        "docName": "翁键",
                        "phone": "15266666667",
                        "hospitalName": "杭州市精神医院",
                        "firstLevelDepartmentName": "外科",
                        "secondLevelDepartmentName": "皮肤科",
                    }
                ],
                "totalCount": 2
            }
        });

        ctx.body = data;
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    });

    // 获取医生异常列表
    router.get('/treatment/abnormalList/:docId', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code": 1000,
            "msg": "ok",
            "time": "2018-10-30 17:38:33",
            "data": {
                "data|5": [
                    {
                        "abnormalTime": "2018-11-13",
                        "abnormalReason": "响应异常12小时内未回复"
                    },
                ],
                "totalCount": 10
            }
         });

        ctx.body = data;
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    });

    // 获取义诊设置的数值
    router.get('/treatment/getSettingNum', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code": 1000,
            "msg": "ok",
            "time": "2018-11-14 14:29:56",
            "data": {
                "price": "15",
                "minInquisitionNum": 3,
                "maxInquisitionNum": 12,
            }
        });

        ctx.body = data;
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    });

    // 义诊设置
    router.post('/treatment/set', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code":1000,
            "msg":"ok",
            "time":"2018-09-20 15:41:00",
            "data":[]
        });

        ctx.body = data;
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    });

    // 添加义诊医生
    router.post('/treatment/addDoctor', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code":1000,
            "msg":"ok",
            "time":"2018-09-20 15:41:00",
            "data":[]
        });

        ctx.body = data;
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    });

    // 移除义诊医生
    router.delete('/treatment/delDoctor/:treatmentDocId', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code":1000,
            "msg":"ok",
            "time":"2018-09-20 15:41:00",
            "data":[]
        });

        ctx.body = data;
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    });
};