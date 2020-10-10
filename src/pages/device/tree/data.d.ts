export interface GroupItem {
    id: string;
    parentId?: string;
    path?: string;
    sortIndex?: number;
    level?: number;
    name: string;
    description?: string;
    children?: GroupItem[]
}