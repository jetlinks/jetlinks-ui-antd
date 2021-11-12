import { getFileInfo } from "@tarojs/taro";
import http from "../../service/http";

const Service = {
    //获取设备列表
    getDeviceList(params?: any) {
        return http.get(`/jetlinks/device-instance/_query`, params)
    },
    //获取设备详情
    getInfo(id:string){
        return http.get(`/jetlinks/device/instance/${id}/detail`)
    }
}
export default Service;