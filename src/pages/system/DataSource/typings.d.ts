type DataSourceItem = {
  id: string;
  name: string;
  shareCluster: true;
  shareConfig: Record<string, any>;
  state?: {
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
  name: string;
  comment: string;
  length: number;
  notnull: boolean;
  precision: number;
  primaryKey: boolean;
  scale: number;
  type: string;
};
