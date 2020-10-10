import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { map } from "rxjs/operators";



class Service extends BaseService<any>{

    public groupTree = (param: any) => defer(
        () => from(request(`/jetlinks/device/group/_query/tree`, {
            method: 'GET',
        })).pipe(
            map(resp => resp.result)
        ));

}

export default Service;
