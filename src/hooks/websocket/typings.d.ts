export type WebsocketPayload = {
  payload: {
    timeString: string;
    timestamp: number;
    value: number | Record<string, any>;
  };
  requestId: string;
  topic: string;
  type: 'complete' | 'error' | 'result';
  message?: string;
};
