import BaseService from "@/services/crud";
import { defer, from } from "rxjs";
import request from "@/utils/request";
import { map, filter } from "rxjs/operators";

class Service extends BaseService<any>{

    public start = (id: string) => defer(
        () => from(request(`${this.uri}/${id}/start`, {
            method: 'POST'
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result),
        ));

    public stop = (id: string) => defer(
        () => from(request(`${this.uri}/${id}/stop`, {
            method: 'POST'
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result),
        ));

    public remove = (id: string) => defer(
        () => from(request(`${this.uri}/${id}`, {
            method: 'DELETE',
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result),
        ));

    public state = (id: string) => defer(
        () => from(request(`${this.uri}/${id}/state`, {
            method: 'GET',
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result),
        ));

    public sessions = (id: string, pageSize: number, pageIndex: number) => defer(
        () => from(request(`${this.uri}/${id}/sessions/${pageSize * pageIndex}/${pageSize}`, {
            method: 'GET',
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result),
        ));

    public sendMessage = (id: string, sessionId: string, data: any) => defer(
        () => from(request(`${this.uri}/${id}/${sessionId}`, {
            method: 'POST',
            data
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result),
        ));
}

export default Service;