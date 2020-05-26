import { async } from "rxjs/internal/scheduler/async";
import request from "@/utils/request";
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from "rxjs";
import { getAccessToken } from "@/utils/authority";

interface BaseServie<T> {
    query(params: any): T[];
    save(params: T): any;
    update(params: Partial<T>): any;
    remove(ids: string[]): any;
}

class Service<T, U> {

    public save = (params: any) => ajax({
        url: 'http://demo.jetlinks.cn/jetlinks/user/_query',
        method: 'GET',
        headers: {
            'X-Access-Token': getAccessToken(),
        },
        body: JSON.stringify(params)
    })
        .pipe(map((reponse: any) => reponse),
            catchError(error =>
                // console.log(error);
                of(error)
            ))

    // query(params: any): T[] {
    //     throw new Error("Method not implemented.");
    // }

    // update(params: Partial<T>) {
    //     throw new Error("Method not implemented.");
    // }
    // remove(ids: string[]) {
    //     throw new Error("Method not implemented.");
    // }

}

export default Service;