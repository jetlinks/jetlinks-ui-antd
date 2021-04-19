
import { getAccessToken } from "@/utils/authority";
import { Observable } from "rxjs";
import { } from "rxjs/operators";
import { message, notification } from "antd";

let ws: WebSocket | undefined;
let count = 0;
const subs = {};
let timer: any = {};
const initWebSocket = () => {
    clearInterval(timer);
    const wsUrl = `${document.location.protocol.replace('http', 'ws')}//${document.location.host}/jetlinks-edge/messaging/${getAccessToken()}?:X_Access_Token=${getAccessToken()}`;
    if (!ws && count < 5) {
        try {
            count += 1;
            ws = new WebSocket(wsUrl);
            ws.onclose = () => {
                ws = undefined;
                setTimeout(initWebSocket, 5000 * count);
            }
            ws.onmessage = (msg: any) => {

                const data = JSON.parse(msg.data);
                if (data.type === 'error') {
                    notification.error({ key: 'wserr', message: data.message });
                }
                if (subs[data.requestId]) {
                    if (data.type === 'complete') {
                        subs[data.requestId].forEach((element: any) => {
                            element.complete();
                        });;
                    } else if (data.type === 'result') {
                        subs[data.requestId].forEach((element: any) => {
                            element.next(data)
                        });;
                    }
                }
            }
        } catch (error) {
            setTimeout(initWebSocket, 5000 * count);
        }
    }
    timer = setInterval(() => {
        try {
            ws?.send(JSON.stringify({ "type": "ping" }))
        } catch (error) {
            console.error(error, '发送心跳错误');
        }
    }, 2000);
    return ws;
}

export const getWebSocket = (id: string, topic: string, parameter: any): Observable<any> =>
    new Observable<any>(subscriber => {
        if (!subs[id]) {
            subs[id] = [];
        }
        subs[id].push({
            next: (val: any) => {
                subscriber.next(val);
            },
            complete: () => {
                subscriber.complete();
            }
        });
        const msg = JSON.stringify({ id, topic, parameter, type: 'sub' });
        const thisWs = initWebSocket();
        const tempQueue: any[] = [];

        if (thisWs) {
            try {
                if (thisWs.readyState === 1) {
                    thisWs.send(msg);
                } else {
                    tempQueue.push(msg);
                }

                if (tempQueue.length > 0 && thisWs.readyState === 1) {
                    tempQueue.forEach((i: any, index: number) => {
                        thisWs.send(i);
                        tempQueue.splice(index, 1);
                    });
                }
            } catch (error) {
                initWebSocket();
                message.error({ key: 'ws', content: 'websocket服务连接失败' });
            }
        }

        return () => {
            const unsub = JSON.stringify({ id, type: "unsub" });
            delete subs[id];
            if (thisWs) {
                thisWs.send(unsub);
            }
        }
    });
