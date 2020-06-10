export interface TenantItem {
    id: string;
    name: string;
    type: string;
    state: any;
    members: number;
    photo: string;
    createTime: number;
    description: string
}

export interface TenantEntity {
    members: number,
    tenant: {
        id: string,
        name: string,
        type: string,
        state: any,
    }
}


export interface Member {
    avatar: string;
    name: string;
    id: string;
}
