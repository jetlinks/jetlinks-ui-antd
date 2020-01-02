export interface RuleModelItem {
    createTime: number;
    creatorId: string;
    description: string;
    id: string;
    modelMeta: string;
    modelType: string;
    modifierId: string;
    modifierIdProperty: string;
    modifyTime: number;
    name: string;
    version: number;
    option?: 'update' | 'copy' | 'add'
}
