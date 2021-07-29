export type OpenApiItem = {
  id: string;
  username?: string;
  userId?: string;
  password: string;
  clientName: string;
  createTime: number;
  creatorId: string;
  description: string;
  ipWhiteList: string;
  secureKey: string;
  signature: string;
  enableOAuth2: boolean;
  redirectUrl: string;
  status: number;
};
