interface ListData<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    total: number;
}
interface ApiResponse<T> {
    code: string,
    result: ListData<T> | any,
    status: number
}