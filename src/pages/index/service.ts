import http from "../../service/http";

const Service = {
    getlist(parms?:any){
        return http.get('/jetlinks/user/_query?pageSize=10',parms)
    }
}
export default Service;