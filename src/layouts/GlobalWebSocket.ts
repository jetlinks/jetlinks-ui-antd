import { getAccessToken } from "@/utils/authority";

let ws: WebSocket | undefined;

const initWebSocket = () => {
    if (!ws) {
        ws = new WebSocket(`ws://192.168.3.110:8844/messaging/${getAccessToken()}`)
        ws.onclose = () => {
            ws = undefined;
            initWebSocket();
        }
    }
    return ws;
}

const getWebsocket = () => ws || initWebSocket();
export default getWebsocket;