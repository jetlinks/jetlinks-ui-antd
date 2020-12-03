import request from '@/utils/request';

export async function list(params?: any) {
    return request(`/jetlinks/device/aliyun/bridge/_query`, {
        method: 'GET',
        params,
    });
}

export async function productList(params: any) {
    return request(`/jetlinks/device/product/_query/no-paging?paging=false`, {
        method: 'GET',
        params
    })
}

//消息协议
export async function protocolSupport() {
    return request(`/jetlinks/protocol/supports`, {
        method: 'GET',
    });
}

export async function getProducts(params:any) {
    return request(`/jetlinks/device/aliyun/bridge/products/_query`, {
        method: 'POST',
        data: params
    });
}

export async function getDevices(params:any) {
    return request(`/jetlinks/device/aliyun/bridge/devices/_query`, {
        method: 'POST',
        data: params
    });
}

export async function remove(id:string) {
    return request(`/jetlinks/device/aliyun/bridge/${id}`, {
        method: 'DELETE',
    });
}

export async function save(params:any) {
    return request(`/jetlinks/device/aliyun/bridge`, {
        method: 'PATCH',
        data: params
    });
}

export async function getNodesList() {
    return request(`/jetlinks/cluster/nodes`, {
        method: 'GET',
    });
}
//启用
export async function setEnabled(id: string) {
    return request(`/jetlinks/device/aliyun/bridge/${id}/enable`,{
        method: 'POST'
    })
}

//禁用
export async function setDisabled(id: string) {
    return request(`/jetlinks/device/aliyun/bridge/${id}/disable`,{
        method: 'POST'
    })
}