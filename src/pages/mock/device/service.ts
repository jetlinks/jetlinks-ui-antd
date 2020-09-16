import BaseService from "@/services/crud";
import { defer, from } from "rxjs";
import request from "@/utils/request";
import { map, filter } from "rxjs/operators";

class Service extends BaseService<any>{
    public create = (params: any) => defer(() => from(request(`/jetlinks/tenant/_create`, {
        method: 'POST',
        data: params
    })).pipe(
        map(resp => resp.result),
    ));

    public list = (params: any) => defer(() => from(request(`/jetlinks/tenant/detail/_query`, {
        method: 'GET',
        params
    })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
        map(result => {
            const temp = result;
            temp.data = result.data.
                map((i: any) => ({ members: i.members, ...i.tenant }))
            return temp;
        })
    ));

    // public 
}

export default Service;