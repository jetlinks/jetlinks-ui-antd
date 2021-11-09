import http from "../../service/http";

const Service = {
    getlist(params?:any){
        return http.get(`/jetlinks/user/_query`,params)
    }
}
export default Service;