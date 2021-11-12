
const formatNumber = (item:any) => {
    item = item.toString()
    return item[1] ? item : '0' + item
}
/**
 * 时间戳转化为年 月 日 时 分 秒
 * timestamp: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function FormatTime(timestamp:number, format:string) {

    const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    let returnArr = [];

    let date = new Date(timestamp);
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    returnArr.push(year, month, day, hour, minute, second);

    returnArr = returnArr.map(formatNumber);

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;

}
export default FormatTime;