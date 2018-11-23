/**
 * 社区管理：话题管理 mock 数据
 * @author weichaozhan
 */
const Mock = require('mockjs');
const xlsx = require('node-xlsx');

module.exports = function (router, koaBody) {
    // 获取话题列表
    router.get('/community/topicList', koaBody(), async (ctx, next) => {
        let params = {};
        let paramsA = ctx.request.url.split('?')[1].split('&').map(item => {
            return item.split('=');
        });

        paramsA.forEach(item => {
            params[item[0]] = item[1];
        });

        let listObj = {
            [`data|${params.limit}`]: [{
                "id|+1": 1,
                "title": /([a-z][A-Z][0-9]){6}/,
                "publishTime|1": ["2018-09-16", "2018-09-17", "2018-09-16", "2018-08-16", "2017-09-16"],
                "browseCount|1": [100,200,300,4,10,50,56,66,98,12],
                "focusCount|1": [100,200,300,4,10,50,56,66,98,12],
                "commentCount|1":  [100,200,300,4,10,50,56,66,98,12],
                "favoriteCount|1":  [100,200,300,4,10,50,56,66,98,12],
            }],
            "totalCount": 200,
        };

        const data = Mock.mock({
            "code": 1000,
            "msg": "ok",
            "data": listObj,
        });
        
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                ctx.body = data;
                resolve();
            }, 1000);
        });
    });

    // 导出话题数据
    router.get('/community/topic/export', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "data|100": [{
                "id|+1": 1,
                "title": /([a-z][A-Z][0-9]){6}/,
                "publishTime|1": ["2018-09-16", "2018-09-17", "2018-09-16", "2018-08-16", "2017-09-16"],
                "browseCount|1": [100,200,300,4,10,50,56,66,98,12],
                "focusCount|1": [100,200,300,4,10,50,56,66,98,12],
                "commentCount|1":  [100,200,300,4,10,50,56,66,98,12],
                "favoriteCount|1":  [100,200,300,4,10,50,56,66,98,12],
            }],
        });
        let bufferData = [];

        data.data.forEach(item => {
            let value = [];

            for (let i in item) {
                value.push(item[i]);
            }
            bufferData.push(value);
        });

        let buffer = xlsx.build([{name: "mySheetName", data: bufferData}]);
        
        ctx
            .response
            .set('content-type', 'application/vnd.ms-excel');
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                ctx.body = buffer;
                resolve();
            }, 1000);
        });
    });

    // 查看话题
    router.get('/community/topic/check/:id', koaBody(), async (ctx, next) => {
        const data = Mock.mock({
            "code": 1000,
            "msg": "ok",
            "time": "2018-11-01 16:36:15",
            "data": {
                "id": 12,
                "title": /([a-z][A-Z][0-9]){2}/,
                "publishTime|1": ["2018-09-16", "2018-09-17", "2018-09-16", "2018-08-16", "2017-09-16"],
                "imgUrl|1": ['http://photocdn.sohu.com/20121202/Img359230432.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541159639441&di=d27759bab1943ab1c1354dafb36aa399&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F1%2F5791e7d3b1a02.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541159664081&di=b8ba9ebc5e4ab67d2f83509da3923aee&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201506%2F08%2F20150608153107_tHAjf.jpeg'],
                "tag|1": [0,1,2,3],
                "poll": {
                    "support|1": [100,1,22,4,57,8,12,546,456],
                    "oppose|1": [100,1,22,4,57,8,12,546,456],
                    "pollCount|1": [100,1,22,4,57,8,12,546,456],
                },
                "count": {
                    "browseCount": /[0-9]{1,4}/,
                    "focusCount": /[0-9]{1,4}/,
                    "commentCount": /[0-9]{1,4}/,
                    "favoriteCount": /[0-9]{1,4}/,
                },
            },
        });
        
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                ctx.body = data;
                resolve();
            }, 1000);
        });
    });
};