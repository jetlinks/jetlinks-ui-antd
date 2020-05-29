import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { fromEvent, from, of, Observable } from "rxjs";
import request from "@/utils/request";
import { map, catchError, flatMap, filter } from "rxjs/operators";
import { ApiResponse } from "@/services/response";
import test from "./service";

const Demo = () => {
    const [data, setData] = useState<ApiResponse<any>>();

    const renderList = (params: Observable<any>) => {
        params
            .subscribe(user => setData(user))
    }
    return (
        <div>
            <Button id="test-btn" onClick={() => renderList(test.query({}))}>测试</Button>
            123
            {JSON.stringify(data)}
        </div>
    )
}
export default Demo;