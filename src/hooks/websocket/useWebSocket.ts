import { useEffect, useRef, useState } from 'react';
import { usePersistFn, useUnmount } from 'ahooks';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';

export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

export interface Options {
  // reconnectLimit?: number;
  // reconnectInterval?: number;
  manual?: boolean;
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
  onMessage?: (message: WebSocketEventMap['message']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
  onReconnect?: () => void;
}

export interface Result {
  latestMessage?: WebSocketEventMap['message'];
  sendMessage?: WebSocket['send'];
  disconnect?: () => void;
  connect?: () => void;
  readyState: ReadyState;
  webSocketIns?: WebSocket;
}

export default function useWebSocket(socketUrl: string, options: Options = {}): Result {
  const {
    // reconnectLimit = 3,
    // reconnectInterval = 3 * 1000,
    manual = false,
    onOpen,
    onClose,
    onMessage,
    onReconnect,
    onError,
  } = options;

  const reconnectTimesRef = useRef(0); // 重连次数
  const reconnectTimerRef = useRef<NodeJS.Timeout>(); // 计时器
  const websocketRef = useRef<WebSocket>();
  const lockReconnect = useRef(false); // 避免重复连接
  const isReconnect = useRef(false);

  const [latestMessage, setLatestMessage] = useState<WebSocketEventMap['message']>();
  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.Closed);

  const connectWs = usePersistFn(() => {
    const ws = Store.get(SystemConst.GLOBAL_WEBSOCKET) as WebSocket;
    if (ws) {
      setReadyState(ws?.readyState);
    } else {
      // if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);

      // if (websocketRef.current) {
      //   // 此处应考虑状态。
      //   websocketRef.current.close();
      // }

      try {
        // console.log(websocketRef.current, 'current');
        websocketRef.current = new WebSocket(socketUrl);

        websocketRef.current.onerror = (event) => {
          isReconnect.current = true; // 开启重连
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          reconnect();
          onError?.(event);
          setReadyState(websocketRef.current?.readyState || ReadyState.Closed);
        };
        websocketRef.current.onopen = (event) => {
          if (isReconnect.current && onReconnect) {
            // 是否为重连
            onReconnect();
          }
          onOpen?.(event);
          reconnectTimesRef.current = 0;
          setReadyState(websocketRef.current?.readyState || ReadyState.Closed);
        };
        websocketRef.current.onmessage = (message: WebSocketEventMap['message']) => {
          onMessage?.(message);
          setLatestMessage(message);
        };
        websocketRef.current.onclose = (event) => {
          isReconnect.current = true; // 开启重连
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          reconnect();
          onClose?.(event);
          setReadyState(websocketRef.current?.readyState || ReadyState.Closed);
          Store.set(SystemConst.GLOBAL_WEBSOCKET, null);
        };
        Store.set(SystemConst.GLOBAL_WEBSOCKET, websocketRef.current);
      } catch (error) {
        throw new Error(error as string);
      }
    }
  });

  const getTime = (time: number): number => {
    const m = 60 * 1000;
    if (time <= 5) {
      return 3000;
    } else if (time > 5 && time <= 10) {
      return 10000;
    } else if (time > 10 && time <= 20) {
      return m;
    }
    return 5 * m;
  };

  /**
   * 重连
   */
  const reconnect = usePersistFn(() => {
    if (lockReconnect.current) {
      return;
    }

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    lockReconnect.current = true;
    const _time = getTime(reconnectTimesRef.current);
    reconnectTimerRef.current = setTimeout(() => {
      lockReconnect.current = false;
      reconnectTimesRef.current += 1;
      connectWs();
    }, _time);
  });

  /**
   * 发送消息
   * @param message
   */
  const sendMessage: WebSocket['send'] = usePersistFn((message) => {
    const ws = Store.get(SystemConst.GLOBAL_WEBSOCKET) as WebSocket;
    setReadyState(ws?.readyState);
    if (readyState === ReadyState.Open) {
      ws.send(message);
    } else {
      connectWs();
      // todo 考虑重写
      setTimeout(() => {
        ws.send(message);
      }, 3000);
      // throw new Error('WebSocket disconnected');
    }
  });

  /**
   * 手动 connect
   */
  const connect = usePersistFn(() => {
    reconnectTimesRef.current = 0;
    connectWs();
  });

  /**
   * disconnect websocket
   */
  const disconnect = usePersistFn(() => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);

    reconnectTimesRef.current = 0;
    websocketRef.current?.close();
  });

  useEffect(() => {
    // 初始连接
    if (!manual) {
      connect();
    }
  }, [socketUrl, manual]);

  useUnmount(() => {
    disconnect();
  });

  return {
    latestMessage,
    sendMessage,
    connect,
    disconnect,
    readyState,
    webSocketIns: websocketRef.current,
  };
}
