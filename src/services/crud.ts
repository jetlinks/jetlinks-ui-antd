
import { map, catchError } from 'rxjs/operators';
import { of, Observable, from } from "rxjs";
import request from '@/utils/request';

interface BaseServie<T> {
    query(params: any): Observable<any>;
    save(params: T): Observable<any>;
    remove(id: string): Observable<any>;
    update(params: Partial<T>): Observable<any>;
}
/**
 * T 实体
 * U 接口
 */
class Service<T> implements BaseServie<T>{

    protected uri: string;

    constructor(uri: string) {
        this.uri = `/jetlinks/${uri}`
    }

    public query = (params: any) => from(request(`${this.uri}/_query`, {
        method: 'GET',
        params
    })).pipe(map((response: ApiResponse<T>) => response)
        , catchError(error => of(error)));

    public save = (params: Partial<T>) => from(request(this.uri, {
        method: 'POST',
        data: params
    })).pipe(map((response: ApiResponse<T>) => response),
        catchError(error => of(error)));

    public remove = (id: string) => from(request(`${this.uri}/${id}`, {
        method: 'DELETE',
    })).pipe(map((response: ApiResponse<T>) => {
        if (response.status === 200) {
            return response
        }
        console.log(response)

    }),
        catchError(error => of(error)));

    public update = (params: Partial<T>) => from(request(this.uri, {
        method: 'PUT',
        data: params
    })).pipe(map((response: ApiResponse<T>) => response),
        catchError(error => of(error)));

    public saveOrUpdate = (params: Partial<T>) =>
        params && params.id ? this.update(params) : this.save(params);

}

export default Service;