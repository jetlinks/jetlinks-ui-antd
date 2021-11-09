import http from "../../service/http";

const Service = {
      //获取设备列表
    getDeviceList(params?:any){
        return http.get(`/jetlinks/device-instance/_query`,params)
    }
}
export default Service;