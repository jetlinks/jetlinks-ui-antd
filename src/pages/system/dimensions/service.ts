import request from "@/utils/request";
import { DimensionType, DimensionsItem } from "./data";

export async function treeList(params?: any) {
    return request(`/jetlinks/dimension/_query/tree`, {
        method: 'GET',
        params: params,
    });
}

export async function saveOrUpdate(params: DimensionsItem) {
    return request(`/jetlinks/dimension`, {
        method: 'PATCH',
        data: params,
    });
}

export async function deleteDimension(id: string) {
    return request(`/jetlinks/dimension/${id}`, {
        method: 'DELETE',
    })
}

// export async function add(params: any) {
//     return request(`/jetlinks/permission`, {
//         method: 'PATCH',
//         data: params,
//     });
// }


//====================type
export async function typeList(params?: any) {
    return request(`/jetlinks/dimension-type/all`, {
        method: 'GET',
        params: params,
    });
}

export async function saveOrUpdateType(params: DimensionType) {
    return request(`/jetlinks/dimension-type`, {
        method: 'PATCH',
        data: params,
    })
}

export async function deleteDimensionTypeById(id: string) {
    return request(`/jetlinks/dimension-type/${id}`, {
        method: 'DELETE'
    })
}

//===========setting
export async function saveOrUpdateDimensionUser(params: any) {
    return request(`/jetlinks/dimension-user`, {
        method: 'PATCH',
        data: params,
    });
}

export async function addDimensionUser(params: any) {
    return request(`/jetlinks/dimension-user`, {
        method: 'PATCH',
        data: params,
    });
}

export async function deleteByUserAndDimensionId(params: any) {
    return request(`/jetlinks/dimension-user/user/${params.userId}/dimension/${params.dimensionId}`, {
        method: 'DELETE',
    });
}

export async function deleteByUserId(params: any) {
    return request(`/jetlinks/dimension-user/user/${params.userId}`, {
        method: 'DELETE',
    });
}


export async function query(params?: any) {
    return request(`/jetlinks/autz-setting/_query/no-paging`, {
        method: 'GET',
        params: params,
    });
}

export async function deleteByDimension(id: string) {
    return request(`/jetlinks/dimension-user/dimension/${id}`, {
        method: 'DELETE',
    });
}

export async function queryAutz(params: any) {
    return request(`/jetlinks/autz-setting/_query/no-paging`, {
        method: 'GET',
        params: params,
    });
}

export async function saveAutzSetting(params?: any) {
    return request(`/jetlinks/autz-setting`, {
        method: 'PATCH',
        data: params,
    });
}