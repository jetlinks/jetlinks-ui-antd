export type LogItem = {
  id: string;
  deviceId: string;
  productId: string;
  timestamp: number;
  type: {
    text: string;
    value: string;
  };
  content: string;
  createTime: number;
};
