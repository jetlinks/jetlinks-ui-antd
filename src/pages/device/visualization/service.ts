import request from '@/utils/request';
import { VisualizationItem } from './data';
import { async } from 'rxjs/internal/scheduler/async';

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

export async function getDashboardData(params: any[]) {
    return request(`/jetlinks/dashboard/_multi`, {
        method: 'POST',
        data: params
    })
}
