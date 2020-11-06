import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any>{

    public queryProduct = (params: any) => defer(
        () => from(request(`/jetlinks/device/product/_query/no-paging?paging=false`, {
            method: 'GET',
            params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public productTypes = () => defer(
        () => from(request(`/jetlinks/dueros/product/types`, { method: 'GET' }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result)
            ));
}

export default Service;
