import request from '@/utils/request';
import { VisualizationItem } from './data';

export async function saveOrUpdate(params: VisualizationItem) {
    return request(`/jetlinks/visualization`, {
        method: 'PATCH',
        data: params,
    });
}

export async function getLayout(params: any) {
    return request(`/jetlinks/visualization/${params.type}/${params.target}`, {
        method: 'GET',
    })
}

