type StreamItem = {
  id?: string;
  name: string;
  description?: string;
  provider: string;
  configuration: {
    secret?: string;
    apiHost: string;
    apiPort: number;
    rtpIp: string;
    rtpPort: number;
    dynamicRtpPort: boolean;
    dynamicRtpPortRange: number[];
  };
  state: {
    value: string;
    text: string;
  };
};
