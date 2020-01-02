export interface CoapClientItem {
    id: string;
    name: string;
    state: {
        text: string;
        value: string;
    };
    timeout: 2000;
    url: string;
    certificateId: string;
    description: string;
}
