type ResourceItem = {
  id: string;
  name: string;
  targetId: string;
  targetType: string;
  sourceId: string;
  sourceType: string;
  sourceName: string;
  metadata: string;
  state: {
    value: string;
    text: string;
  };
  properties: any;
  category?: string;
  createTime: string | number;
};
