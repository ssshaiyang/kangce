/**
 * 义诊管理 公用函数
 *  @author weichaozhan
 * */ 

import moment from 'moment';

/**
 * 根据选择的时间计算出该周的周一和周日
 * @param {String|Date} date 要计算的日期，不传为当天日期所在周
 * @returns {Array} 返回数组第一个为周一日期，第二个为周日日期
 */
export const computeWeek = (date = new Date()) => {
    let startTime = Date.parse(date);
    let endTime = Date.parse(date);

    while(new Date(startTime).getDay() !== 1) {
        startTime -= 8.64e7;
    }
    startTime = new Date(startTime)

    while(new Date(endTime).getDay() !== 0) {
        endTime += 8.64e7;
    }
    endTime = new Date(endTime);

    return [moment(startTime).format('YYYY-MM-DD'), moment(endTime).format('YYYY-MM-DD')];
}

/**
 * 补全一周数据
 * @param {Array} listData 周列表
 * @param {Number} tableType 1:下周，2:当前周
 */
export const completeWeekList = (listData, tableType) => {
    let startDate;
    const newList = [null, null, null, null, null, null, null];

    if (listData.length > 0) {
        startDate = computeWeek(listData[0].date)[0];
    } else {
        startDate = tableType === 2 ? computeWeek()[0] : computeWeek(new Date(Date.now() + 8.64e7 * 7))[0]
    }
    
    newList.forEach((itemN, index) => {
        const listFilt = listData.filter(item => {
            const weekDay = (new Date(item.date)).getDay() || 7;
            
            return (weekDay - 1 === index);
        })
        
        newList[index] = listFilt.length > 0 ? listFilt[0] : {
            id: '',
            date: moment(startDate).add(index, 'd').format('YYYY-MM-DD'),
            docList: [],
        };
    });

    return newList;
};