type OpaUa = {
  id: string;
  name: string;
  clientConfigs?: Record<string, any>[];
  description?: string;
  state: {
    text: string;
    value: string;
  };
};
