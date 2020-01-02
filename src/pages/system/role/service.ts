import request from "@/utils/request";
import { RoleItem } from "./data";

export async function list(params: any) {
    return request(`/jetlinks/role/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function remove(id: string) {
    return request(`/jetlinks/role/${id}`, {
        method: 'DELETE',
    });
}

export async function add(params: RoleItem) {
    return request(`/jetlinks/role`, {
        method: 'POST',
        data: params,
    })
}
export async function update(params: RoleItem) {
    return request(`/jetlinks/role`, {
        method: 'PATCH',
        data: params,
    })
}
