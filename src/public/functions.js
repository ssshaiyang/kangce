/**
 * 通用函数
 * @author weichaozhan 
 */

/**
 * 获取字符串长度，双字节字符长度为2
 * @param {String} str 要计算的字符串
 * @returns {Number} 字符串长度
 */
export function getStringRealLength(str) {
    let realLength = 0;
    let length = str.length;
    let charCode = null;

    for (var i = 0; i < length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128)
            realLength += 1;
        else
            realLength += 2;
    }
    return realLength;
}