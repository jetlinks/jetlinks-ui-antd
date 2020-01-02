
export interface DimensionType {
    id: string;
    name: string;
    describe: string;
}

export interface DimensionsItem {
    id: string;
    name: string;
    describe: string;
    level: number;
    path: string;
    sortIndex: number;
    typeId: string;
    typeName: string;
}

export interface DimensionsSetting {
    id: string;
    permission: string;
    state: number;
    dimensionType: string;
    actions?: string[];
    dimensionTarget: string;
    dimensionTargetName?: string;
    dimensionTypeName?: string;
    dataAccesses?: any[];
}