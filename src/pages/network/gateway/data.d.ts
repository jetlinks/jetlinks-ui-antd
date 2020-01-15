export interface GatewayItem {
    id: string;
    name: string;
    provider: string;
    state: {
        text: string,
        value: string
    },
    networkId: string;
    configuration: any;
    describe: string;
}

export interface GatewayPagination {
    total: number;
    pageSize: number;
    current: number;
}

export interface GatewayData {
    list: GatewayItem[];
    pagination: Partial<GatewayPagination>;
}

export interface GatewayParams {

}