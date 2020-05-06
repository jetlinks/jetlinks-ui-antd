import React, { useEffect } from 'react';
import { getAccessToken } from "@/utils/authority";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

export const handleWebsocket: Partial<{
    sendMessage: any;
    sendJsonMessage: any;
    lastMessage: any;
    lastJsonMessage: any;
    readyState: any;
    getWebSocket: any;
}> = {};
const WebSocketOption = () => {

    const socketUrl = `ws://192.168.3.110:8844/messaging/${getAccessToken()}`;

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket
    } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        onError: () => console.log('报错了'),
        shouldReconnect: closeEvent => true,
    });

    handleWebsocket.sendMessage = sendMessage;
    handleWebsocket.sendJsonMessage = sendJsonMessage;
    handleWebsocket.lastMessage = lastMessage;
    handleWebsocket.lastJsonMessage = lastJsonMessage;
    handleWebsocket.readyState = readyState;
    handleWebsocket.getWebSocket = getWebSocket;

    useEffect(() => {
        if (getAccessToken()) {
            // window.wsOption = websocket;
            sendMessage(JSON.stringify({ "type": "sub", "topic": "/dashboard/systemMonitor/cpu/usage/realTime", "id": "123" }))
        }
    }, []);
    return (<></>);
}

export default WebSocketOption;