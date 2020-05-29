import { Subject, from, of } from "rxjs";
import { flatMap, map, catchError, filter } from "rxjs/operators";
import request from "@/utils/request";
import { ApiResponse } from "@/services/response";
import { root$ } from "@/data";
import { ajax } from 'rxjs/ajax';
import { ajaxGet } from "rxjs/internal/observable/dom/AjaxObservable";
import { getAccessToken } from "@/utils/authority";

const test = {
    // query: (params: any) =>
    //     from(request(`/jetlinks/authorize/me`, params))
    //         .pipe(
    //             filter(i => i.status === 200),
    //             flatMap(user =>
    //                 root$.pipe(
    //                     map(root => ({ ...root, user })),
    //                     catchError(err => of(err)))
    //             )),
    query: (params: any) =>
        ajax({
            url: '/jetlinks/authorize/me',
            method: 'GET',
            headers: {
                'X-Access-Token': getAccessToken()
            }
        }).pipe(
            filter(i => i.status === 200),
            flatMap(user =>
                root$.pipe(
                    map(root => ({ ...root, user })),
                    catchError(err => of(err))
                ))
        ),
};

export default test;