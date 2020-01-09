import request from '@/utils/request';

export async function list(params?: any) {
    return request(`/jetlinks/autz-setting/_query/no-paging`, {
        method: 'GET',
        params: params,
    });
}
