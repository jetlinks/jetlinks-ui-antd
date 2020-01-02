export interface HttpClientItem {
    id: string;
    name: string;
    description: string;
    state: {
        text: string;
        value: string;
    },
    certificateId: string;
    baseUrl: string;
    httpHeaders: HeaderItem[]
}

export interface HeaderItem {
    key: string;
    value: string;
    description: string;
}