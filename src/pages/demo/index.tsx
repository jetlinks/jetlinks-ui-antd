import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { fromEvent, from, of, Observable } from "rxjs";
import request from "@/utils/request";
import { map, catchError, flatMap, filter } from "rxjs/operators";
import { ApiResponse } from "@/services/response";
import test from "./service";
import Service from "@/services/crud";
import { root$ } from "@/data";

const Demo = () => {
    const service = new Service<any>('dimension-user');
    const [data, setData] = useState<ApiResponse<any>>();

    const ur = root$.pipe();

    const renderList = (params: Observable<any>) => {
        params
            .subscribe(user => {
                console.log(user, 'ureee');
                setData(user);
            })

    }
    return (
        <div>
            <Button id="test-btn" onClick={() => renderList(service.query({}))}>测试</Button>
            123
            { JSON.stringify(data)}
        </div >
    )
}
export default Demo;