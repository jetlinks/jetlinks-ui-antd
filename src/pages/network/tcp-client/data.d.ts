export interface MqttItem {
    id: string;
    name: string;
    description: string;
    host: string;
    port: number;
    status: number;
    clientId: string;
    secureConfiguration: {
        username: string;
        password: string;
    };
}
