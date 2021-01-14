export class MediaGateway {
  id: string;
  name: string;
  description: string;
  productId: string;
  mediaServerId: string;
  status: {
    value: string,
    text: string,
  };
  sipConfig: sipConfig;
}

export interface sipConfig {
  sipId: string,
  domain: string,
  charset: string,
  password: string,
  localAddress: string,
  port: number,
  publicPort: number,
  options: any,
}

