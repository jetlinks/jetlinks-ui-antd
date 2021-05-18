import request from '@/utils/request';

export async function list(params?: any) {
    ///jetlinks/permission/_query/for-grant
    return request(`/jetlinks/autz-setting/_query/no-paging`, {
        method: 'GET',
        params,
    });
}

export async function setAutz(params: any) {
    return request(`/jetlinks/autz-setting`, {
        method: 'PATCH',
        data: params,
    });
}

export async function saveAutz(params: any) {
    return request(`/jetlinks/autz-setting/detail/_save`, {
        method: 'POST',
        data: params
    })
}

export async function autzDetail(params: { type: string, id: string }) {
    return request(`/jetlinks/autz-setting/detail/${params.type}/${params.id}`, {
        method: 'GET'
    })
}