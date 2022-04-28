type TemplateItem = {
  id: string;
  name: string;
  type: string;
  template: any;
  provider: string;
  creatorId: string;
  createTime: number;
  variableDefinitions: any;
  description: string;
};

type LogItem = {
  id: string;
  config: string;
  sendTime: number;
  state: string;
  errorStack?: string;
  context?: string;
};
