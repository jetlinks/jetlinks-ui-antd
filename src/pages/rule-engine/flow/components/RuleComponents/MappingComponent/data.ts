
export interface MappingConfig {
    keepSourceData?: boolean;
    mappings: Mapping[];
}

export interface Mapping {
    key: string;
    source: string;
    target: string;
    type: MappingType;
}

export enum MappingType {
    int, double, decimal, boolean, date,
}
