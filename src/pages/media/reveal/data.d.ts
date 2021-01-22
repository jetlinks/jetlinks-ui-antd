export interface DataNode {
    title: string;
    key: string;
    isLeaf?: boolean;
    icon: any;
    deviceId: string,
    channelId: string,
    children?: DataNode[];
}