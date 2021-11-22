import Taro from "@tarojs/taro";
import getBaseUrl from "../service/baseUrl";
import getToken from "./getToken";

type Data = {
    id: string;
    topic: string;
    parameter: any;
    type: string;
}

let message: any = {};
const getWebsocket = (data?: any) => {
    const msg = JSON.stringify(data);
    const wsUrl = `${getBaseUrl('/jetlinks/messaging').replace('http', 'ws')}`;

    Taro.connectSocket({
        url: `${wsUrl}/jetlinks/messaging?${getToken()}?:X_Access_Token=${getToken()}`
    })
        .then((res) => {
            res.onOpen(() => {
                console.log('连接成功')
                res.send({ data: msg })
            })
            res.onMessage((msg) => {
                message = msg;
                console.log(message)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    // return message;
}

export default getWebsocket;