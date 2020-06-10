export interface ListData<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    total: number;
}
export interface ApiResponse<T> {
    code: string,
    result: ListData<T> | any,
    status: number
}