import Taro from "@tarojs/taro";
import getBaseUrl from "../service/baseUrl";
import getToken from "./getToken";


let ws: Taro.SocketTask | undefined;
let count = 0;
let timer: any = {};


const initWebSocket = () => {
    clearInterval(timer);
    const wsUrl = `${getBaseUrl('/jetlinks/messaging').replace('http', 'ws')}/jetlinks/messaging/${getToken()}?:X_Access_Token=${getToken()}`;
    if (!ws && count < 5) {
        try {
            count += 1;
            Taro.connectSocket({
                url: wsUrl
            }).then((res) => {
                res.onOpen(() => {
                    ws = res
                    console.log(ws, 'open')
                })
            })
            ws.onClose(() => {
                ws = undefined;
                setTimeout(initWebSocket, 5000 * count);
            })
            // ws.onMessage((msg: any) => {
            //     const data = JSON.parse(msg.data);
            //     console.log(data)
            // })
        } catch (error) {
            setTimeout(initWebSocket, 5000 * count);
        }
    }
    timer = setInterval(() => {
        try {
            ws?.send({ data: JSON.stringify({ "type": "ping" }) })
        } catch (error) {
            console.error(error, '发送心跳错误');
        }
    }, 2000);
    if (ws) {
        console.log(ws, 'return')
        return ws;

    }

}

const getWebSocket =async (id: string, topic: string, parameter: any) => {
    const thisWs =await initWebSocket();
    console.log(thisWs)

    return new Promise<any>((resolve, reject) => {
        const msg = JSON.stringify({ id, topic, parameter, type: 'sub' });
        const tempQueue: any[] = [];
        // const thisWs = initWebSocket();
        if (thisWs) {
            try {
                if (thisWs.readyState === 1) {
                    thisWs.send({
                        data: msg,
                    });

                    thisWs.onMessage((res) => {
                        // resolve(JSON.parse(res.data))
                        const data = JSON.parse(res.data)
                        if (data.type === 'result') {
                            resolve(data)
                        }
                    })

                } else {
                    tempQueue.push(msg);
                }

                if (tempQueue.length > 0 && thisWs.readyState === 1) {
                    tempQueue.forEach((i: any, index: number) => {
                        thisWs.send({
                            data: i,
                        });
                        tempQueue.splice(index, 1);
                    });
                }
            } catch (error) {
                initWebSocket();
                // message.error({ key: 'ws', content: 'websocket服务连接失败' });
            }
        }
    })

}

export { initWebSocket, getWebSocket }