const Mock = require('mockjs');
const createCaptcha = require('../utils/captcha');

module.exports = function (router, koaBody) {
    // 登陆
    router.post('/users/login', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code": 1000,
            "msg": "ok",
            "time": "2018-10-17 10:04:10",
            "data": {
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjEsInJpZCI6MSwiZXhwIjoxNTQwMDAxM" +
                        "DUwfQ.HvgH0kwy6feQoen0gvedThCI9sT7TgXZnMVAAiqGfjM",
                "rid": 1,
            },
        });
        ctx.body = data;
        await next();
    });
    
    // 验证码
    router.get('/captcha', koaBody(), async (ctx, next) => {
        ctx
            .response
            .set('content-type', 'image/png');
        ctx.body = createCaptcha();

        await next();
    });

    // 获取医生详细信息
    router.get('/member/doctor/detail/:docId', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code": 1000,
            "msg": "ok",
            "time": "2018-09-27 14:38:00",
            "data": {
                "docId": 72,
                "docName": "小沫",
                "nickname": "小沫",
                "avatar": "http://img2.3lian.com/2014/gif/10/9/17.jpg",
                "viceAvatar": "",
                "status": 1,
                "positionalTitle": "医师",
                "hospitalId": 30606,
                "hospitalName": "联发医院",
                "doctorDepRank": 1,
                "phone": "17764590492",
                "evaluationScore": "0.0",
                "departmentId": 60,
                "departmentName": "大海啊",
                "careerAge": 15,
                "workHour": 1.522,
                "surplusHour": 298.478,
                "postingNum": 0,
                "commentNum": 0,
                "replyNum": 0
            }
          });
        ctx.body = data;
        await next();
    });
};