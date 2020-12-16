import { defer, from } from "rxjs";
import request from "@/utils/request";
import { map } from "rxjs/operators";
import BaseService from "@/services/crud";

class Service extends BaseService<any>{
    public captchaConfig = () => defer(
        () => from(request(`/jetlinks/authorize/captcha/config`, {
            method: 'GET',
            errorHandler: () => {
                // 未开启验证码 不显示验证码
            }
        })).pipe(
            map(resp => resp?.result),
        ));

    public getCaptcha = () => defer(
        () => from(request(`/jetlinks/authorize/captcha/image?width=130&height=40`, {
            method: 'GET',
        })).pipe(
            map(resp => resp.result)
        ));

    public queryCurrent = () => defer(
        () => from(request('/jetlinks/authorize/me',{
            method: 'GET'
        })).pipe(
            map(resp => resp)
        ));
}

export default Service;