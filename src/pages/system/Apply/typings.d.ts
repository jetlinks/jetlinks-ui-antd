type ApplyItem = {
  id: string;
  name: string;
  description: string;
  provider: string;
  integrationModes: string[];
  page?: Record<string, unknown>;
  apiServer?: Record<string, unknown>;
  sso?: Record<string, unknown>;
  state: any;
  creatorId: string;
  createTime: number;
};
