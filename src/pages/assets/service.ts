import request from '@/utils/request';

export async function BindAssets(assetType: string, params: any) {
    return request(`/jetlinks/assets/bind/${assetType}`, {
        method: 'POST',
        data: params,
    });
}

export async function UnBindAssets(assetType: string, params: any) {
    return request(`/jetlinks/assets/unbind/${assetType}`, {
        method: 'POST',
        data: params,
    });
}