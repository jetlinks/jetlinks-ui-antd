import request from "@/utils/request";
import { DeviceInstance } from "./data";
import { getAccessToken } from "@/utils/authority";

export async function list(params: any) {
    return request(`/jetlinks/device-instance/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function info(id: string) {
    return request(`/jetlinks/device-instance/info/${id}`, {
        method: 'GET',
    });
}

export async function saveOrUpdate(params: DeviceInstance) {
    return request(`/jetlinks/device-instance`, {
        method: 'PATCH',
        data: params,
    });
}

export async function remove(id: string) {
    return request(`/jetlinks/device-instance/${id}`, {
        method: 'DELETE',
    });
}

export async function logs(params: any) {
    return request(`/jetlinks/device-instance/operation/log`, {
        method: 'GET',
        params: params,
    });
}

export async function runInfo(id: string) {
    return request(`/jetlinks/device-instance/run-info/${id}`, {
        method: 'GET',
    });
}

export async function properties(productId: string, id: string) {
    return request(`/jetlinks/device-instance/${productId}/${id}/properties`, {
        method: 'GET',
    });
}

export async function fireAlarm(params: any) {
    return request(`/jetlinks/device-product/${params.protocol}/event/fire_alarm`, {
        method: 'GET',
        params: params.param,
    })
}

export async function changeDeploy(params: any) {
    return request(`/jetlinks/device-instance/${params.type}/${params.id}`, {
        method: 'POST'
    })
}


// export async function deployAll() {
//     return request(`/jetlinks/device-instance/deploy`, {
//         method: 'GET',
//         params: {
//             _: 1,
//             ':X_Access_Token': getAccessToken()
//         }
//     })
// }