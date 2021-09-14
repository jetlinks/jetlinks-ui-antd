type DataSourceItem = {
  id: string;
  name: string;
  shareCluster: true;
  shareConfig: Record<string, any>;
  state: {
    text: string;
    value: string;
  };
  typeId: string;
  createTime: number;
  creatorId: string;
  creatorName: string;
  description: string;
};

type DataSourceType = {
  label: string;
  value: string;
  id: string;
  name: string;
};
