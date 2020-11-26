import request from '@/utils/request';

export async function query_tree(params: any){
    return request(`/jetlinks/device/category/_tree`,{
        method: 'GET',
        params,
    })
}

export async function update(params: any){
    return request(`/jetlinks/device/category`,{
        method: 'PATCH',
        data: params,
    })
}

export async function save(params: any){
    return request(`/jetlinks/device/category`,{
        method: 'POST',
        data: params,
    })
}

export async function remove(id: any){
    return request(`/jetlinks/device/category/${id}`,{
        method: 'DELETE'
    })
}

