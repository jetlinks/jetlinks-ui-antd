import { CommonEnum, SimpleType } from "@/utils/common";

export class DeviceInstance extends SimpleType {
    id: string;
    name: string;
    describe: string;
    productId: string;
    productName: string;
    security: any;
    deriveMetadata: string;
    state: CommonEnum;
    creatorId: string;
    creatorName: string;
    createTime: string;
    registryTime: string;
    disabled?: boolean;
}

export interface DeviceInstancePagination {
    total: number;
    pageSize: number;
    current: number;
}

export interface DeviceInstanceListData {
    list: DeviceInstance[];
    pagination: Partial<DeviceInstancePagination>;
}
