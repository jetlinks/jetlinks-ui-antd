import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any> {

    public getDescriptionList = (params: any) => defer(
        () => from(request(`/jetlinks/property-calculate-rule/description`, {
            method: 'GET',
            params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));
}
export default Service;