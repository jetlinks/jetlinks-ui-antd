export interface UserDetail {
    id: string,
    name: string,
    email: string,
    telephone: string;
    avatar: string;
    description: string;
    createTime: number;
    tenants: {
        tenantId?: string
    }[];
}

export interface Notification {
    id: string;
    subscriberType: string;
    subscriber: string;
    topicProvider: string;
    subscribeName: string;
    topicName: string;
    topicConfig: {
        productId: string;
        deviceId: string;
        alarmId: string;
    },
    state: {
        text: string;
        value: string;
    }
}

export interface NotificationProvider {
    id: string;
    name: string;
    metadata: {
        properties: {
            description: string;
            name: string;
            property: string;
        }[]
    };
}