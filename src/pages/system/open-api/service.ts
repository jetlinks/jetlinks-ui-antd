import request from "@/utils/request";
import { OpenApiItem } from "./data";

export async function list(params: any) {
    return request(`/jetlinks/open-api/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function remove(id: string) {
    return request(`/jetlinks/open-api/${id}`, {
        method: 'DELETE',
    });
}

export async function add(params: OpenApiItem) {
    return request(`/jetlinks/open-api`, {
        method: 'POST',
        data: params,
    })
}
export async function update(params: OpenApiItem) {
    return request(`/jetlinks/open-api`, {
        method: 'PATCH',
        data: params,
    })
}
