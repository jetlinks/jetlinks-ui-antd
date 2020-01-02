export interface EmailItem {
    id: string;
    name: string;
    description: string;
    host: string;
    port: number;
    sender: string;
    username: string;
    password: string;
    configuration: any[];
}
