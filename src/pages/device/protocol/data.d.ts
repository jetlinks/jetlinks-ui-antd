export interface ProtocolItem {
    id: string;
    name: string;
    description?: string;
    type: string;
    state: number;
    configuration: {
        provider?: string;
        location?: string;
        transport?: string[];
        lang?: string;
        protocol?: string;
        script?: string
    }
}
