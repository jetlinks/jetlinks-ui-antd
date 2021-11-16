import http from "../../service/http";

const Service = {
    //获取设备列表
    getDeviceList(params?: any) {
        return http.get(`/jetlinks/device-instance/_query`, params)
    },
    //获取设备详情
    getInfo(id:string){
        return http.get(`/jetlinks/device/instance/${id}/detail`)
    },
    //获取告警记录
    getAlarmLog(params: any){
        return http.get(`/jetlinks/device/alarm/history/_query`, params)
    },
    //处理告警
    handleAlarm(id: string,data:any){
        return http.put(`/jetlinks/device/alarm/history/${id}/_solve`,data)
    }
}
export default Service;