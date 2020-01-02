

export interface ItemType {
    title: string;
    key: string;
    items: Item[];
}

export interface Item {
    id: string;
    type: string;
    size: string;
    shape: string;
    src: string;
    model: ItemModel;
}

export interface ItemModel {
    color: string;
    label: string;
    executor: string;
}