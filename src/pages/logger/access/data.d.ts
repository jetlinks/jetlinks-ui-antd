
export interface AccessLoggerItem {
    id: string;
    context: any;
    describe: string;
    exception: string;
    httpHeaders: any;
    httpMethod: string;
    ip: string;
    method: string;
    parameters: any;
    requestTime: number;
    responseTime: number;
    target: string;
    url: string;
    action: string;
}
