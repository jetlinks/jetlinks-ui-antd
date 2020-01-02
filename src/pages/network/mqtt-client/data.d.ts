export interface MqttItem {
    id: string;
    name: string;
    description: string;
    certificateId: string;
    clientId: string;
    host: string;
    port: number;
    status: number;
    secureConfiguration: {
        username: string;
        password: string;
    };
}
