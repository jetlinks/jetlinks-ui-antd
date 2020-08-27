import { defer, from } from "rxjs";
import request from "@/utils/request";
import { map } from "rxjs/operators";
import BaseService from "@/services/crud";

class Service extends BaseService<any>{
    public captchaConfig = () => defer(
        () => from(request(`/jetlinks/authorize/captcha/config`, {
            method: 'GET',
        })).pipe(
            map(resp => resp.result),
        ));

    public getCaptcha = () => defer(
        () => from(request(`/jetlinks/authorize/captcha/image?width=130&height=40`, {
            method: 'GET',
        })).pipe(
            map(resp => resp.result)
        ));
}

export default Service;
