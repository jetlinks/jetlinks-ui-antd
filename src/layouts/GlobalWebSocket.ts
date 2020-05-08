import { getAccessToken } from "@/utils/authority";
import proxy from "../../config/proxy";

let ws: WebSocket | undefined;
let count = 0;
const initWebSocket = () => {
    if (!ws && count < 5) {
        try {
            count += 1;
            ws = new WebSocket(`${proxy.dev["/jetlinks"].ws || '/jetlinks'}/messaging/${getAccessToken()}`)
            ws.onclose = () => {
                ws = undefined;
                setTimeout(initWebSocket, 50000 * count);
            }
        } catch (error) {
            setTimeout(initWebSocket, 50000 * count);
        }
    }
    return ws;
}

const getWebsocket = () => ws || initWebSocket();
export default getWebsocket;