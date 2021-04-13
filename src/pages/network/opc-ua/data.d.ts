export interface OpcUaItem {
    state: any;
    id: string;
    name: string;
    description: string;
    clientConfigs: [
        {
            endpoint: string;
            securityPolicy: string;
            securityMode: string;
            trustKeyStorePwd: string;
            certId: string;
            username: string;
            password: string;
        }
    ]
}