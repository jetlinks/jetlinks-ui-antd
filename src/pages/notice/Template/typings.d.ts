type TemplateItem = {
  id: string;
  name: string;
  type: string;
  template: any;
  provider: string;
  creatorId: string;
  createTime: number;
  variableDefinitions: any;
};

type LogItem = {
  id: string;
  config: string;
  sendTime: number;
  state: string;
};
