import request from '@/utils/request';

export async function query(params: any){
    return request(`/jetlinks/visualization/catalog/_query`,{
        method: 'GET',
        params,
    })
}

export async function queryNoPaging(params: any){
    return request(`/jetlinks/visualization/catalog/_query/no-paging`,{
        method: 'GET',
        params,
    })
}

export async function query_tree(params: any){
    return request(`/jetlinks/visualization/catalog/_query/tree`,{
        method: 'GET',
        params,
    })
}

export async function update(params: any){
    return request(`/jetlinks/visualization/catalog`,{
        method: 'PATCH',
        data: params,
    })
}

export async function save(params: any){
    return request(`/jetlinks/visualization/catalog`,{
        method: 'POST',
        data: params,
    })
}

export async function remove(id: any){
    return request(`/jetlinks/visualization/catalog/${id}`,{
        method: 'DELETE'
    })
}

