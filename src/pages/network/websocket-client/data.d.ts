export interface WebsocketClientItem {
    id: string;
    name: string;
    certificateId: string;
    description: string;
    host: string;
    port: number;
    state: {
        text: string;
        value: string;
    };
    uri: string;
}
