import request from '@/utils/request';

export async function list(params?: any) {
    return request(`/jetlinks/opc/client/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function listNoPaging(params?: any) {
    return request(`/jetlinks/opc/client/_query/no-paging?paging=false`, {
        method: 'GET',
        params: params,
    });
}

export async function save(params: any) {
    return request(`/jetlinks/opc/client`, {
        method: 'POST',
        data: params,
    });
}

export async function update(params: any) {
    return request(`/jetlinks/opc/client/${params.id}`, {
        method: 'PUT',
        data: params,
    });
}

export async function remove(id: string) {
    return request(`/jetlinks/opc/client/${id}`, {
        method: 'DELETE',
    });
}

export async function start(id: string) {
    return request(`/jetlinks/opc/client/${id}/_enable`, {
        method: 'POST',
    });
}

export async function stop(id: string) {
    return request(`/jetlinks/opc/client/${id}/_disable`, {
        method: 'POST',
    });
}

export async function getDeviceBindList(params: any) {
    return request(`/jetlinks/opc/device-bind/device-details/_query`, {
        method: 'GET',
        params
    });
}
export async function getDeviceBindListNoPaging(params: any) {
    return request(`/jetlinks/opc/device-bind/device-details/_query/no-paging?paging=false`, {
        method: 'GET',
        params
    });
}

export async function getDevicePointList(params: any) {
    return request(`/jetlinks/opc/device-bind/points/_query`, {
        method: 'GET',
        params
    });
}

export async function removeBind(id: string) {
    return request(`/jetlinks/opc/device-bind/${id}`, {
        method: 'DELETE',
    });
}
//批量解绑
export async function removeManyBind(opcUaId: string, params: any) {
    return request(`/jetlinks/opc/device-bind/batch/${opcUaId}/_delete`, {
        method: 'POST',
        data: params
    });
}

export async function startBind(id: string) {
    return request(`/jetlinks/opc/device-bind/${id}/_enable`, {
        method: 'POST',
    });
}

export async function stopBind(id: string) {
    return request(`/jetlinks/opc/device-bind/${id}/_disable`, {
        method: 'POST',
    });
}

export async function savePoint(params: any) {
    return request(`/jetlinks/opc/device-bind/points`, {
        method: 'POST',
        data: params
    });
}

export async function clusterList() {
    return request(`jetlinks/cluster/nodes`, {
        method: 'GET'
    });
}

export async function saveOrUpdate(params: any) {
    return request(`/jetlinks/opc/device-bind/_create`, {
        method: 'PATCH',
        data: params,
    });
}

export async function saveDevice(params: any) {
    return request(`/jetlinks/opc/device-bind/_create`, {
        method: 'POST',
        data: params,
    });
}
//设备全部开始采集
export async function startAllDevice(clientId: string) {
    return request(`/jetlinks/opc/device-bind/${clientId}/batch/_enable`, {
        method: 'POST'
    });
}
//批量绑定数据
export async function bindManyDevice(params: any) {
    return request(`/jetlinks/opc/device-bind/batch/_create`, {
        method: 'POST',
        data: params
    });
}
//启动点位
export async function startPoint(deviceId: string, params: any) {
    return request(`/jetlinks/opc/device-bind/points/${deviceId}/_start`, {
        method: 'POST',
        data: params
    });
}

//停止点位
export async function stopPoint(deviceId: string, params: any) {
    return request(`/jetlinks/opc/device-bind/points/${deviceId}/_stop`, {
        method: 'POST',
        data: params
    });
}
//删除点位
export async function delPoint(deviceId: string, pointIds: string[]) {
    return request(`/jetlinks/opc/device-bind/batch/${deviceId}/point/_delete`, {
        method: 'POST',
        data: pointIds
    });
}
