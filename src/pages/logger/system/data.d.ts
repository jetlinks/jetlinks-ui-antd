export interface SystemLoggerItem {
    id: string;
    className: string;
    context: any;
    createTime: number;
    exceptionStack: string;
    level: string;
    lineNumber: number;
    message: string;
    methodName: string;
    name: string;
    threadId: string;
    threadName: string;
}
