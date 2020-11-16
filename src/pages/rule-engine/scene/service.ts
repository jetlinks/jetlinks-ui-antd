import BaseService from "@/services/crud";
import { defer, from } from "rxjs";
import request from "@/utils/request";
import { map, filter } from "rxjs/operators";

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

    public getDevice = (params: any) => defer(
        () => from(request(`/jetlinks/device-instance/_query/no-paging`, {
            method: 'GET',
            params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public notifyTypes = () => defer(
        () => from(request(`/jetlinks/notifier/config/types`, {
            method: 'GET'
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));
}

export default Service;