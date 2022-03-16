import request from '@/utils/request';

export async function getChanelList(params?: any) {
    return request(`/jetlinks/modbus/master/_query`, {
        method: 'POST',
        data: params
    });
}

export async function updataChanel(params: any) {
    return request(`/jetlinks/modbus/master`, {
        method: 'PATCH',
        data: params
    });
}

export async function removeChanel(id: string) {
    return request(`/jetlinks/modbus/master/${id}`, {
        method: 'DELETE'
    });
}

export async function bindDevice(masterId: string, data: any) {
    return request(`/jetlinks/modbus/master/${masterId}/_bind`, {
        method: 'POST',
        data
    });
}

export async function unbindDevice(masterId: string, data: any) {
    return request(`/jetlinks/modbus/master/${masterId}/_unbind`, {
        method: 'POST',
        data
    });
}

export async function getDeviceList(data: any) {
    return request(`/jetlinks/device-instance/_query`, {
        method: 'POST',
        data
    });
}

export async function saveMetadataConfig(master: string, deviceId: string, data: any) {
    return request(`/jetlinks/modbus/master/${master}/${deviceId}/metadata`, {
        method: 'POST',
        data
    });
}

export async function queryMetadataConfig(master: string, deviceId: string, data: any) {
    return request(`/jetlinks/modbus/master/${master}/${deviceId}/metadata/_query`, {
        method: 'POST',
        data
    });
}

export async function removeMetadataConfig(metadataId: string) {
    return request(`/jetlinks/modbus/master/metadata/${metadataId}`, {
        method: 'DELETE'
    });
}